import { HCLCommerceBaseServiceImpl } from '@plugin-hcl-commerce/common';
import { PaginationInput, SortByInput } from '@feature/models';
import { AddressInput } from '@feature-address';
import { ItemFilterInput, PaymentMethodOption, ShippingMethodResultSet } from '@feature-commerce/common';
import { RequestContext } from '@context/request';
import { Cart, CartBillingAddressInput, CartCheckout, CartErrors, CartItemAddInput, CartItemDeleteInput, CartItemUpdateInput, CartPaymentMethodInput, CartPaymentOptions, CartService, CartShippingMethodInput, CartShippingOptions, CartUpdateInput } from '@feature-commerce/cart';
import { HCLCommerceAddPromoCodeBodyInput, HCLCommerceCartItemAddBodyInput, HCLCommerceCartItemUpdateBodyInput } from './schema/hcl-commerce.cart.gql.schema';
import { HCLCommerceCartGQLDatasource } from './hcl-commerce.graphql.cart.datasource';
import { HCLCommerceCartGQLMapper } from './hcl-commerce.graphql.cart.mapper';
import { ProductService, ProductFilterInput } from '@feature-commerce/product';

export class HCLCommerceCartGQLServiceImpl extends HCLCommerceBaseServiceImpl implements CartService {
    async precheckout(id: string, filterInput: ItemFilterInput, paginationInput: PaginationInput, sortByInput: SortByInput, requestContext: RequestContext, context?: any): Promise<Cart> {
        throw new Error('Method not implemented.');
    }
    async checkout(id: string, requestContext: RequestContext, context?: any): Promise<CartCheckout> {
        throw new Error('Method not implemented.');
    }
    async getShippingMethods(id: string, paginationInput: PaginationInput, requestContext: RequestContext, context?: any): Promise<ShippingMethodResultSet> {
        throw new Error('Method not implemented.');
    }
    async deleteCart(id: string, requestContext: RequestContext, context?: any): Promise<Cart> {
        throw new Error('Method not implemented.');
    }
    async presubmitCart(id: string, filterInput: ItemFilterInput, paginationInput: PaginationInput, sortByInput: SortByInput, requestContext: RequestContext, context?: any): Promise<Cart> {
        throw new Error('Method not implemented.');
    }
    async addPayments(id: string, paymentMethods: CartPaymentMethodInput[], isSplitPayment: boolean, requestContext: RequestContext, context?: any): Promise<Cart> {
        throw new Error('Method not implemented.');
    }
    async getShippingOptions(id: string, requestContext: RequestContext, context?: any): Promise<CartShippingOptions> {
        throw new Error('Method not implemented.');
    }
    async getPaymentOptions(id: string, requestContext: RequestContext, context?: any): Promise<CartPaymentOptions> {
        throw new Error('Method not implemented.');
    }
    async updateShipping(id: string, addressInput: AddressInput, shippingMethod: CartShippingMethodInput, requestContext: RequestContext, context?: any): Promise<Cart> {
        throw new Error('Method not implemented.');
    }

