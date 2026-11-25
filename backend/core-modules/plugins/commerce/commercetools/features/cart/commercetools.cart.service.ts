import { RequestContext } from "@context/request";
import { Address, AddressService, AddressInput } from "@feature-address";
import { CartService, Cart, CartUpdateInput, CartItemAddInput, CartItemUpdateInput, CartItemDeleteInput, CartShippingOptions, CartPaymentOptions, CartAddressInput, CartShippingMethodInput, CartPaymentMethodInput, CartCheckout, CartErrors } from "@feature-commerce/cart";
import { ItemFilterInput, ShippingMethodResultSet, ShippingMethod } from "@feature-commerce/common";
import { PaginationInput, SortByInput } from "@feature/models";
import { CommercetoolsEntityQueryParams, CommercetoolsEntityActionRequest, CommercetoolsEntityAction } from "@plugin-commercetools/common";
import { CommercetoolsAddressMapper } from "@plugin-commercetools/features/address";
import { CartActions, CommercetoolsCart, CommercetoolsCartActionAddDiscountCode, CommercetoolsCartActionRemoveDiscountCode, CommercetoolsCartAddPayment, CommercetoolsCartCreateBody, CommercetoolsCartLineItem, CommercetoolsCartSetBillingAddress, CommercetoolsCreateOrderFromCartBody } from "./schema/commercetools.cart.schema";
import { CommercetoolsOrder, CommercetoolsOrderMapper } from "@plugin-commercetools/features/order";
import { CommercetoolsQuoteServiceImpl, CommercetoolsShippingMethod, CommercetoolsShippingMethodResultSet } from "@plugin-commercetools/features/quote";
import { StringUtility } from "@utilities";
import { CommercetoolsCartDatasource } from "./commercetools.cart.datasource";
import { CommercetoolsCartMapper } from "./commercetools.cart.mapper";
import { CommercetoolsCartConsumerConfiguration } from "./commercetools.cart.configuration.type";


export class CommercetoolsCartServiceImpl extends CommercetoolsQuoteServiceImpl implements CartService {
    protected readonly currentCartId: string = 'current';

    async getCart(id: string, filterInput: ItemFilterInput, paginationInput: PaginationInput, sortByInput: SortByInput, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${CommercetoolsCartServiceImpl.name}.getCart`;

        let dsCart: CommercetoolsCart = await this.fetchCart(requestContext, id, null, false);

        return await this.finalizeCart(requestContext, dsCart);
    }

    async deleteCart(id: string, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${CommercetoolsCartServiceImpl.name}.deleteCart`;

        let dsCart: CommercetoolsCart = await this.fetchCart(requestContext, id, null);

        const query = this.composeQuery_deleteCart(requestContext, dsCart);

        try {
            await this.getCartDatasource(requestContext).deleteCart(requestContext, dsCart.id, null, query);
        } catch (error) {
            this.logger.info(`${methodname} - Error deleting cart [${dsCart.id}]: ${this.logger.formatJSON(error)}`, requestContext);
            throw CartErrors.deleteCartFailed();
        }

        return await this.finalizeCart(requestContext, dsCart);
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
        const methodname = `${CommercetoolsCartServiceImpl.name}.addCartItems`;

        let dsCart: CommercetoolsCart;

        const token = this.getPluginToken(requestContext);

        if (!token?.isRegistered && (StringUtility.isStringEmpty(id) || id == this.currentCartId)) {
            dsCart = await this.createCart(requestContext);
        } else {
            dsCart = await this.fetchCart(requestContext, id, null, true);
        }

        const query = this.composeQuery_updateCart(requestContext, dsCart);

        const body = this.composeBody_addLineItems(requestContext, dsCart, items);

        try {
            return await this.executeUpdateCartWithFinalize(requestContext, dsCart, body, query);
        } catch (error) {
            throw CartErrors.addCartItemsFailed();
        }
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
        const methodname = `${CommercetoolsCartServiceImpl.name}.addCartItems`;

        let dsCart: CommercetoolsCart = await this.fetchCart(requestContext, id, null, true);

        const query = this.composeQuery_updateCart(requestContext, dsCart);

        const body = this.composeBody_updateLineItems(requestContext, dsCart, items);

        try {
            return await this.executeUpdateCartWithFinalize(requestContext, dsCart, body, query);
        } catch (error) {
            throw CartErrors.updateCartItemsFailed();
        }
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
        const methodname = `${CommercetoolsCartServiceImpl.name}.deleteCartItems`;

        let dsCart: CommercetoolsCart = await this.fetchCart(requestContext, id, null, true);

        const query = this.composeQuery_updateCart(requestContext, dsCart);

        const body = this.composeBody_removeLineItems(requestContext, dsCart, items);

        try {
            return await this.executeUpdateCartWithFinalize(requestContext, dsCart, body, query);
        } catch (error) {
            throw CartErrors.deleteCartItemsFailed();
        }
    }

