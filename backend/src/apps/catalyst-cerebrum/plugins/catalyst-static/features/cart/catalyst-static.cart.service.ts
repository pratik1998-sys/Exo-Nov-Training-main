import { randomUUID } from 'crypto';
import { RequestContext } from '@context/request';
import {
    Cart,
    CartAddressInput,
    CartCheckout,
    CartErrors,
    CartItem,
    CartItemAddInput,
    CartItemDeleteInput,
    CartItemResultSet,
    CartItemUpdateInput,
    CartPaymentMethodInput,
    CartPaymentOptions,
    CartService,
    CartShippingMethodInput,
    CartShippingOptions,
    CartUpdateInput,
} from '@feature-commerce/cart';
import { ItemFilterInput, ShippingMethodResultSet } from '@feature-commerce/common';
import { PaginationInput, SortByInput } from '@feature/models';
import { BasePluginServiceImpl } from '@plugin/service';
import { In, Repository } from 'typeorm';

import { CatalystStaticProductData } from '../product/catalyst-static.product.data';
import { CatalystStaticProductEntity } from '../product/entities/catalyst-static.product.entity';
import { CatalystStaticCartItemEntity } from './entities/catalyst-static.cart-item.entity';
import { CatalystStaticCartEntity } from './entities/catalyst-static.cart.entity';

/**
 * Postgres-backed cart. The cart id exposed to clients is `public.cart.identifier`, the item id is
 * `public.cart_item.id`. Prices are never stored: every read prices the lines from `public.product`.
 *
 * Implemented: getCart, addCartItems, updateCartItems, deleteCartItems, deleteCart.
 * The remaining CartService methods (coupons, shipping, payments, checkout, ...) are not implemented.
 */
export class CatalystStaticCartServiceImpl extends BasePluginServiceImpl implements CartService {
    protected getCartRepository(): Repository<CatalystStaticCartEntity> {
        return this.getRepository<Repository<CatalystStaticCartEntity>>(CatalystStaticCartEntity);
    }

    protected getCartItemRepository(): Repository<CatalystStaticCartItemEntity> {
        return this.getRepository<Repository<CatalystStaticCartItemEntity>>(CatalystStaticCartItemEntity);
    }

    protected getProductRepository(): Repository<CatalystStaticProductEntity> {
        return this.getRepository<Repository<CatalystStaticProductEntity>>(CatalystStaticProductEntity);
    }

    // Money is summed in cents so that "0.10 + 0.20" never turns into 0.30000000000000004.
    protected toCents(value?: string): number {
        return Math.round(parseFloat(value ?? '0') * 100);
    }

    protected toMoney(cents: number) {
        return { value: (cents / 100).toFixed(2), currency: CatalystStaticProductData.currency };
    }

    protected async findCart(id: string): Promise<CatalystStaticCartEntity> {
        if (!id) throw CartErrors.missingCartId();

        const cart = await this.getCartRepository().findOne({ where: { identifier: id } });
        if (!cart) throw CartErrors.getCartFailed();

        return cart;
    }

    /** Resolves "p-001" or "TEE-001" style identifiers to products, keyed by the requested identifier. */
    protected async findProducts(identifiers: string[]): Promise<Map<string, CatalystStaticProductEntity>> {
        const products = await this.getProductRepository().find({
            where: [{ identifier: In(identifiers) }, { sku: In(identifiers) }],
        });

        const byRequested = new Map<string, CatalystStaticProductEntity>();
        for (const identifier of identifiers) {
            const product = products.find((p) => p.identifier === identifier) ?? products.find((p) => p.sku === identifier);
            if (product) byRequested.set(identifier, product);
        }

        return byRequested;
    }

