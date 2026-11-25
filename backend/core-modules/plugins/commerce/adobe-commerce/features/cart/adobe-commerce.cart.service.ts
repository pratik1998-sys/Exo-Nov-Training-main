import { RequestContext } from "@context/request";
import { AdobeCommerceBaseServiceImpl } from "@plugin-adobe-commerce/common";
import { Cart, CartAddressInput, CartBillingAddressInput, CartCheckout, CartErrors, CartItemAddInput, CartItemDeleteInput, CartItemUpdateInput, CartPaymentMethodInput, CartPaymentOptions, CartService, CartShippingMethodInput, CartShippingOptions, CartUpdateInput } from "@feature-commerce/cart";
import { AddressInput } from "@feature-address";
import { ItemFilterInput, PaymentMethodOption, ShippingMethodResultSet } from "@feature-commerce/common";
import { ECUser, ECUserService } from "@feature-commerce/ec-user";
import { PaginationInput, SortByInput } from "@feature/models";
import { AdobeCommerceCartDatasource } from "./adobe-commerce.cart.datasource";
import { AdobeCommerceCartMapper } from "./adobe-commerce.cart.mapper";
import { AdobeCommerceCart, AdobeCommerceCartItemInput, AdobeCommerceAddProductsToCartOutput, AdobeCommerceCartItemUpdateInput, AdobeCommerceUpdateCartItemsOutput, AdobeCommerceBaseAddressInput, AdobeCommerceShippingAddressInput, AdobeCommerceBillingAddressInput, AdobeCommerceShippingMethodInput, AdobeCommercePaymentMethodInput } from "./schema/adobe-commerce.cart.schema";
import { AdobeCommerceCustomerOrder, AdobeCommerceOrderMapper } from "@plugin-adobe-commerce/features/order";
import { StringUtility } from "@utilities";

export class AdobeCommerceCartServiceImpl extends AdobeCommerceBaseServiceImpl implements CartService {
    async deleteCart(id: string, requestContext: RequestContext, context?: any): Promise<Cart> {
        throw new Error('Method not implemented.');
    }

    async getShippingOptions(id: string, requestContext: RequestContext, context?: any): Promise<CartShippingOptions> {
        const methodname = `${AdobeCommerceCartServiceImpl.name}.getShippingOptions`;

        const customer = await this.fetchUser(requestContext);

        //return this.getMapper<AdobeCommerceCartMapper>(requestContext).mapShippingOptions(requestContext, customer.addresses, []);

        return {
            addresses: customer?.addresses,
            shippingMethods: [],
        };
    }

    async updateShipping(id: string, addressInput: AddressInput, shippingMethod: CartShippingMethodInput, requestContext: RequestContext, context?: any): Promise<Cart> {
        await this.addShippingAddress(id, addressInput, requestContext, context);

        return await this.addShippingMethod(id, shippingMethod, requestContext, context);
    }

