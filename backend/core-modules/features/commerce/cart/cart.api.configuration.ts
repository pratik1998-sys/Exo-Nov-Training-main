import { ApiConfiguration, ApiOperationDefinition, ApiOperationOptions } from "@api";
import { Cart, CartCheckout, CartCouponAddInputBody, CartItemAddInput, CartItemsAddInputBody, CartItemsDeleteInputBody, CartItemsUpdateInputBody, CartItemUpdateInput, CartPaymentMethodInput, CartPaymentOptions, CartShippingMethodInput, CartShippingOptions, CartUpdateInput } from "./cart.model";
import { CartRequestParameters } from "./cart.parameters";
import { ShippingMethodResultSet } from "@feature-commerce/common";

export interface CartApiOperations {
    cart: ApiOperationDefinition;
    cartUpdate: ApiOperationDefinition;
    cartDelete: ApiOperationDefinition;
    cartItemAdd: ApiOperationDefinition;
    cartItemsAdd: ApiOperationDefinition;
    cartItemUpdate: ApiOperationDefinition;
    cartItemsUpdate: ApiOperationDefinition;
    cartItemDelete: ApiOperationDefinition;
    cartItemsDelete: ApiOperationDefinition;
    cartShippingMethods: ApiOperationDefinition;
    cartShippingOptions: ApiOperationDefinition;
    cartPaymentOptions: ApiOperationDefinition;
    cartShippingUpdate: ApiOperationDefinition;
    cartPaymentAdd: ApiOperationDefinition;
    cartCouponAdd: ApiOperationDefinition;
    cartCouponRemove: ApiOperationDefinition;
    cartPrecheckout: ApiOperationDefinition;
    cartCheckout: ApiOperationDefinition;
};
export class CartApiConfiguration extends ApiConfiguration {
    static operations: CartApiOperations = {
        cart: {
            id: 'cart',
            description: 'Get a cart',
            summary: 'Get a cart',
            isAuthRequired: false,
            restOptions: {
                isById: true,
                path: `/:${CartRequestParameters.id.id}`,
                apiOkResponseOptions: {
                    type: Cart,
                },
                tags: [],
            },
            queryOptions: {
                required: false,
            },
        },
        cartUpdate: {
            id: 'cartUpdate',
            description: 'Update a cart',
            summary: 'Update a cart',
            isAuthRequired: false,
            restOptions: {
                path: `/:${CartRequestParameters.id.id}`,
                apiOkResponseOptions: {
                    type: Cart,
                },
                apiBodyOptions: {
                    type: CartUpdateInput,
                },
                tags: [],
            },
            mutationOptions: {
                required: true,
            },
        },
        cartDelete: {
            id: 'cartDelete',
            description: 'Delete a cart',
            summary: 'Delete a cart',
            isAuthRequired: false,
            restOptions: {
                path: `/:${CartRequestParameters.id.id}`,
                apiOkResponseOptions: {
                    type: Cart,
                },
                tags: [],
            },
            mutationOptions: {
                required: false,
            },
        },
        cartItemAdd: {
            id: 'cartItemAdd',
            description: 'Add item to a cart',
            summary: 'Add item to a cart',
            isAuthRequired: false,
            restOptions: {
                path: `/:${CartRequestParameters.id.id}/item`,
                apiOkResponseOptions: {
                    type: Cart,
                },
                apiBodyOptions: {
                    type: CartItemAddInput,
                },
                tags: [],
            },
        },
        cartItemsAdd: {
            id: 'cartItemsAdd',
            description: 'Add items to a cart',
            summary: 'Add items to a cart',
            isAuthRequired: false,
            restOptions: {
                path: `/:${CartRequestParameters.id.id}/items`,
                apiOkResponseOptions: {
                    type: Cart,
                },
                apiBodyOptions: {
                    type: CartItemsAddInputBody,
                },
                tags: [],
            },
            mutationOptions: {
                required: true,
            },
        },
        cartItemUpdate: {
            id: 'cartItemUpdate',
            description: 'Update cart item',
            summary: 'Update cart item',
            isAuthRequired: false,
            restOptions: {
                path: `/:${CartRequestParameters.id.id}/item/:${CartRequestParameters.itemId.id}`,
                apiOkResponseOptions: {
                    type: Cart,
                },
                apiBodyOptions: {
                    type: CartItemUpdateInput,
                },
                tags: [],
            },
        },
        cartItemsUpdate: {
            id: 'cartItemsUpdate',
            description: 'Update cart items',
            summary: 'Update cart items',
            isAuthRequired: false,
            restOptions: {
                path: `/:${CartRequestParameters.id.id}/items`,
                apiOkResponseOptions: {
                    type: Cart,
                },
                apiBodyOptions: {
                    type: CartItemsUpdateInputBody,
                },
                tags: [],
            },
            mutationOptions: {
                required: true,
            },
        },
        cartItemDelete: {
            id: 'cartItemDelete',
            description: 'Delete cart item',
            summary: 'Delete cart item',
            isAuthRequired: false,
            restOptions: {
                path: `/:${CartRequestParameters.id.id}/item/:${CartRequestParameters.itemId.id}`,
                apiOkResponseOptions: {
                    type: Cart,
                },
                tags: [],
            },
        },
        cartItemsDelete: {
            id: 'cartItemsDelete',
            description: 'Delete cart items',
            summary: 'Delete cart items',
            isAuthRequired: false,
            restOptions: {
                path: `/:${CartRequestParameters.id.id}/items/@delete`,
                apiOkResponseOptions: {
                    type: Cart,
                },
                apiBodyOptions: {
                    type: CartItemsDeleteInputBody,
                },
                tags: [],
            },
            mutationOptions: {
                required: true,
            },
        },
        cartShippingMethods: {
            id: 'cartShippingMethods',
            description: 'Get cart shipping methods',
            summary: 'Get cart shipping methods',
            isAuthRequired: false,
            restOptions: {
                path: `/:${CartRequestParameters.id.id}/shipping-method`,
                apiOkResponseOptions: {
                    type: ShippingMethodResultSet,
                },
                tags: [],
            },
            queryOptions: {
                required: true,
            },
        },
        cartShippingOptions: {
            id: 'cartShippingOptions',
            description: 'Get cart shipping options',
            summary: 'Get cart shipping options',
            isAuthRequired: false,
            restOptions: {
                path: `/:${CartRequestParameters.id.id}/shipping-option`,
                apiOkResponseOptions: {
                    type: CartShippingOptions,
                },
                tags: [],
            },
            queryOptions: {
                required: true,
            },
        },
        cartPaymentOptions: {
            id: 'cartPaymentOptions',
            description: 'Get cart payment options',
            summary: 'Get cart payment options',
            isAuthRequired: false,
            restOptions: {
                path: `/:${CartRequestParameters.id.id}/payment-option`,
                apiOkResponseOptions: {
                    type: CartPaymentOptions,
                },
                tags: [],
            },
            queryOptions: {
                required: true,
            },
        },
        cartShippingUpdate: {
            id: 'cartShippingUpdate',
            description: 'Update cart shipping',
            summary: 'Update cart shipping',
            isAuthRequired: false,
            restOptions: {
                path: `/:${CartRequestParameters.id.id}/shipping`,
                apiOkResponseOptions: {
                    type: Cart,
                },
                apiBodyOptions: {
                    type: CartShippingMethodInput,
                },
                tags: [],
            },
            mutationOptions: {
                required: true,
            },
        },
        cartPaymentAdd: {
            id: 'cartPaymentAdd',
            description: 'Add payment to a cart',
            summary: 'Add payment to a cart',
            isAuthRequired: false,
            restOptions: {
                path: `/:${CartRequestParameters.id.id}/payment`,
                apiOkResponseOptions: {
                    type: Cart,
                },
                apiBodyOptions: {
                    type: CartPaymentMethodInput,
                },
                tags: [],
            },
            mutationOptions: {
                required: true,
            },
        },
        cartCouponAdd: {
            id: 'cartCouponAdd',
            description: 'Add a coupon to a cart',
            summary: 'Add a coupon to a cart',
            isAuthRequired: false,
            restOptions: {
                path: `/:${CartRequestParameters.id.id}/coupon`,
                apiOkResponseOptions: {
                    type: Cart,
                },
                apiBodyOptions: {
                    type: CartCouponAddInputBody,
                },
                tags: [],
            },
            mutationOptions: {
                required: true,
            },
        },
        cartCouponRemove: {
            id: 'cartCouponRemove',
            description: 'Remove a coupon from a cart',
            summary: 'Remove a coupon from a cart',
            isAuthRequired: false,
            restOptions: {
                path: `/:${CartRequestParameters.id.id}/coupon/:${CartRequestParameters.couponCodeId.id}`,
                apiOkResponseOptions: {
                    type: Cart,
                },
                tags: [],
            },
            mutationOptions: {
                required: true,
            },
        },
        cartPrecheckout: {
            id: 'cartPrecheckout',
            description: 'Pre-Checkout a cart - Performs final checks and validations on a cart before checkout',
            summary: 'Pre-Checkout a cart',
            isAuthRequired: false,
            restOptions: {
                path: `/:${CartRequestParameters.id.id}/precheckout`,
                apiOkResponseOptions: {
                    type: Cart,
                },
                tags: [],
            },
            mutationOptions: {
                required: true,
            },
        },
        cartCheckout: {
            id: 'cartCheckout',
            description: 'Checkout a cart - Completes the checkout process for a cart',
            summary: 'Checkout a cart',
            isAuthRequired: false,
            restOptions: {
                path: `/:${CartRequestParameters.id.id}/checkout`,
                apiOkResponseOptions: {
                    type: CartCheckout,
                },
                tags: [],
            },
            mutationOptions: {
                required: true,
            },
        }
    };