    async addCouponCode(id: string, couponCode: string, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${CommercetoolsCartServiceImpl.name}.addCouponCode`;

        let dsCart: CommercetoolsCart = await this.fetchCart(requestContext, id, null, true);

        const query = this.composeQuery_updateCart(requestContext, dsCart);

        const body = this.composeBody_addDiscountCode(requestContext, dsCart, couponCode);

        try {
            return await this.executeUpdateCartWithFinalize(requestContext, dsCart, body, query);
        } catch (error) {
            throw CartErrors.addCouponCodeFailed();
        }
    }

    async removeCouponCode(id: string, couponCodeId: string, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${CommercetoolsCartServiceImpl.name}.removeCouponCode`;

        let dsCart: CommercetoolsCart = await this.fetchCart(requestContext, id, null, true);

        const query = this.composeQuery_updateCart(requestContext, dsCart);

        const body = this.composeBody_removeDiscountCode(requestContext, dsCart, couponCodeId);

        try {
            return await this.executeUpdateCartWithFinalize(requestContext, dsCart, body, query);
        } catch (error) {
            throw CartErrors.removeCouponCodeFailed();
        }
    }

    async getShippingMethods(id: string, paginationInput: PaginationInput, requestContext: RequestContext, context?: any): Promise<ShippingMethodResultSet> {
        const dsShippingMethods = await this.fetchShippingMethods(requestContext, id);

        const shippingMethods: ShippingMethod[] = this.getCartMapper(requestContext).mapShippingMethods(requestContext, dsShippingMethods);

        return {
            pagination: {
                pageSize: shippingMethods.length,
                pageCount: 1,
                resultCount: shippingMethods.length,
                hasMorePages: false,
                page: 1,
            },
            results: shippingMethods,
        };
    }

    async getShippingOptions(id: string, requestContext: RequestContext, context?: any): Promise<CartShippingOptions> {
        const methodname = `${CommercetoolsCartServiceImpl.name}.getShippingOptions`;

        const shippingMethodResultSet = await this.getShippingMethods(id, null, requestContext, context);

        return {
            addresses: await this.getAddresses(requestContext),
            shippingMethods: shippingMethodResultSet?.results ?? [],
        };
    }

    async getPaymentOptions(id: string, requestContext: RequestContext, context?: any): Promise<CartPaymentOptions> {
        const methodname = `${CommercetoolsCartServiceImpl.name}.getPaymentOptions`;

        return {
            addresses: await this.getAddresses(requestContext),
            paymentMethods: [],
        };
    }

    async updateShipping(id: string, addressInput: CartAddressInput, shippingMethod: CartShippingMethodInput, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${CommercetoolsCartServiceImpl.name}.updateShipping`;

        let dsCart: CommercetoolsCart = await this.fetchCart(requestContext, id, null, true);

        const query = this.composeQuery_updateCart(requestContext, dsCart);

        const address = await this.resolveAddress(requestContext, addressInput);

        const body = this.composeBody_updateShipping(requestContext, dsCart, address, shippingMethod);

        try {
            return await this.executeUpdateCartWithFinalize(requestContext, dsCart, body, query);
        } catch (error) {
            throw CartErrors.updateCartShippingFailed();
        }
    }

    /**
     * TODO - NOT Production worthy - Demo only
     *
     * @param id
     * @param paymentMethods
     * @param isSplitPayment
     * @param requestContext
     * @param context
     */
    async addPayments(id: string, paymentMethods: CartPaymentMethodInput[], isSplitPayment: boolean, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${CommercetoolsCartServiceImpl.name}.updateShipping`;

        let dsCart: CommercetoolsCart = await this.fetchCart(requestContext, id, null, true);

        const query = this.composeQuery_updateCart(requestContext, dsCart);

        const body = await this.composeBody_updatePayment(requestContext, dsCart, paymentMethods);

        try {
            return await this.executeUpdateCartWithFinalize(requestContext, dsCart, body, query);
        } catch (error) {
            throw CartErrors.addPaymentsFailed();
        }
    }

