import { RequestContext } from "@context/request";
import { AdobeCommerceBaseDatasource, AdobeCommerceQuoteItemsSortInput } from "@plugin-adobe-commerce/common";
import { AdobeCommerceAddProductsToCartOutput, AdobeCommerceApplyCouponToCartOutput, AdobeCommerceBillingAddressInput, AdobeCommerceCart, AdobeCommerceCartItemInput, AdobeCommerceCartItemUpdateInput, AdobeCommerceCartQueries, AdobeCommercePaymentMethodInput, AdobeCommerceRemoveCouponFromCartOutput, AdobeCommerceSetGuestEmailOnCartOutput, AdobeCommerceSetPaymentMethodOnCartOutput, AdobeCommerceSetShippingAddressesOnCartOutput, AdobeCommerceSetShippingMethodsOnCartOutput, AdobeCommerceShippingAddressInput, AdobeCommerceShippingMethodInput, AdobeCommerceUpdateCartItemsOutput } from "./schema/adobe-commerce.cart.schema";
import { GraphqlDatasourceServiceDefinition, GraphqlDatasourceServiceDefinitions, GraphqlHttpMethods } from "@plugin-datasource-graphql";

export interface AdobeCommerceCartServiceDefinitions extends GraphqlDatasourceServiceDefinitions {
    getCartById: GraphqlDatasourceServiceDefinition;
    getCustomerCart: GraphqlDatasourceServiceDefinition;
    createEmptyCart: GraphqlDatasourceServiceDefinition;
    mergeCarts: GraphqlDatasourceServiceDefinition;
    addProductsToCart: GraphqlDatasourceServiceDefinition;
    updateCartItems: GraphqlDatasourceServiceDefinition;
    removeItemFromCart: GraphqlDatasourceServiceDefinition;
    setShippingMethodsOnCart: GraphqlDatasourceServiceDefinition;
    setPaymentMethodOnCart: GraphqlDatasourceServiceDefinition;
    setShippingAddressOnCart: GraphqlDatasourceServiceDefinition;
    setBillingAddressOnCart: GraphqlDatasourceServiceDefinition;
    applyCouponToCart: GraphqlDatasourceServiceDefinition;
    removeCouponFromCart: GraphqlDatasourceServiceDefinition;
    setGuestEmailOnCart: GraphqlDatasourceServiceDefinition;
    placeOrder: GraphqlDatasourceServiceDefinition;
}