    async getCart(id: string, filterInput: ItemFilterInput, paginationInput: PaginationInput, sortByInput: SortByInput, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${AdobeCommerceCartServiceImpl.name}.getCart`;

        let dsCart: AdobeCommerceCart;

        const token = this.getPluginToken(requestContext);

        if (token?.isRegistered) {
            //Logged in user
            try {
                dsCart = await this.getDatasource<AdobeCommerceCartDatasource>(requestContext).getCustomerCart(requestContext);
            } catch (error) {
                this.logger.info(`${methodname} - Error getting authenticated cart: ${error}`, requestContext);
                throw CartErrors.getCartFailed();
            }
        } else {
            id = await this.validateCartId(requestContext, id, true);

            try {
                dsCart = await this.getDatasource<AdobeCommerceCartDatasource>(requestContext).getCartById(requestContext, id);
            } catch (error) {
                this.logger.info(`${methodname} - Error getting guest cart ${id}: ${error}`, requestContext);
                throw CartErrors.getCartFailed();
            }
        }

        return this.getMapper<AdobeCommerceCartMapper>(requestContext).mapCart(requestContext, dsCart);
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
        const methodname = `${AdobeCommerceCartServiceImpl.name}.updateCart`;

        await this.validateCartId(requestContext, id);

        let dsCart: AdobeCommerceCart;
        if (StringUtility.isStringNotEmpty(updateCartInput.email)) {
            const result = await this.getDatasource<AdobeCommerceCartDatasource>(requestContext).setGuestEmailOnCart(requestContext, id, updateCartInput.email);

            dsCart = result.cart;
        }

        return this.getMapper<AdobeCommerceCartMapper>(requestContext).mapCart(requestContext, dsCart);
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
        const methodname = `${AdobeCommerceCartServiceImpl.name}.addCartItems`;

        id = await this.validateCartId(requestContext, id, true);

        let dsCart: AdobeCommerceCart;

        const cartItemsInput: AdobeCommerceCartItemInput[] = items.map((item) => {
            const obj: AdobeCommerceCartItemInput = {
                sku: item.identifier,
                quantity: item.quantity,
            };

            if (item.options) {
                obj.selected_options = item.options;
            }

            return obj;
        });

        try {
            const result: AdobeCommerceAddProductsToCartOutput = await this.getDatasource<AdobeCommerceCartDatasource>(requestContext).addProductsToCart(requestContext, id, cartItemsInput);

            dsCart = result?.cart;

            if (result?.user_errors.length > 0) {
                throw CartErrors.addCartItemsFailed();
            }
        } catch (error) {
            this.logger.info(`${methodname} - Error adding cart items: ${error}`, requestContext);
            throw CartErrors.addCartItemsFailed();
        }

        return this.getMapper<AdobeCommerceCartMapper>(requestContext).mapCart(requestContext, dsCart);
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
        const methodname = `${AdobeCommerceCartServiceImpl.name}.updateCartItems`;

        await this.validateCartId(requestContext, id);

        let dsCart: AdobeCommerceCart;

        const cartItemsInput: AdobeCommerceCartItemUpdateInput[] = items.map((item) => {
            return {
                cart_item_uid: item.id,
                quantity: item.quantity,
            };
        });

        try {
            const result: AdobeCommerceUpdateCartItemsOutput = await this.getDatasource<AdobeCommerceCartDatasource>(requestContext).updateCartItems(requestContext, id, cartItemsInput);

            dsCart = result?.cart;
            //TODO handle the user_errors field in the result;
        } catch (error) {
            this.logger.info(`${methodname} - Error updating cart items: ${error}`, requestContext);
            throw CartErrors.updateCartItemsFailed();
        }

        return this.getMapper<AdobeCommerceCartMapper>(requestContext).mapCart(requestContext, dsCart);
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
        const methodname = `${AdobeCommerceCartServiceImpl.name}.deleteCartItems`;

        const deleteItems: CartItemUpdateInput[] = items.map((item) => {
            return {
                id: item.id,
                quantity: 0,
            };
        });

        return await this.updateCartItems(id, deleteItems, filterInput, paginationInput, sortByInput, requestContext, context);
    }

    async mergeCarts(fromCartId: string, toCartId: string, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${AdobeCommerceCartServiceImpl.name}.mergeCarts`;

        let dsCart: AdobeCommerceCart;

        const token = this.getPluginToken(requestContext);

        if (!token?.isRegistered) {
            throw CartErrors.customerNotLoggedIn();
        }

        try {
            dsCart = await this.getDatasource<AdobeCommerceCartDatasource>(requestContext).mergeCarts(requestContext, fromCartId, toCartId);
        } catch (error) {
            this.logger.info(`${methodname} - Error executing merge carts from ${fromCartId} to ${toCartId}`);
        }

        return this.getMapper<AdobeCommerceCartMapper>(requestContext).mapCart(requestContext, dsCart);
    }

    async getPaymentOptions(id: string, requestContext: RequestContext, context?: any): Promise<CartPaymentOptions> {
        const methodname = `${AdobeCommerceCartServiceImpl.name}.getPaymentOptions`;

        const customer = await this.fetchUser(requestContext);

        const paymentMethods: PaymentMethodOption[] = [
            {
                id: 'credit_card',
                identifier: 'credit_card',
                description: 'Credit Card',
                type: 'CREDITCARD',
            },
        ];

        return {
            paymentMethods,
            addresses: customer?.addresses,
        };
    }

    protected transformAddressInput(addressInput: CartAddressInput, requestContext: RequestContext): AdobeCommerceBaseAddressInput {
        let address: AdobeCommerceShippingAddressInput;

        if (addressInput.id) {
            address = {
                customer_address_id: parseInt(addressInput.id),
            };
        } else {
            address = {
                address: {
                    firstname: addressInput.firstName,
                    middlename: addressInput.middleName,
                    lastname: addressInput.lastName,
                    city: addressInput.city,
                    region: addressInput.state,
                    postcode: addressInput.postalCode,
                    country_code: addressInput.country,
                    telephone: addressInput.phone,
                    save_in_address_book: addressInput.doSave,
                    street: [],
                },
            };

            if (addressInput.line1) {
                address.address.street.push(addressInput.line1);
            }

            if (addressInput.line2) {
                address.address.street.push(addressInput.line2);
            }

            if (addressInput.line3) {
                address.address.street.push(addressInput.line3);
            }
        }

        return address;
    }