    async precheckout(id: string, filterInput: ItemFilterInput, paginationInput: PaginationInput, sortByInput: SortByInput, requestContext: RequestContext, context?: any): Promise<Cart> {
        let dsCart: CommercetoolsCart = await this.fetchCart(requestContext, id, null, false);

        return await this.finalizeCart(requestContext, dsCart);
    }

    async checkout(id: string, requestContext: RequestContext, context?: any): Promise<CartCheckout> {
        const methodname = `${CommercetoolsCartServiceImpl.name}.checkout`;

        const customerId = requestContext.user?.id;

        const isByCartIdentifier = StringUtility.isStringNotEmpty(id);
        const isByCustomerId = !isByCartIdentifier && customerId;

        if (!isByCartIdentifier && !isByCustomerId) {
            throw CartErrors.missingCartId();
        }

        let dsCart: CommercetoolsCart = await this.fetchCart(requestContext, id, null, false);

        if (!dsCart) {
            throw CartErrors.getCartFailed();
        }

        const body = this.composeBody_createOrderFromCart(requestContext, dsCart);

        const query = this.composeQuery_getCartCheckoutOrder(requestContext);

        const dsOrder = await this.executeCartCheckout(requestContext, body, query);

        return await this.finalizeAndMapCartCheckoutOrder(requestContext, dsOrder);
    }

    protected async executeCartCheckout(requestContext: RequestContext, body: CommercetoolsCreateOrderFromCartBody, query: CommercetoolsEntityQueryParams): Promise<CommercetoolsOrder> {
        const methodname = `${CommercetoolsCartServiceImpl.name}.executeCartCheckout`;

        let dsOrder: CommercetoolsOrder;

        try {
            dsOrder = await this.getCartDatasource(requestContext).createOrderFromCart(requestContext, body, query);
        } catch (error) {
            this.logger.info(`${methodname} - Error creating executing cart checkout - ${this.logger.formatJSON(body)}: ${this.logger.formatJSON(error)}`);
            throw CartErrors.checkoutFailed();
        }

        return dsOrder;
    }

    protected composeBody_createOrderFromCart(requestContext: RequestContext, dsCart: CommercetoolsCart) {
        const body: CommercetoolsCreateOrderFromCartBody = {
            version: dsCart.version,
            cart: {
                id: dsCart.id,
                typeId: 'cart',
            },
            orderNumber: this.composeOrderNumber(requestContext, dsCart),
        };

        return body;
    }

    protected composeOrderNumber(requestContext: RequestContext, dsCart: CommercetoolsCart) {
        const { configuration } = this.getPluginConsumerConfiguration<CommercetoolsCartConsumerConfiguration>(requestContext);

        let orderNumber = `${Math.floor(100000 + Math.random() * 900000)}`;

        if (StringUtility.isStringNotEmpty(configuration.orderNumberPrefix)) {
            orderNumber = `${configuration.orderNumberPrefix}-${orderNumber}`;
        }

        return orderNumber;
    }

    protected composeQuery_getCartCheckoutOrder(requestContext: RequestContext) {
        return this.composeQuery_getQuote(requestContext);
    }

    protected async finalizeCartCheckoutOrder(requestContext: RequestContext, dsOrder: CommercetoolsOrder) {
        await super.finalizeQuote(requestContext, dsOrder);
    }

    protected async finalizeAndMapCartCheckoutOrder(requestContext: RequestContext, dsOrder: CommercetoolsOrder): Promise<CartCheckout> {
        await this.finalizeCartCheckoutOrder(requestContext, dsOrder);

        return this.getMapper<CommercetoolsOrderMapper>(requestContext, CommercetoolsOrderMapper).mapOrder(requestContext, dsOrder);
    }

    protected async resolveAddress(requestContext: RequestContext, addressInput: CartAddressInput): Promise<Address> {
        let address: Address = addressInput;

        if (addressInput.id) {
            address = await this.getService<AddressService>(requestContext, AddressService).getAddress(addressInput.id, requestContext);
        }

        return address;
    }

