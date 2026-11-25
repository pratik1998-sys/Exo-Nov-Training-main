import { RequestContext } from "@context/request";
import { AccountService } from "@feature-account";
import { Address } from "@feature-address";
import { Cart, CartAddressInput, CartCheckout, CartItemAddInput, CartItemDeleteInput, CartItemUpdateInput, CartPaymentMethodInput, CartPaymentOptions, CartService, CartShippingMethodInput, CartShippingOptions, CartUpdateInput } from "@feature-commerce/cart";
import { ItemFilterInput, ShippingMethodResultSet } from "@feature-commerce/common";
import { PaginationInput, SortByInput } from "@feature/models";
import { CreateCartEn, SAPCommerceBaseServiceImpl, SAPCommerceConsumerConfiguration, UpdateCartEn } from "@plugin-sap-commerce/common";
import { SAPCommerceCartMapper } from "./sap-commerce.cart.mapper";
import { SAPCommerceCartDatasource } from "./sap-commerce.cart.datasource";
import { SAPCommerceCartErrors } from "./sap-commerce.cart.error";
import { SAPCommerceOrderDatasource, SAPCommerceOrderMapper, SAPCommerceDeliveryModes } from "@plugin-sap-commerce/features/order";
import { SAPCommerceCart } from "@plugin-sap-commerce/features/quote";
import { StringUtility } from "@utilities";

export class SAPCommerceCartServiceImpl extends SAPCommerceBaseServiceImpl implements CartService {
    private readonly currentCartId: string = 'current';

    async getCart(id: string, filterInput: ItemFilterInput, paginationInput: PaginationInput, sortByInput: SortByInput, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${SAPCommerceCartServiceImpl.name}.getCart`;

        id = this.resolveCartId(requestContext, id);

        const dsCart: SAPCommerceCart = await this.executeGetCart(requestContext, id);

        // await this.getCartDatasource(requestContext).deleteCart(requestContext, id);

        return this.getCartMapper(requestContext).mapCart(requestContext, dsCart);
    }

    async deleteCart(id: string, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${SAPCommerceCartServiceImpl.name}.deleteCart`;

        id = this.resolveCartId(requestContext, id);

        const cart = await this.getCart(id, null, null, null, requestContext, context);

        try {
            await this.getCartDatasource(requestContext).deleteCart(requestContext, id);
        } catch (error) {
            this.logger.info(`${methodname} - Error deleting cart [${id}]: ${this.logger.formatJSON(error)}`, requestContext);
            throw SAPCommerceCartErrors.deleteCartFailed();
        }

        return cart;
    }