    protected async addShippingAddress(id: string, addressInput: AddressInput, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${AdobeCommerceCartServiceImpl.name}.addShippingAddress`;

        let dsCart: AdobeCommerceCart;

        const shippingAddress = this.transformAddressInput(addressInput, requestContext);

        if (StringUtility.isStringNotEmpty(addressInput.email)) {
            try {
                const result = await this.getDatasource<AdobeCommerceCartDatasource>(requestContext).setGuestEmailOnCart(requestContext, id, addressInput.email);
                dsCart = result?.cart;
            } catch (error) {
                this.logger.info(`${methodname} - Error setting cart email ${addressInput.email} to cart ${id}: ${this.logger.formatJSON(error)}`);
            }
        }

        try {
            const result = await this.getDatasource<AdobeCommerceCartDatasource>(requestContext).setShippingAddressesOnCart(requestContext, id, [shippingAddress]);
            dsCart = result?.cart;
        } catch (error) {
            this.logger.info(`${methodname} - Error adding shipping addresses ${this.logger.formatJSON(addressInput)} to cart ${id}: ${this.logger.formatJSON(error)}`);
        }

        return this.getMapper<AdobeCommerceCartMapper>(requestContext).mapCart(requestContext, dsCart);
    }

    async addBillingAddress(id: string, addressInput: CartBillingAddressInput, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${AdobeCommerceCartServiceImpl.name}.addBillingAddress`;

        let dsCart: AdobeCommerceCart;

        let billingAddress: AdobeCommerceBillingAddressInput;

        if (addressInput.sameAsShipping) {
            billingAddress.same_as_shipping = true;
        } else {
            billingAddress = this.transformAddressInput(addressInput, requestContext);
        }

        try {
            const result = await this.getDatasource<AdobeCommerceCartDatasource>(requestContext).setBillingAddressOnCart(requestContext, id, billingAddress);
            dsCart = result?.cart;
        } catch (error) {
            this.logger.info(`${methodname} - Error adding billing address ${this.logger.formatJSON(addressInput)} to cart ${id}: ${this.logger.formatJSON(error)}`);
        }

        return this.getMapper<AdobeCommerceCartMapper>(requestContext).mapCart(requestContext, dsCart);
    }

    protected async addShippingMethod(id: string, shippingMethodInput: CartShippingMethodInput, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${AdobeCommerceCartServiceImpl.name}.addShippingMethod`;

        let dsCart: AdobeCommerceCart;

        const shippingMethod: AdobeCommerceShippingMethodInput = {
            method_code: shippingMethodInput.identifier,
            carrier_code: shippingMethodInput.type,
        };

        try {
            const result = await this.getDatasource<AdobeCommerceCartDatasource>(requestContext).setCartShippingMethods(requestContext, id, [shippingMethod]);
            dsCart = result?.cart;
        } catch (error) {
            this.logger.info(`${methodname} - Error adding shipping method ${this.logger.formatJSON(shippingMethodInput)} to cart ${id}: ${this.logger.formatJSON(error)}`);
        }

        return this.getMapper<AdobeCommerceCartMapper>(requestContext).mapCart(requestContext, dsCart);
    }

    async addPayments(id: string, paymentMethods: CartPaymentMethodInput[], isSplitPayment: boolean, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${AdobeCommerceCartServiceImpl.name}.addPayments`;

        let cart: Cart;

        //TODO - Can Adobe Commerce handle multiple payments? - For now, assume just one.
        if (paymentMethods.length > 0) {
            const paymentMethod = paymentMethods[0];

            await this.addBillingAddress(id, paymentMethod.address, requestContext, context);
            cart = await this.addPaymentMethod(id, paymentMethod, requestContext, context);
        }

        return cart;
    }