    protected async fetchShippingMethods(requestContext: RequestContext, id: string): Promise<CommercetoolsShippingMethod[]> {
        const methodname = `${CommercetoolsCartServiceImpl.name}.fetchShippingMethods`;

        let dsShippingMethods: CommercetoolsShippingMethod[] = [];

        let dsCart: CommercetoolsCart = await this.fetchCart(requestContext, id, null, true);

        if (dsCart.shippingAddress) {
            let dsShippingMethodResultSet: CommercetoolsShippingMethodResultSet;

            const query = this.composeQuery_shippingMethods(requestContext);

            try {
                dsShippingMethodResultSet = await this.getCartDatasource(requestContext).getShippingMethods(requestContext, dsCart.id, query);
            } catch (error) {
                this.logger.info(`${methodname} - Error fetching shipping methods for cart [${dsCart.id}]: ${this.logger.formatJSON(error)}`);
                throw CartErrors.getCartShippingMethodsFailed();
            }

            dsShippingMethods = dsShippingMethodResultSet.results?.filter((shippingMethod) => shippingMethod.active);
        }

        return dsShippingMethods;
    }

    protected async getAddresses(requestContext: RequestContext): Promise<Address[]> {
        let addresses: Address[] = [];

        const token = this.getPluginToken(requestContext);

        if (token?.isRegistered) {
            const addressResultSet = await this.getService<AddressService>(requestContext, AddressService).getAddresses(null, null, requestContext);

            addresses = addressResultSet.results;
        }

        return addresses;
    }

    protected async resolveCartId(requestContext: RequestContext, id: string) {
        if (StringUtility.isStringEmpty(id) || id == this.currentCartId) {
            id = null;

            const dsCart = await this.fetchCart(requestContext, id, null, true);

            id = dsCart.id;
        }

        return id;
    }

    protected async executeUpdateCart(requestContext: RequestContext, dsCart: CommercetoolsCart, body: CommercetoolsEntityActionRequest, query: CommercetoolsEntityQueryParams) {
        const methodname = `${CommercetoolsCartServiceImpl.name}.deleteCartItems`;

        try {
            dsCart = await this.getCartDatasource(requestContext).updateCart(requestContext, dsCart.id, null, body, query);
        } catch (error) {
            this.logger.info(`${methodname} - Error updating cart [${dsCart.id}] - ${this.logger.formatJSON(body)}: ${this.logger.formatJSON(error)}`, requestContext);
            throw error;
        }

        return dsCart;
    }

    protected async executeUpdateCartWithFinalize(requestContext: RequestContext, dsCart: CommercetoolsCart, body: CommercetoolsEntityActionRequest, query: CommercetoolsEntityQueryParams) {
        dsCart = await this.executeUpdateCart(requestContext, dsCart, body, query);

        return await this.finalizeCart(requestContext, dsCart);
    }

    protected async finalizeCart(requestContext: RequestContext, dsCart: CommercetoolsCart): Promise<Cart> {
        await super.finalizeQuote(requestContext, dsCart);

        return this.getCartMapper(requestContext).mapCart(requestContext, dsCart);
    }

    protected async fetchCart(requestContext: RequestContext, id: string, key: string, doCreate: boolean = false) {
        const methodname = `${CommercetoolsCartServiceImpl.name}.fetchCart`;

        let dsCart: CommercetoolsCart;

        const customerId = requestContext.user?.id;

        const isByCartIdentifier = (StringUtility.isStringNotEmpty(id) && id != this.currentCartId) || StringUtility.isStringNotEmpty(key);
        const isByCustomerId = !isByCartIdentifier && customerId;

        if (!isByCartIdentifier && !isByCustomerId) {
            throw CartErrors.missingCartId();
        }

        if (isByCustomerId) {
            id = null;
        }

        const query = this.composeQuery_getCart(requestContext);

        try {
            dsCart = await this.getCartDatasource(requestContext).getCart(requestContext, id, key, customerId, query);
        } catch (error) {
            if (!error.message?.statusCode || error.message.statusCode != 404 || !doCreate) {
                if (isByCartIdentifier) {
                    this.logger.info(`${methodname} - Error fetching cart [${id || key}] - ${this.logger.formatJSON(error)}`, requestContext);
                } else {
                    this.logger.info(`${methodname} - Error fetching cart for customer [${customerId}] - ${this.logger.formatJSON(error)}`, requestContext);
                }

                throw CartErrors.getCartFailed();
            }
        }

        if (!dsCart && doCreate) {
            dsCart = await this.createCart(requestContext);
        }

        return dsCart;
    }