    async getCart(id: string, filterInput: ItemFilterInput, paginationInput: PaginationInput, sortByInput: SortByInput, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${HCLCommerceCartGQLServiceImpl.name}.getCart`;

        let dsCart;

        try {
            dsCart = await this.getDatasource<HCLCommerceCartGQLDatasource>(requestContext).getCart(requestContext);

            const productOrderItemMap: Record<string, any> = {};

            dsCart?.orderItem.forEach((dsOrderItem) => {
                if (!productOrderItemMap[dsOrderItem.partNumber]) {
                    productOrderItemMap[dsOrderItem.partNumber] = [];
                }

                productOrderItemMap[dsOrderItem.partNumber].push(dsOrderItem);
            });

            const productFilter: ProductFilterInput = {
                product: {
                    identifiers: Object.keys(productOrderItemMap).map((partNumber) => partNumber),
                },
            };

            const productService = this.getService<ProductService>(requestContext, ProductService);

            const products = await productService.getProducts(productFilter, null, null, requestContext, context, true);

            products.results?.forEach((product) => {
                productOrderItemMap[product.identifier].forEach((dsOrderItem) => {
                    dsOrderItem.product = product;
                });
            });
        } catch (error) {
            this.logger.error(`${methodname} - Error fetching cart: ${this.logger.formatJSON(error)}`, requestContext);
            throw CartErrors.getCartFailed();
        }

        return this.getMapper<HCLCommerceCartGQLMapper>(requestContext).mapCart(requestContext, dsCart);
    }

    async updateCart(
        id: string,
        updateCartInput: CartUpdateInput,
        filterInput: ItemFilterInput,
        paginationInput: PaginationInput,
        sortByInput: SortByInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<Cart> {
        const methodname = `${HCLCommerceCartGQLServiceImpl.name}.updateCart`;

        throw new Error('Method not implemented.');
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
        const methodname = `${HCLCommerceCartGQLServiceImpl.name}.addCartItems`;

        let dsCart;

        const body: HCLCommerceCartItemAddBodyInput = {
            orderItem: items.map((item) => {
                return {
                    partNumber: item.identifier,
                    quantity: `${item.quantity}`,
                };
            }),
            xCalculateOrder: '1',
            xCalculationUsage: '-1,-2,-3,-4,-5,-6,-7',
            xInventoryValidation: 'true',
        };

        try {
            const dsResult = await this.getDatasource<HCLCommerceCartGQLDatasource>(requestContext).addOrderItems(requestContext, body);
        } catch (error) {
            this.logger.error(`${methodname} - Error adding cart items: ${this.logger.formatJSON(items)} ${error}`, requestContext);
            throw CartErrors.addCartItemsFailed();
        }

        return await this.getCart(id, filterInput, paginationInput, sortByInput, requestContext, context);
    }

    async updateCartItems(
        id: string,
        items: CartItemUpdateInput[],
        filterInput: ItemFilterInput,
        paginationInput: PaginationInput,
        sortByInput: SortByInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<Cart> {
        const methodname = `${HCLCommerceCartGQLServiceImpl.name}.updateCartItems`;

        let dsCart;

        const body: HCLCommerceCartItemUpdateBodyInput = {
            orderItem: items.map((item) => {
                return {
                    orderItemId: item.id,
                    quantity: `${item.quantity}`,
                };
            }),
        };

        try {
            const dsResult = await this.getDatasource<HCLCommerceCartGQLDatasource>(requestContext).updateOrderItems(requestContext, body);
        } catch (error) {
            this.logger.error(`${methodname} - Error updating cart items: ${this.logger.formatJSON(items)} ${this.logger.formatJSON(error)}`, requestContext);
            throw CartErrors.updateCartItemsFailed();
        }

        return await this.getCart(id, filterInput, paginationInput, sortByInput, requestContext, context);
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
        const methodname = `${HCLCommerceCartGQLServiceImpl.name}.deleteCartItems`;

        let dsCart;

        const body: HCLCommerceCartItemUpdateBodyInput = {
            orderItem: items.map((item) => {
                return {
                    orderItemId: item.id,
                    quantity: '0',
                };
            }),
        };

        try {
            const dsResult = await this.getDatasource<HCLCommerceCartGQLDatasource>(requestContext).updateOrderItems(requestContext, body);
        } catch (error) {
            this.logger.error(`${methodname} - Error deleting cart items: ${this.logger.formatJSON(items)} ${this.logger.formatJSON(error)}`, requestContext);
            throw CartErrors.deleteCartItemsFailed();
        }

        return await this.getCart(id, filterInput, paginationInput, sortByInput, requestContext, context);
    }

    async getPaymentMethods(id: string, requestContext: RequestContext, context?: any): Promise<PaymentMethodOption[]> {
        const methodname = `${HCLCommerceCartGQLServiceImpl.name}.getPaymentMethods`;

        throw new Error('Method not implemented.');
    }

    async addShippingAddress(id: string, addressInput: AddressInput, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${HCLCommerceCartGQLServiceImpl.name}.addShippingAddress`;

        throw new Error('Method not implemented.');
    }

    async addBillingAddress(id: string, addressInput: CartBillingAddressInput, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${HCLCommerceCartGQLServiceImpl.name}.addBillingAddress`;

        throw new Error('Method not implemented.');
    }

    async addShippingMethod(id: string, shippingMethod: CartShippingMethodInput, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${HCLCommerceCartGQLServiceImpl.name}.addShippingMethod`;

        throw new Error('Method not implemented.');
    }

    async addPaymentMethod(id: string, paymentMethod: CartPaymentMethodInput, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${HCLCommerceCartGQLServiceImpl.name}.addPaymentMethod`;

        throw new Error('Method not implemented.');
    }

    async addCouponCode(id: string, couponCode: string, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${HCLCommerceCartGQLServiceImpl.name}.addCouponCode`;

        let dsCart;

        const body: HCLCommerceAddPromoCodeBodyInput = {
            promoCode: couponCode,
        };

        try {
            const dsResult = await this.getDatasource<HCLCommerceCartGQLDatasource>(requestContext).addPromoCode(requestContext, body);
        } catch (error) {
            this.logger.error(`${methodname} - Error adding coupon code: ${couponCode} ${this.logger.formatJSON(error)}`, requestContext);
            throw CartErrors.addCouponCodeFailed();
        }

        return await this.getCart(id, null, null, null, requestContext, context);
    }

    async removeCouponCode(id: string, couponCodeId: string, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${HCLCommerceCartGQLServiceImpl.name}.removeCouponCode`;

        let dsCart;

        try {
            const dsResult = await this.getDatasource<HCLCommerceCartGQLDatasource>(requestContext).deletePromoCode(requestContext, couponCodeId);
        } catch (error) {
            this.logger.error(`${methodname} - Error deleting coupon code: ${couponCodeId} ${this.logger.formatJSON(error)}`, requestContext);
            throw CartErrors.removeCouponCodeFailed();
        }

        return await this.getCart(id, null, null, null, requestContext, context);
    }

    async mergeCarts(fromCartId: string, toCartId: string, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${HCLCommerceCartGQLServiceImpl.name}.mergeCarts`;

        throw new Error('Method not implemented.');
    }
}