    static cart(): ApiOperationOptions {
        return this.composeOperationOptions(CartApiConfiguration.operations.cart);
    }

    static cartUpdate(): ApiOperationOptions {
        return this.composeOperationOptions(CartApiConfiguration.operations.cartUpdate);
    }

    static cartDelete(): ApiOperationOptions {
        return this.composeOperationOptions(CartApiConfiguration.operations.cartDelete);
    }

    static cartItemAdd(): ApiOperationOptions {
        return this.composeOperationOptions(CartApiConfiguration.operations.cartItemAdd);
    }

    static cartItemsAdd(): ApiOperationOptions {
        return this.composeOperationOptions(CartApiConfiguration.operations.cartItemsAdd);
    }

    static cartItemUpdate(): ApiOperationOptions {
        return this.composeOperationOptions(CartApiConfiguration.operations.cartItemUpdate);
    }

    static cartItemsUpdate(): ApiOperationOptions {
        return this.composeOperationOptions(CartApiConfiguration.operations.cartItemsUpdate);
    }

    static cartItemDelete(): ApiOperationOptions {
        return this.composeOperationOptions(CartApiConfiguration.operations.cartItemDelete);
    }

    static cartItemsDelete(): ApiOperationOptions {
        return this.composeOperationOptions(CartApiConfiguration.operations.cartItemsDelete);
    }