    protected async createCart(requestContext: RequestContext): Promise<CommercetoolsCart> {
        const methodname = `${CommercetoolsCartServiceImpl.name}.createCart`;

        let dsCart: CommercetoolsCart;

        const query = this.composeQuery_getCart(requestContext);

        const body = await this.composeBody_cartCreate(requestContext);

        try {
            dsCart = await this.getCartDatasource(requestContext).createCart(requestContext, body, query);
        } catch (error) {
            this.logger.info(`${methodname} - Error creating cart - ${this.logger.formatJSON(error)}`, requestContext);
            throw CartErrors.createCartFailed();
        }

        return dsCart;
    }

    async mergeCarts(fromCartId: string, toCartId: string, requestContext: RequestContext, context?: any): Promise<Cart> {
        throw new Error('Method not implemented.');
    }

    protected async composeBody_cartCreate(requestContext: RequestContext) {
        const { configuration } = this.getPluginConsumerConfiguration<CommercetoolsCartConsumerConfiguration>(requestContext);

        const defaultAddress = await this.resolveDefaultCartAddress(requestContext);

        const body: CommercetoolsCartCreateBody = {
            customerId: requestContext.user?.id,
            currency: configuration.defaultCurrency,
            deleteDaysAfterLastModification: configuration.deleteCartAfterDays,
        };

        if (defaultAddress) {
            body.shippingAddress = defaultAddress;
            body.billingAddress = defaultAddress;
        }

        return body;
    }

    protected async resolveDefaultCartAddress(requestContext: RequestContext): Promise<Address> {
        let addressInput: Address;

        const addresses = await this.getAddresses(requestContext);

        const addressMapper = this.getMapper<CommercetoolsAddressMapper>(requestContext, CommercetoolsAddressMapper);

        const defaultAddress = addresses.length > 0 ? addresses.find((address) => address.isDefault) : null;

        addressInput = defaultAddress ? addressMapper.composeAddressInput(requestContext, defaultAddress) : null;

        return addressInput;
    }

    protected composeBody_addDiscountCode(requestContext: RequestContext, dsCart: CommercetoolsCart, code: string) {
        const body = this.composeEntityAction(dsCart.version);

        body.actions.push(this.composeAction_addDiscountCode(requestContext, dsCart, code));

        return body;
    }

    protected composeBody_removeDiscountCode(requestContext: RequestContext, dsCart: CommercetoolsCart, id: string) {
        const body = this.composeEntityAction(dsCart.version);

        body.actions.push(this.composeAction_removeDiscountCode(requestContext, dsCart, id));

        return body;
    }

    protected composeAction_addDiscountCode(requestContext: RequestContext, dsCart: CommercetoolsCart, code: string) {
        const action: CommercetoolsCartActionAddDiscountCode = {
            action: CartActions.addDiscountCode,
            code,
        };

        return action;
    }

    protected composeAction_removeDiscountCode(requestContext: RequestContext, dsCart: CommercetoolsCart, id: string) {
        const action: CommercetoolsCartActionRemoveDiscountCode = {
            action: CartActions.removeDiscountCode,
            discountCode: {
                typeId: 'discount-code',
                id,
            },
        };

        return action;
    }

    protected composeQuery_shippingMethods(requestContext: RequestContext) {
        return super.composeQuery_shippingMethods(requestContext);
    }

    protected composeQuery_getCart(requestContext: RequestContext) {
        return this.composeQuery_getQuote(requestContext);
    }

    protected composeQuery_deleteCart(requestContext: RequestContext, dsCart: CommercetoolsCart): CommercetoolsEntityQueryParams {
        return this.composeQuery_deleteQuote(requestContext, dsCart);
    }

    protected composeQuery_updateCart(requestContext: RequestContext, dsCart: CommercetoolsCart): CommercetoolsEntityQueryParams {
        return this.composeQuery_updateQuote(requestContext, dsCart);
    }