    protected async toCart(cart: CatalystStaticCartEntity, pagination: PaginationInput, requestContext: RequestContext): Promise<Cart> {
        const lines = await this.getCartItemRepository().find({ where: { cartId: cart.id }, order: { id: 'ASC' } });

        const products = lines.length ? await this.getProductRepository().find({ where: { identifier: In(lines.map((l) => l.productIdentifier)) } }) : [];

        let totalCents = 0;
        let itemQuantity = 0;

        const cartItems: CartItem[] = lines.map((line) => {
            const product = products.find((p) => p.identifier === line.productIdentifier);
            const unitCents = product ? this.toCents(product.price) : 0;
            const amountCents = unitCents * line.quantity;

            totalCents += amountCents;
            itemQuantity += line.quantity;

            return {
                id: `${line.id}`,
                identifier: line.productIdentifier,
                quantity: line.quantity,
                product: product
                    ? {
                          id: product.identifier,
                          identifier: product.identifier,
                          slug: product.slug,
                          sku: product.sku,
                          name: product.name,
                          description: product.description,
                          thumbnail: { url: `https://picsum.photos/seed/${product.slug}/480/360`, altText: product.name },
                      }
                    : undefined,
                pricing: { price: this.toMoney(unitCents), amount: this.toMoney(amountCents) },
            } as CartItem;
        });

        return {
            id: cart.identifier,
            identifier: cart.identifier,
            createdOn: cart.createdOn?.toISOString(),
            updatedOn: cart.updatedOn?.toISOString(),
            itemQuantity,
            pricing: { total: this.toMoney(totalCents), amount: this.toMoney(totalCents) },
            items: this.composeResultSetWithPagination<CartItemResultSet>(pagination, cartItems, requestContext),
        } as Cart;
    }

    async getCart(id: string, filterInput: ItemFilterInput, paginationInput: PaginationInput, sortByInput: SortByInput, requestContext: RequestContext, context?: any): Promise<Cart> {
        const cart = await this.findCart(id);

        return this.toCart(cart, paginationInput, requestContext);
    }