    static cartShippingMethods(): ApiOperationOptions {
        return this.composeOperationOptions(CartApiConfiguration.operations.cartShippingMethods);
    }

    static cartShippingOptions(): ApiOperationOptions {
        return this.composeOperationOptions(CartApiConfiguration.operations.cartShippingOptions);
    }

    static cartPaymentOptions(): ApiOperationOptions {
        return this.composeOperationOptions(CartApiConfiguration.operations.cartPaymentOptions);
    }

    static cartShippingUpdate(): ApiOperationOptions {
        return this.composeOperationOptions(CartApiConfiguration.operations.cartShippingUpdate);
    }

    static cartPaymentAdd(): ApiOperationOptions {
        return this.composeOperationOptions(CartApiConfiguration.operations.cartPaymentAdd);
    }

    static cartCouponAdd(): ApiOperationOptions {
        return this.composeOperationOptions(CartApiConfiguration.operations.cartCouponAdd);
    }

    static cartCouponRemove(): ApiOperationOptions {
        return this.composeOperationOptions(CartApiConfiguration.operations.cartCouponRemove);
    }

    static cartPrecheckout(): ApiOperationOptions {
        return this.composeOperationOptions(CartApiConfiguration.operations.cartPrecheckout);
    }

    static cartCheckout(): ApiOperationOptions {
        return this.composeOperationOptions(CartApiConfiguration.operations.cartCheckout);
    }
}