    protected composeBody_addLineItems(requestContext: RequestContext, dsCart: CommercetoolsCart, items: CartItemAddInput[]) {
        return super.composeBody_addLineItems(requestContext, dsCart, items);
    }

    protected composeAction_addLineItem(requestContext: RequestContext, dsCart: CommercetoolsCart, item: CartItemAddInput) {
        return super.composeAction_addLineItem(requestContext, dsCart, item);
    }

    protected composeBody_updateLineItems(requestContext: RequestContext, dsCart: CommercetoolsCart, items: CartItemUpdateInput[]) {
        return super.composeBody_updateLineItems(requestContext, dsCart, items);
    }

    protected composeActions_updateLineItem(
        requestContext: RequestContext,
        dsCart: CommercetoolsCart,
        dsLineItem: CommercetoolsCartLineItem,
        item: CartItemUpdateInput,
        actions: CommercetoolsEntityAction[],
    ) {
        return super.composeActions_updateLineItem(requestContext, dsCart, dsLineItem, item, actions);
    }

    protected composeAction_updateLineItemQuantity(requestContext: RequestContext, dsCart: CommercetoolsCart, dsLineItem: CommercetoolsCartLineItem, item: CartItemUpdateInput) {
        return super.composeAction_updateLineItemQuantity(requestContext, dsCart, dsLineItem, item);
    }

    protected composeBody_removeLineItems(requestContext: RequestContext, dsCart: CommercetoolsCart, items: CartItemDeleteInput[]) {
        return super.composeBody_removeLineItems(requestContext, dsCart, items);
    }

    protected composeAction_removeLineItem(requestContext: RequestContext, dsCart: CommercetoolsCart, item: CartItemDeleteInput) {
        return super.composeAction_removeLineItem(requestContext, dsCart, item);
    }

    protected composeBody_updateShipping(requestContext: RequestContext, dsCart: CommercetoolsCart, address: AddressInput, shippingMethod: CartShippingMethodInput) {
        return super.composeBody_updateShipping(requestContext, dsCart, address, shippingMethod);
    }

    protected composeAction_setShippingAddress(requestContext: RequestContext, dsCart: CommercetoolsCart, address: AddressInput) {
        return super.composeAction_setShippingAddress(requestContext, dsCart, address);
    }

    protected composeAction_setShippingMethod(requestContext: RequestContext, dsCart: CommercetoolsCart, shippingMethod: CartShippingMethodInput) {
        return super.composeAction_setShippingMethod(requestContext, dsCart, shippingMethod);
    }

    protected async composeBody_updatePayment(requestContext: RequestContext, dsCart: CommercetoolsCart, paymentMethods: CartPaymentMethodInput[]) {
        const body = this.composeEntityAction(dsCart.version) as CommercetoolsEntityActionRequest;

        let address: CartAddressInput = null;

        if (paymentMethods?.length > 0) {
            paymentMethods.forEach((paymentMethod) => {
                address = paymentMethod.address;
                body.actions.push(this.composeAction_addPayment(requestContext, dsCart, paymentMethod));
            });
        }

        if (address) {
            address = await this.resolveAddress(requestContext, address);

            if (address) {
                body.actions.push(this.composeAction_setBillingAddress(requestContext, dsCart, address));
            }
        }

        return body;
    }

    protected composeAction_setBillingAddress(requestContext: RequestContext, dsCart: CommercetoolsCart, address: AddressInput) {
        const action: CommercetoolsCartSetBillingAddress = {
            action: CartActions.setBillingAddress,
            address: this.getMapper<CommercetoolsAddressMapper>(requestContext, CommercetoolsAddressMapper).composeAddressInput(requestContext, address),
        };

        return action;
    }

    protected composeAction_addPayment(requestContext: RequestContext, dsCart: CommercetoolsCart, paymentMethod: CartPaymentMethodInput) {
        const action: CommercetoolsCartAddPayment = {
            action: CartActions.addPayment,
            payment: {
                id: paymentMethod.id,
                typeId: 'payment',
            },
        };

        return action;
    }

    protected getCartDatasource(requestContext: RequestContext) {
        return this.getDatasource<CommercetoolsCartDatasource>(requestContext, CommercetoolsCartDatasource);
    }

    protected getCartMapper(requestContext: RequestContext) {
        return this.getMapper<CommercetoolsCartMapper>(requestContext, CommercetoolsCartMapper);
    }
}