    async updateCart(
        id: string,
        cartUpdateInput: CartUpdateInput,
        filterInput: ItemFilterInput,
        paginationInput: PaginationInput,
        sortByInput: SortByInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<Cart> {
        const methodname = `${SAPCommerceCartServiceImpl.name}.updateCart`;

        this.validateCartUpdateInput(requestContext, cartUpdateInput);

        id = this.resolveCartId(requestContext, id);

        await this.executeUpdateCartEmail(requestContext, id, cartUpdateInput.email);

        return await this.getCart(id, null, null, null, requestContext, context);
    }

    protected async executeUpdateCartEmail(requestContext: RequestContext, id: string, email: string) {
        const methodname = `${SAPCommerceCartServiceImpl.name}.executeUpdateCartEmail`;

        email = email.trim();

        try {
            await this.getCartDatasource(requestContext).updateCartEmail(requestContext, id, email);
        } catch (error) {
            this.logger.info(`${methodname} - Error updating cart [${id}] - Email: ${email} : ${this.logger.formatJSON(error)}`, requestContext);
            throw SAPCommerceCartErrors.updateCartFailed();
        }
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
        const methodname = `${SAPCommerceCartServiceImpl.name}.addCartItems`;

        if (StringUtility.isStringEmpty(id)) {
            const dsCart = await this.executeCreateCart(requestContext);

            id = dsCart.code;
        }

        for await (const item of items) {
            const body: CreateCartEn.Body = this.composeAddCartItemBody(requestContext, item);

            try {
                const dsCartModification = await this.getCartDatasource(requestContext).addCartItem(requestContext, id, body);
            } catch (error) {
                this.logger.info(`${methodname} - Error adding item to cart [${id}] - (${this.logger.formatJSON(body)})`, requestContext);
                throw SAPCommerceCartErrors.addCartItemsFailed();
            }
        }

        return await this.getCart(id, null, null, null, requestContext, context);
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
        const methodname = `${SAPCommerceCartServiceImpl.name}.updateCartItems`;

        const quantityField = 'quantity';

        this.sortCartItemInput(requestContext, items);

        id = this.resolveCartId(requestContext, id);

        const deleteItemList: CartItemDeleteInput[] = [];

        for await (const item of items) {
            if (item.hasOwnProperty(quantityField) && item.quantity <= 0) {
                deleteItemList.push({ id: item.id });
            } else {
                const body: UpdateCartEn.Body = this.composeUpdateCartItemBody(requestContext, item);

                try {
                    const dsCartModification = await this.getCartDatasource(requestContext).updateCartItem(requestContext, id, item.id, body);
                } catch (error) {
                    this.logger.info(`${methodname} - Error updating item [${item.id}] in cart [${id}] - (${this.logger.formatJSON(body)})`, requestContext);
                    throw SAPCommerceCartErrors.updateCartItemsFailed();
                }
            }
        }

        if (deleteItemList.length > 0) {
            await this.executeDeleteCartItems(requestContext, id, deleteItemList);
        }

        return await this.getCart(id, null, null, null, requestContext, context);
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
        const methodname = `${SAPCommerceCartServiceImpl.name}.deleteCartItems`;

        this.sortCartItemInput(requestContext, items);

        id = this.resolveCartId(requestContext, id);

        await this.executeDeleteCartItems(requestContext, id, items);

        return await this.getCart(id, null, null, null, requestContext, context);
    }

    async precheckout(id: string, filterInput: ItemFilterInput, paginationInput: PaginationInput, sortByInput: SortByInput, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${SAPCommerceCartServiceImpl.name}.precheckout`;

        id = this.resolveCartId(requestContext, id);

        let dsCart: SAPCommerceCart = null;

        try {
            dsCart = await this.executeValidateCart(requestContext, id);
        } catch (error) {
            throw SAPCommerceCartErrors.precheckoutFailed();
        }

        return await this.getCart(id, null, null, null, requestContext, context);
    }

    async checkout(id: string, requestContext: RequestContext, context?: any): Promise<CartCheckout> {
        const methodname = `${SAPCommerceCartServiceImpl.name}.checkout`;

        if (StringUtility.isStringEmpty(id)) {
            throw SAPCommerceCartErrors.cartCheckoutMissingCartId();
        }

        let dsOrder = null;

        const orderDatasource = this.getDatasource<SAPCommerceOrderDatasource>(requestContext, SAPCommerceOrderDatasource);

        try {
            if (this.isB2B(requestContext)) {
                dsOrder = await orderDatasource.createB2BOrder(requestContext, id, true);
            } else {
                dsOrder = await orderDatasource.createOrder(requestContext, id);
            }
        } catch (error) {
            this.logger.info(`${methodname} - Error executing cart checkout [${id}]: ${this.logger.formatJSON(error)}`, requestContext);
            SAPCommerceCartErrors.checkoutFailed();
        }

        return await this.getMapper<SAPCommerceOrderMapper>(requestContext, SAPCommerceOrderMapper).mapOrder(requestContext, dsOrder);
    }

    async getShippingOptions(id: string, requestContext: RequestContext, context?: any): Promise<CartShippingOptions> {
        const methodname = `${SAPCommerceCartServiceImpl.name}.getShippingOptions`;

        id = this.resolveCartId(requestContext, id);

        const async: [Promise<Address[]>, Promise<ShippingMethodResultSet>] = [this.fetchShippingAddresses(requestContext), this.getShippingMethods(id, null, requestContext, context)];

        const results = await Promise.all(async);

        const [addresses, shippingMethodResultSet] = results;

        const shippingOptions: CartShippingOptions = {
            addresses,
            shippingMethods: shippingMethodResultSet?.results || [],
        };

        return shippingOptions;
    }

    async getShippingMethods(id: string, paginationInput: PaginationInput, requestContext: RequestContext, context?: any): Promise<ShippingMethodResultSet> {
        id = this.resolveCartId(requestContext, id);

        const shippingMethods: SAPCommerceDeliveryModes = await this.fetchShippingMethods(requestContext, id);

        return {
            pagination: {
                pageSize: shippingMethods?.deliveryModes?.length || 0,
                pageCount: 1,
                resultCount: shippingMethods?.deliveryModes?.length || 0,
                hasMorePages: false,
                page: 1,
            },
            results: this.getCartMapper(requestContext).mapShippingMethods(requestContext, shippingMethods),
        };
    }

    async getPaymentOptions(id: string, requestContext: RequestContext, context?: any): Promise<CartPaymentOptions> {
        const methodname = `${SAPCommerceCartServiceImpl.name}.getPaymentOptions`;

        id = this.resolveCartId(requestContext, id);

        throw new Error('Method not implemented.');
    }

    async addCouponCode(id: string, couponCode: string, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${SAPCommerceCartServiceImpl.name}.addCouponCode`;

        id = this.resolveCartId(requestContext, id);

        try {
            await this.getCartDatasource(requestContext).addPromotion(requestContext, id, couponCode);
        } catch (error) {
            this.logger.info(`${methodname} - Error adding promotion [${couponCode}] to cart [${id}]: ${this.logger.formatJSON(error)}`, requestContext);
            throw SAPCommerceCartErrors.addCouponCodeFailed();
        }

        return await this.getCart(id, null, null, null, requestContext, context);
    }

    async removeCouponCode(id: string, couponCodeId: string, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${SAPCommerceCartServiceImpl.name}.removeCouponCode`;

        id = this.resolveCartId(requestContext, id);

        try {
            await this.getCartDatasource(requestContext).deletePromotion(requestContext, id, couponCodeId);
        } catch (error) {
            this.logger.info(`${methodname} - Error removing promotion [${couponCodeId}] from cart [${id}]: ${this.logger.formatJSON(error)}`, requestContext);
            throw SAPCommerceCartErrors.removeCouponCodeFailed();
        }

        return await this.getCart(id, null, null, null, requestContext, context);
    }

    async mergeCarts(fromCartId: string, toCartId: string, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${SAPCommerceCartServiceImpl.name}.mergeCarts`;

        throw new Error('Method not implemented.');
    }

    async updateShipping(id: string, addressInput: CartAddressInput, shippingMethod: CartShippingMethodInput, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${SAPCommerceCartServiceImpl.name}.updateShipping`;

        id = this.resolveCartId(requestContext, id);

        const cartDS = this.getCartDatasource(requestContext);

        if (addressInput) {
            try {
                if (StringUtility.isStringNotEmpty(addressInput.id)) {
                    await cartDS.updateDeliveryAddress(requestContext, id, addressInput.id);
                } else {
                    const dsAddressInput = this.translateSAPCommerceAddressInput(requestContext, addressInput);

                    await cartDS.createDeliveryAddress(requestContext, id, dsAddressInput);
                }
            } catch (error) {
                this.logger.info(`${methodname} - Error updating shipping address for cart [${id}] - [${this.logger.formatJSON(addressInput)}]: ${this.logger.formatJSON(error)}`, requestContext);
                throw SAPCommerceCartErrors.updateCartShippingAddressFailed();
            }
        }

        if (shippingMethod) {
            try {
                await cartDS.updateDeliveryMode(requestContext, id, shippingMethod.id || shippingMethod.identifier);
            } catch (error) {
                this.logger.info(`${methodname} - Error updating shipping method for cart [${id}] - [${this.logger.formatJSON(shippingMethod)}]: ${this.logger.formatJSON(error)}`, requestContext);
                throw SAPCommerceCartErrors.updateCartShippingFailed();
            }
        }

        return await this.getCart(id, null, null, null, requestContext, context);
    }

    async addPayments(id: string, paymentMethods: CartPaymentMethodInput[], isSplitPayment: boolean, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${SAPCommerceCartServiceImpl.name}.addPayments`;

        id = this.resolveCartId(requestContext, id);

        throw new Error('Method not implemented.');
    }

    async executeValidateCart(requestContext: RequestContext, id: string) {
        const methodname = `${SAPCommerceCartServiceImpl.name}.executeValidateCart`;

        let dsCart: SAPCommerceCart = null;

        try {
            dsCart = await this.getCartDatasource(requestContext).validateCart(requestContext, id);
        } catch (error) {
            this.logger.info(`${methodname} - Error validating cart [${id}]: ${this.logger.formatJSON(error)}`, requestContext);
            throw error;
        }

        return dsCart;
    }

    protected async executeCreateCart(requestContext: RequestContext): Promise<SAPCommerceCart> {
        const methodname = `${SAPCommerceCartServiceImpl.name}.executeCreateCart`;

        let dsCart: SAPCommerceCart = null;

        try {
            dsCart = await this.getCartDatasource(requestContext).createCart(requestContext);
        } catch (error) {
            this.logger.info(`${methodname} - Error creating cart: ${this.logger.formatJSON(error)}`, requestContext);
            throw SAPCommerceCartErrors.createCartFailed();
        }

        return dsCart;
    }

    protected async executeGetCart(requestContext: RequestContext, id: string) {
        const methodname = `${SAPCommerceCartServiceImpl.name}.executeGetCart`;

        let dsCart: SAPCommerceCart;

        try {
            dsCart = await this.getCartDatasource(requestContext).getCart(requestContext, id);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching cart [${id}]: ${this.logger.formatJSON(error)}`, requestContext);
            throw SAPCommerceCartErrors.getCartFailed();
        }

        return dsCart;
    }

    protected async executeDeleteCartItems(requestContext: RequestContext, id: string, items: CartItemDeleteInput[]) {
        const methodname = `${SAPCommerceCartServiceImpl.name}.executeDeleteCartItems`;

        for (const [index, value] of items.entries()) {
            try {
                await this.getCartDatasource(requestContext).deleteCartItem(requestContext, id, `${parseInt(value.id) - index}`);
            } catch (error) {
                this.logger.info(`${methodname} - Error deleting item [${value.id}] in cart [${id}]`, requestContext);
                throw SAPCommerceCartErrors.deleteCartItemsFailed();
            }
        }
    }

    //TODO - Return valid shipping addresses for b2c customer or b2b unit
    protected async fetchShippingAddresses(requestContext: RequestContext): Promise<Address[]> {
        const { configuration } = this.getPluginConsumerConfiguration<SAPCommerceConsumerConfiguration>(requestContext);

        let shippingAddresses: Address[] = [];

        if (configuration.isB2B) {
            shippingAddresses = await this.fetchAccountShippingAddress(requestContext);
        }

        return shippingAddresses;
    }

    protected async fetchShippingMethods(requestContext: RequestContext, cartId: string): Promise<SAPCommerceDeliveryModes> {
        const dsDeliveryModes: SAPCommerceDeliveryModes = await this.getCartDatasource(requestContext).getDeliveryModes(requestContext, cartId);

        return dsDeliveryModes;
    }

    protected async fetchAccountShippingAddress(requestContext: RequestContext): Promise<Address[]> {
        const account = await this.getService<AccountService>(requestContext, AccountService).getAccount(requestContext.account, requestContext);

        return account?.addresses;
    }

    protected resolveCartId(requestContext: RequestContext, id: string) {
        if (StringUtility.isStringEmpty(id)) {
            throw SAPCommerceCartErrors.missingCartId();
        }

        return id;
    }

    protected validateCartUpdateInput(requestContext: RequestContext, cartUpdateInput: CartUpdateInput) {
        if (!cartUpdateInput.email) {
            throw SAPCommerceCartErrors.cartUpdateInvalidAction();
        }
    }

    /**
     * Sorts the items list as the "id" of cart items is just the "entryNumber" field which is the current index of the items
     * in the SAP Commerce Cart. This value gets updated when items are removed via delete or quantity update to 0
     *
     * @param requestContext
     * @param items
     */
    protected sortCartItemInput(requestContext: RequestContext, items: CartItemUpdateInput[] | CartItemDeleteInput[]) {
        items.sort((a, b) => {
            return parseInt(a.id) - parseInt(b.id);
        });
    }

    protected composeAddCartItemBody(requestContext: RequestContext, itemInput: CartItemAddInput): CreateCartEn.Body {
        const body: CreateCartEn.Body = {
            product: {
                code: itemInput.identifier,
            },
            quantity: itemInput.quantity,
        };

        return body;
    }

    protected composeUpdateCartItemBody(requestContext: RequestContext, itemInput: CartItemUpdateInput): UpdateCartEn.Body {
        const body: UpdateCartEn.Body = {
            entryNumber: parseInt(itemInput.id),
            quantity: itemInput.quantity,
        };

        return body;
    }

    protected getCartDatasource(requestContext: RequestContext) {
        return this.getDatasource<SAPCommerceCartDatasource>(requestContext, SAPCommerceCartDatasource);
    }

    protected getCartMapper(requestContext: RequestContext) {
        return this.getMapper<SAPCommerceCartMapper>(requestContext, SAPCommerceCartMapper);
    }
}