export class AdobeCommerceCartDatasource extends AdobeCommerceBaseDatasource {
    protected serviceDefinitions: AdobeCommerceCartServiceDefinitions = {
        getCartById: {
            id: 'getCartById',
            method: GraphqlHttpMethods.get,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: undefined,
        },
        getCustomerCart: {
            id: 'getCustomerCart',
            method: GraphqlHttpMethods.get,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: undefined,
        },
        /*
        createGuestCart: {
            id: 'createGuestCart',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401]
            },
            query: undefined
        },
        */
        createEmptyCart: {
            id: 'createEmptyCart',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: undefined,
        },
        mergeCarts: {
            id: 'mergeCarts',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: undefined,
        },
        addProductsToCart: {
            id: 'addProductsToCart',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: undefined,
        },
        updateCartItems: {
            id: 'updateCartItems',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: undefined,
        },
        removeItemFromCart: {
            id: 'removeItemFromCart',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: undefined,
        },
        setShippingMethodsOnCart: {
            id: 'setShippingMethodsOnCart',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 1,
                ignoreStatuses: [401], // You can add other statuses to ignore retries
            },
            query: undefined,
        },
        setPaymentMethodOnCart: {
            id: 'setPaymentMethodOnCart',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 1,
                ignoreStatuses: [401], // You can add other statuses to ignore retries
            },
            query: undefined,
        },
        setShippingAddressOnCart: {
            id: 'setShippingAddressOnCart',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 1,
                ignoreStatuses: [401],
            },
            query: undefined,
        },
        setBillingAddressOnCart: {
            id: 'setBillingAddressOnCart',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 1,
                ignoreStatuses: [401],
            },
            query: undefined,
        },
        applyCouponToCart: {
            id: 'applyCouponToCart',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: undefined,
        },
        removeCouponFromCart: {
            id: 'removeCouponFromCart',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: undefined,
        },
        setGuestEmailOnCart: {
            id: 'setGuestEmailOnCart',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: undefined,
        },
        placeOrder: {
            id: 'placeOrder',
            method: GraphqlHttpMethods.post,
            timeout: 10000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: undefined,
        },
    };

    async getCartById(requestContext: RequestContext, id: string, pageSize?: number, currentPage?: number, sort?: AdobeCommerceQuoteItemsSortInput): Promise<AdobeCommerceCart> {
        const methodname = `${AdobeCommerceCartDatasource.name}.getCartById`;

        let result: AdobeCommerceCart = null;

        const variables = {
            cart_id: id,
            pageSize,
            currentPage,
            sort,
        };

        const gqlResult = await this.executeGQLService<{ cart: AdobeCommerceCart }>(requestContext, this.serviceDefinitions.getCartById, variables, this.getCartByIdQuery(requestContext));

        return gqlResult.cart;
    }

    async getCustomerCart(requestContext: RequestContext, pageSize?: number, currentPage?: number, sort?: AdobeCommerceQuoteItemsSortInput): Promise<AdobeCommerceCart> {
        const methodname = `${AdobeCommerceCartDatasource.name}.getCart`;

        let result: AdobeCommerceCart = null;

        const variables = {
            pageSize,
            currentPage,
            sort,
        };

        const gqlResult = await this.executeGQLService<{ customerCart: AdobeCommerceCart }>(
            requestContext,
            this.serviceDefinitions.getCustomerCart,
            variables,
            this.getCustomerCartQuery(requestContext),
        );

        return gqlResult.customerCart;
    }

    /*
    async createGuestCart(requestContext: RequestContext, input?: AdobeCommerceApplyCouponToCartInput): Promise<AdobeCommerceCart> {
        const methodname = `${AdobeCommerceCartDatasource.name}.createGuestCart`;

        let result: AdobeCommerceCart = null;

        const variables = {
            input
        };

        try {
            const gqlResult = await this.executeGQL(requestContext, serviceDefinitions[serviceIds.createGuestCart], variables, this.getCreateGuestCartQuery(requestContext));

            result = gqlResult.createGuestCart?.cart;
        } catch (error) {
            this.logger.info(`${methodname} - Error creating guest cart: ${error.message}`, requestContext);
            throw error;
        }

        return result;
    }
    */

    async createEmptyCart(requestContext: RequestContext): Promise<string> {
        const methodname = `${AdobeCommerceCartDatasource.name}.createEmptyCart`;

        const variables = {};

        const gqlResult = await this.executeGQLService<{ createEmptyCart: string }>(
            requestContext,
            this.serviceDefinitions.createEmptyCart,
            variables,
            this.getCreateEmptyCartQuery(requestContext),
        );

        return gqlResult.createEmptyCart;
    }

    async mergeCarts(requestContext: RequestContext, sourceCartId: string, destinationCartId: string): Promise<AdobeCommerceCart> {
        const methodname = `${AdobeCommerceCartDatasource.name}.mergeCarts`;

        const variables = {
            source_cart_id: sourceCartId,
            destination_cart_id: destinationCartId,
        };

        const gqlResult = await this.executeGQLService<{ mergeCarts: AdobeCommerceCart }>(
            requestContext,
            this.serviceDefinitions.mergeCarts,
            variables,
            this.getMergeCartsQuery(requestContext),
        );

        return gqlResult.mergeCarts;
    }

    async addProductsToCart(requestContext: RequestContext, id: string, cartItems: AdobeCommerceCartItemInput[]): Promise<AdobeCommerceAddProductsToCartOutput> {
        const methodname = `${AdobeCommerceCartDatasource.name}.addProductsToCart`;

        let result: AdobeCommerceAddProductsToCartOutput = null;

        const variables = {
            cartId: id,
            cartItems,
        };

        const gqlResult = await this.executeGQLService<{ addProductsToCart: AdobeCommerceAddProductsToCartOutput }>(
            requestContext,
            this.serviceDefinitions.addProductsToCart,
            variables,
            this.getAddProductsToCartQuery(requestContext),
        );

        return gqlResult.addProductsToCart;
    }

    async updateCartItems(requestContext: RequestContext, id: string, cartItems: AdobeCommerceCartItemUpdateInput[]): Promise<AdobeCommerceUpdateCartItemsOutput> {
        const methodname = `${AdobeCommerceCartDatasource.name}.updateCartItems`;

        let result: AdobeCommerceUpdateCartItemsOutput = null;

        const variables = {
            input: {
                cart_id: id,
                cart_items: cartItems,
            },
        };

        const gqlResult = await this.executeGQLService<{ updateCartItems: AdobeCommerceUpdateCartItemsOutput }>(
            requestContext,
            this.serviceDefinitions.mergeCarts,
            variables,
            this.getUpdateCartItemsQuery(requestContext),
        );

        return gqlResult.updateCartItems;
    }

    async removeItemFromCart(requestContext: RequestContext, id: string, itemId: string): Promise<AdobeCommerceCart> {
        const methodname = `${AdobeCommerceCartDatasource.name}.removeItemFromCart`;

        let result: AdobeCommerceCart = null;

        const variables = {
            cart_id: id,
            cart_item_uid: itemId,
        };

        const gqlResult = await this.executeGQLService<{ removeItemFromCart: AdobeCommerceCart }>(
            requestContext,
            this.serviceDefinitions.removeItemFromCart,
            variables,
            this.getRemoveItemFromCartQuery(requestContext),
        );

        return gqlResult.removeItemFromCart;
    }

    async setCartShippingMethods(requestContext: RequestContext, id: string, shippingMethods: AdobeCommerceShippingMethodInput[]): Promise<AdobeCommerceSetShippingMethodsOnCartOutput> {
        const methodname = `${AdobeCommerceCartDatasource.name}.setCartShippingMethods`;

        let result: AdobeCommerceSetShippingMethodsOnCartOutput = null;

        const variables = {
            input: {
                cart_id: id,
                shipping_methods: shippingMethods,
            },
        };

        const gqlResult = await this.executeGQLService<{ setShippingMethodsOnCart: AdobeCommerceSetShippingMethodsOnCartOutput }>(
            requestContext,
            this.serviceDefinitions.setShippingMethodsOnCart,
            variables,
            this.getSetShippingMethodsOnCartQuery(requestContext),
        );

        return gqlResult.setShippingMethodsOnCart;
    }

    async setCartPaymentMethod(requestContext: RequestContext, id: string, paymentMethod: AdobeCommercePaymentMethodInput): Promise<AdobeCommerceSetPaymentMethodOnCartOutput> {
        const methodname = `${AdobeCommerceCartDatasource.name}.setCartPaymentMethod`;

        let result: AdobeCommerceSetShippingMethodsOnCartOutput = null;

        const variables = {
            input: {
                cart_id: id,
                payment_method: paymentMethod,
            },
        };

        const gqlResult = await this.executeGQLService<{ setPaymentMethodOnCart: AdobeCommerceSetShippingMethodsOnCartOutput }>(
            requestContext,
            this.serviceDefinitions.setPaymentMethodOnCart,
            variables,
            this.getSetPaymentMethodOnCartQuery(requestContext),
        );

        return gqlResult.setPaymentMethodOnCart;
    }

    async setShippingAddressesOnCart(requestContext: RequestContext, cartId: string, addressesInput: AdobeCommerceShippingAddressInput[]): Promise<AdobeCommerceSetShippingAddressesOnCartOutput> {
        const methodname = `${AdobeCommerceCartDatasource.name}.setShippingAddressesOnCart`;

        let result: AdobeCommerceSetShippingAddressesOnCartOutput;

        const variables = {
            input: {
                cart_id: cartId,
                shipping_addresses: addressesInput,
            },
        };

        const response = await this.executeGQLService<{ setShippingAddressesOnCart: AdobeCommerceSetShippingAddressesOnCartOutput }>(
            requestContext,
            this.serviceDefinitions.setShippingAddressOnCart,
            variables,
            this.getSetShippingAddressOnCartQuery(requestContext),
        );

        return response.setShippingAddressesOnCart;
    }

    async setBillingAddressOnCart(requestContext: RequestContext, cartId: string, addressInput: AdobeCommerceBillingAddressInput): Promise<AdobeCommerceSetShippingAddressesOnCartOutput> {
        const methodname = `${AdobeCommerceCartDatasource.name}.setBillingAddressOnCart`;

        let result: AdobeCommerceSetShippingAddressesOnCartOutput;

        const variables = {
            input: {
                cart_id: cartId,
                billing_address: {
                    ...addressInput,
                    same_as_shipping: false,
                },
            },
        };

        const response = await this.executeGQLService<{ setBillingAddressOnCart: AdobeCommerceSetShippingAddressesOnCartOutput }>(
            requestContext,
            this.serviceDefinitions.setBillingAddressOnCart,
            variables,
            this.getSetBillingAddressOnCartQuery(requestContext),
        );

        return response.setBillingAddressOnCart;
    }

    async applyCouponToCart(requestContext: RequestContext, cartId: string, couponCode: string): Promise<AdobeCommerceApplyCouponToCartOutput> {
        const methodname = `${AdobeCommerceCartDatasource.name}.applyCouponToCart`;

        let result: AdobeCommerceSetShippingAddressesOnCartOutput;

        const variables = {
            input: {
                cart_id: cartId,
                coupon_code: couponCode,
            },
        };

        const response = await this.executeGQLService<{ applyCouponToCart: AdobeCommerceSetShippingAddressesOnCartOutput }>(
            requestContext,
            this.serviceDefinitions.applyCouponToCart,
            variables,
            this.getApplyCouponToCartQuery(requestContext),
        );

        return response.applyCouponToCart;
    }

    async removeCouponFromCart(requestContext: RequestContext, cartId: string, couponCode: string): Promise<AdobeCommerceRemoveCouponFromCartOutput> {
        const methodname = `${AdobeCommerceCartDatasource.name}.removeCouponFromCart`;

        let result: AdobeCommerceRemoveCouponFromCartOutput;

        const variables = {
            input: {
                cart_id: cartId,
                //coupon_code: couponCode,
            },
        };

        const response = await this.executeGQLService<{ removeCouponFromCart: AdobeCommerceRemoveCouponFromCartOutput }>(
            requestContext,
            this.serviceDefinitions.removeCouponFromCart,
            variables,
            this.getRemoveCouponFromCartQuery(requestContext),
        );

        return response.removeCouponFromCart;
    }

    async setGuestEmailOnCart(requestContext: RequestContext, cartId: string, email: string): Promise<AdobeCommerceSetGuestEmailOnCartOutput> {
        const methodname = `${AdobeCommerceCartDatasource.name}.setGuestEmailOnCart`;

        let result: AdobeCommerceSetGuestEmailOnCartOutput;

        const variables = {
            input: {
                cart_id: cartId,
                email,
            },
        };

        const response = await this.executeGQLService<{ setGuestEmailOnCart: AdobeCommerceSetGuestEmailOnCartOutput }>(
            requestContext,
            this.serviceDefinitions.setGuestEmailOnCart,
            variables,
            this.setGuestEmailOnCartQuery(requestContext),
        );

        return response.setGuestEmailOnCart;
    }

    async placeOrder(id: string, requestContext: RequestContext): Promise<string> {
        const methodname = `${AdobeCommerceCartDatasource.name}.placeOrder`;

        const variables = {
            input: {
                cart_id: id,
            },
        };

        const gqlResult = await this.executeGQL<{ placeOrder: { order: { order_number: string } } }>(
            requestContext,
            this.serviceDefinitions.placeOrder,
            variables,
            this.getPlaceOrderQuery(requestContext),
        );

        return gqlResult?.placeOrder?.order?.order_number;
    }

    protected getCartByIdQuery(requestContext: RequestContext) {
        const service = this.serviceDefinitions.getCartById;

        if (!service.query) {
            this.setServiceDynamicQuery(service, AdobeCommerceCartQueries.getCartById(this.getProductAttributes(requestContext)));
        }

        return service.query;
    }

    protected getCustomerCartQuery(requestContext: RequestContext) {
        const service = this.serviceDefinitions.getCustomerCart;

        if (!service.query) {
            this.setServiceDynamicQuery(service, AdobeCommerceCartQueries.getCustomerCart(this.getProductAttributes(requestContext)));
        }

        return service.query;
    }

    /*
    protected getCreateGuestCartQuery(requestContext: RequestContext) {
        const service = this.serviceDefinitions.createGuestCart;


        if (!service.query) {
            service.query = AdobeCommerceBaseDatasource.prettifyQuery(AdobeCommerceCartQueries.createGuestCart(this.getProductAttributes(requestContext)));
        }

        return service.query;
    }
    */

    protected getCreateEmptyCartQuery(requestContext: RequestContext) {
        const service = this.serviceDefinitions.createEmptyCart;

        if (!service.query) {
            this.setServiceDynamicQuery(service, AdobeCommerceCartQueries.createEmptyCart());
        }

        return service.query;
    }

    protected getMergeCartsQuery(requestContext: RequestContext) {
        const service = this.serviceDefinitions.mergeCarts;

        if (!service.query) {
            this.setServiceDynamicQuery(service, AdobeCommerceCartQueries.mergeCarts(this.getProductAttributes(requestContext)));
        }

        return service.query;
    }

    protected getAddProductsToCartQuery(requestContext: RequestContext) {
        const service = this.serviceDefinitions.addProductsToCart;

        if (!service.query) {
            this.setServiceDynamicQuery(service, AdobeCommerceCartQueries.addProductsToCart(this.getProductAttributes(requestContext)));
        }

        return service.query;
    }

    protected getUpdateCartItemsQuery(requestContext: RequestContext) {
        const service = this.serviceDefinitions.updateCartItems;

        if (!service.query) {
            this.setServiceDynamicQuery(service, AdobeCommerceCartQueries.updateCartItems(this.getProductAttributes(requestContext)));
        }

        return service.query;
    }

    protected getRemoveItemFromCartQuery(requestContext: RequestContext) {
        const service = this.serviceDefinitions.removeItemFromCart;

        if (!service.query) {
            this.setServiceDynamicQuery(service, AdobeCommerceCartQueries.removeItemFromCart(this.getProductAttributes(requestContext)));
        }

        return service.query;
    }

    protected getSetShippingMethodsOnCartQuery(requestContext: RequestContext) {
        const service = this.serviceDefinitions.setShippingMethodsOnCart;

        if (!service.query) {
            this.setServiceDynamicQuery(service, AdobeCommerceCartQueries.setShippingMethodsOnCart(this.getProductAttributes(requestContext)));
        }

        return service.query;
    }

    protected getSetPaymentMethodOnCartQuery(requestContext: RequestContext) {
        const service = this.serviceDefinitions.setPaymentMethodOnCart;

        if (!service.query) {
            this.setServiceDynamicQuery(service, AdobeCommerceCartQueries.setPaymentMethodOnCart(this.getProductAttributes(requestContext)));
        }

        return service.query;
    }

    protected getSetShippingAddressOnCartQuery(requestContext: RequestContext) {
        const service = this.serviceDefinitions.setShippingAddressOnCart;

        if (!service.query) {
            this.setServiceDynamicQuery(service, AdobeCommerceCartQueries.setShippingAddressOnCart(this.getProductAttributes(requestContext)));
        }

        return service.query;
    }

    protected getSetBillingAddressOnCartQuery(requestContext: RequestContext) {
        const service = this.serviceDefinitions.setBillingAddressOnCart;

        if (!service.query) {
            this.setServiceDynamicQuery(service, AdobeCommerceCartQueries.setBillingAddressOnCart(this.getProductAttributes(requestContext)));
        }

        return service.query;
    }

    protected getApplyCouponToCartQuery(requestContext: RequestContext) {
        const service = this.serviceDefinitions.applyCouponToCart;

        if (!service.query) {
            this.setServiceDynamicQuery(service, AdobeCommerceCartQueries.applyCouponToCart(this.getProductAttributes(requestContext)));
        }

        return service.query;
    }

    protected getRemoveCouponFromCartQuery(requestContext: RequestContext) {
        const service = this.serviceDefinitions.removeCouponFromCart;

        if (!service.query) {
            this.setServiceDynamicQuery(service, AdobeCommerceCartQueries.removeCouponFromCart(this.getProductAttributes(requestContext)));
        }

        return service.query;
    }

    protected setGuestEmailOnCartQuery(requestContext: RequestContext) {
        const service = this.serviceDefinitions.setGuestEmailOnCart;

        if (!service.query) {
            this.setServiceDynamicQuery(service, AdobeCommerceCartQueries.setGuestEmailOnCart(this.getProductAttributes(requestContext)));
        }

        return service.query;
    }

    protected getPlaceOrderQuery(requestContext: RequestContext) {
        const service = this.serviceDefinitions.placeOrder;

        if (!service.query) {
            this.setServiceDynamicQuery(service, AdobeCommerceCartQueries.placeOrder(this.getProductAttributes(requestContext)));
        }

        return service.query;
    }
}