    async addPaymentMethod(id: string, paymentMethodInput: CartPaymentMethodInput, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${AdobeCommerceCartServiceImpl.name}.addPaymentMethod`;

        let dsCart: AdobeCommerceCart;

        const paymentMethod: AdobeCommercePaymentMethodInput = {
            code: paymentMethodInput.identifier,
        };

        try {
            const result = await this.getDatasource<AdobeCommerceCartDatasource>(requestContext).setCartPaymentMethod(requestContext, id, paymentMethod);
            dsCart = result?.cart;
        } catch (error) {
            this.logger.info(`${methodname} - Error adding payment method ${this.logger.formatJSON(paymentMethodInput)} to cart ${id}: ${this.logger.formatJSON(error)}`);
        }

        return this.getMapper<AdobeCommerceCartMapper>(requestContext).mapCart(requestContext, dsCart);
    }

    async addCouponCode(id: string, couponCode: string, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${AdobeCommerceCartServiceImpl.name}.addCouponCode`;

        let dsCart: AdobeCommerceCart;

        try {
            const result = await this.getDatasource<AdobeCommerceCartDatasource>(requestContext).applyCouponToCart(requestContext, id, couponCode);
            dsCart = result?.cart;
        } catch (error) {
            this.logger.info(`${methodname} - Error adding coupon code ${couponCode} to cart ${id}: ${this.logger.formatJSON(error)}`);
        }

        return this.getMapper<AdobeCommerceCartMapper>(requestContext).mapCart(requestContext, dsCart);
    }

    async removeCouponCode(id: string, couponCodeId: string, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${AdobeCommerceCartServiceImpl.name}.removeCouponCode`;

        let dsCart: AdobeCommerceCart;

        try {
            const result = await this.getDatasource<AdobeCommerceCartDatasource>(requestContext).removeCouponFromCart(requestContext, id, couponCodeId);
            dsCart = result?.cart;
        } catch (error) {
            this.logger.info(`${methodname} - Error removing coupon code ${couponCodeId} to cart ${id}: ${this.logger.formatJSON(error)}`);
        }

        return this.getMapper<AdobeCommerceCartMapper>(requestContext).mapCart(requestContext, dsCart);
    }

    async precheckout(id: string, filterInput: ItemFilterInput, paginationInput: PaginationInput, sortByInput: SortByInput, requestContext: RequestContext, context?: any): Promise<Cart> {
        return await this.getCart(id, filterInput, paginationInput, sortByInput, requestContext, context);
    }

    async checkout(id: string, requestContext: RequestContext, context?: any): Promise<CartCheckout> {
        const methodname = `${AdobeCommerceCartServiceImpl.name}.checkout`;

        let dsOrder: AdobeCommerceCustomerOrder;

        try {
            const orderNumber = await this.getDatasource<AdobeCommerceCartDatasource>(requestContext).placeOrder(id, requestContext);

            dsOrder = {
                number: orderNumber,
            };
        } catch (error) {
            this.logger.info(`${methodname} - Error performing cart checkout [${id}]: ${error.message}`, requestContext);
            throw CartErrors.checkoutFailed();
        }

        return this.getMapper<AdobeCommerceOrderMapper>(requestContext, AdobeCommerceOrderMapper).mapCustomerOrder(requestContext, dsOrder);
    }

    /**
     * @todo - Add Adobe Commerce logic to get shipping methods
     * @param id
     * @param requestContext
     * @param context
     */
    async getShippingMethods(id: string, paginationInput: PaginationInput, requestContext: RequestContext, context?: any): Promise<ShippingMethodResultSet> {
        return {
            pagination: {
                pageSize: 0,
                pageCount: 1,
                resultCount: 0,
                hasMorePages: false,
                page: 1,
            },
            results: [],
        };
    }

    protected async validateCartId(requestContext: RequestContext, id: string, doCartCreate: boolean = false) {
        const methodname = `${AdobeCommerceCartServiceImpl.name}.validateCartId`;

        if (StringUtility.isStringEmpty(id)) {
            if (doCartCreate) {
                try {
                    this.logger.info(`${methodname} - Cart Id is missing, creating a new cart for guest user`);

                    id = await this.getDatasource<AdobeCommerceCartDatasource>(requestContext).createEmptyCart(requestContext);
                } catch (error) {
                    this.logger.info(`${methodname} - Error creating cart for guest user: ${error}`, requestContext);
                    throw CartErrors.createCartFailed();
                }
            } else {
                throw CartErrors.missingCartId();
            }
        }

        return id;
    }

    protected async fetchUser(requestContext: RequestContext): Promise<ECUser> {
        let user = null;

        const token = this.getPluginToken(requestContext);

        if (token?.isRegistered) {
            const userService = this.getService<ECUserService>(requestContext, ECUserService);
            user = await userService.getUser(null, requestContext);
        }

        return user;
    }
}