    async addCartItems(
        id: string,
        items: CartItemAddInput[],
        filterInput: ItemFilterInput,
        paginationInput: PaginationInput,
        sortByInput: SortByInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<Cart> {
        // Validate everything before writing so a bad item never leaves a half-filled cart behind.
        const existing = id ? await this.findCart(id) : null;

        const identifiers = (items ?? []).map((item) => item.identifier);
        if (!identifiers.length || identifiers.some((identifier) => !identifier)) throw CartErrors.addCartItemsFailed();
        if (items.some((item) => !Number.isInteger(item.quantity ?? 1) || (item.quantity ?? 1) < 1)) throw CartErrors.addCartItemsFailed();

        const products = await this.findProducts(identifiers);
        if (identifiers.some((identifier) => !products.has(identifier))) throw CartErrors.addCartItemsFailed();

        const cartId = await this.getDatabaseConnection().transaction(async (manager) => {
            const cart = existing ?? (await manager.save(CatalystStaticCartEntity, manager.create(CatalystStaticCartEntity, { identifier: randomUUID() })));

            for (const item of items) {
                const productIdentifier = products.get(item.identifier).identifier;
                const quantity = item.quantity ?? 1;

                const line = await manager.findOne(CatalystStaticCartItemEntity, { where: { cartId: cart.id, productIdentifier } });

                if (line) {
                    await manager.update(CatalystStaticCartItemEntity, { id: line.id }, { quantity: line.quantity + quantity });
                } else {
                    await manager.save(CatalystStaticCartItemEntity, manager.create(CatalystStaticCartItemEntity, { cartId: cart.id, productIdentifier, quantity }));
                }
            }

            await manager.update(CatalystStaticCartEntity, { id: cart.id }, { updatedOn: new Date() });

            return cart.id;
        });

        const cart = await this.getCartRepository().findOne({ where: { id: cartId } });

        return this.toCart(cart, paginationInput, requestContext);
    }

    /** A quantity of 0 (or less) removes the line. */
    async updateCartItems(
        id: string,
        items: CartItemUpdateInput[],
        filterInput: ItemFilterInput,
        paginationInput: PaginationInput,
        sortByInput: SortByInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<Cart> {
        const cart = await this.findCart(id);

        if (!items?.length || items.some((item) => !Number.isInteger(Number(item.id)) || !Number.isInteger(item.quantity))) throw CartErrors.updateCartItemsFailed();

        await this.getDatabaseConnection().transaction(async (manager) => {
            for (const item of items) {
                const line = await manager.findOne(CatalystStaticCartItemEntity, { where: { id: Number(item.id), cartId: cart.id } });
                if (!line) throw CartErrors.updateCartItemsFailed();

                if (item.quantity > 0) {
                    await manager.update(CatalystStaticCartItemEntity, { id: line.id }, { quantity: item.quantity });
                } else {
                    await manager.delete(CatalystStaticCartItemEntity, { id: line.id });
                }
            }

            await manager.update(CatalystStaticCartEntity, { id: cart.id }, { updatedOn: new Date() });
        });

        return this.toCart(await this.findCart(id), paginationInput, requestContext);
    }

    async deleteCartItems(
        id: string,
        items: CartItemDeleteInput[],
        filterInput: ItemFilterInput,
        paginationInput: PaginationInput,
        sortByInput: SortByInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<Cart> {
        const cart = await this.findCart(id);

        if (!items?.length || items.some((item) => !Number.isInteger(Number(item.id)))) throw CartErrors.deleteCartItemsFailed();

        const itemIds = [...new Set(items.map((item) => Number(item.id)))];

        await this.getDatabaseConnection().transaction(async (manager) => {
            const lines = await manager.find(CatalystStaticCartItemEntity, { where: { id: In(itemIds), cartId: cart.id } });
            if (lines.length !== itemIds.length) throw CartErrors.deleteCartItemsFailed();

            await manager.delete(CatalystStaticCartItemEntity, { id: In(itemIds) });
            await manager.update(CatalystStaticCartEntity, { id: cart.id }, { updatedOn: new Date() });
        });

        return this.toCart(await this.findCart(id), paginationInput, requestContext);
    }

    /** Deletes the cart and its lines (ON DELETE CASCADE) and returns the cart as it was. */
    async deleteCart(id: string, requestContext: RequestContext, context?: any): Promise<Cart> {
        const cart = await this.findCart(id);
        const result = await this.toCart(cart, null, requestContext);

        await this.getCartRepository().delete({ id: cart.id });

        return result;
    }

    // --- Not implemented ---

    async updateCart(
        id: string,
        cartUpdateInput: CartUpdateInput,
        filterInput: ItemFilterInput,
        paginationInput: PaginationInput,
        sortByInput: SortByInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<Cart> {
        throw new Error('Method not implemented.');
    }
    async precheckout(id: string, filterInput: ItemFilterInput, paginationInput: PaginationInput, sortByInput: SortByInput, requestContext: RequestContext, context?: any): Promise<Cart> {
        throw new Error('Method not implemented.');
    }
    async checkout(id: string, requestContext: RequestContext, context?: any): Promise<CartCheckout> {
        throw new Error('Method not implemented.');
    }
    async getShippingMethods(id: string, paginationInput: PaginationInput, requestContext: RequestContext, context?: any): Promise<ShippingMethodResultSet> {
        throw new Error('Method not implemented.');
    }
    async getShippingOptions(id: string, requestContext: RequestContext, context?: any): Promise<CartShippingOptions> {
        throw new Error('Method not implemented.');
    }
    async getPaymentOptions(id: string, requestContext: RequestContext, context?: any): Promise<CartPaymentOptions> {
        throw new Error('Method not implemented.');
    }
    async addCouponCode(id: string, couponCode: string, requestContext: RequestContext, context?: any): Promise<Cart> {
        throw new Error('Method not implemented.');
    }
    async removeCouponCode(id: string, couponCodeId: string, requestContext: RequestContext, context?: any): Promise<Cart> {
        throw new Error('Method not implemented.');
    }
    async mergeCarts(fromCartId: string, toCartId: string, requestContext: RequestContext, context?: any): Promise<Cart> {
        throw new Error('Method not implemented.');
    }
    async updateShipping(id: string, addressInput: CartAddressInput, shippingMethod: CartShippingMethodInput, requestContext: RequestContext, context?: any): Promise<Cart> {
        throw new Error('Method not implemented.');
    }
    async addPayments(id: string, paymentMethods: CartPaymentMethodInput[], isSplitPayment: boolean, requestContext: RequestContext, context?: any): Promise<Cart> {
        throw new Error('Method not implemented.');
    }
}
