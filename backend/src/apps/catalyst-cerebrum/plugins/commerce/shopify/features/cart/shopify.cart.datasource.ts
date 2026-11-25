import { RequestContext } from "@context/request";
import { CartAddressInput, CartItemAddInput, CartItemDeleteInput, CartItemUpdateInput } from "@feature-commerce/cart";
import { ShopifyBaseDatasource } from "@plugin-shopify/common";

export class ShopifyCartDatasource extends ShopifyBaseDatasource {
    private readonly CART_FIELDS = `
        id
        checkoutUrl
        cost {
            totalAmount { amount currencyCode }
        }
        lines(first: 100) {
            edges {
                node {
                    id
                    quantity
                    merchandise {
                        ... on ProductVariant { 
                            title
                            id 
                            sku 
                            image { url }
                            product { title }
                            price {
                                amount
                                currencyCode
                            }
                            selectedOptions { name value }    
                        }
                    }
                    cost {
                        totalAmount { amount currencyCode }
                    }
                }
            }
        }
    `;

    async getCart(requestContext: RequestContext, id: string) {
        return this.executeGQL(
            requestContext,
            {
                id: 'getCart',
                method: 'post',
                query: {
                    queryId: 'shopifyGetCart',
                    query: `query GetCart($id: ID!) { cart(id: $id) { ${this.CART_FIELDS} } }`,
                },
            },
            { id },
        );
    }

    async addCartItems(requestContext: RequestContext, cartId: string, items: CartItemAddInput[]) {
        const isExistingCart = cartId && cartId.startsWith('gid://shopify/Cart/');

        if (!isExistingCart) {
            return this.executeGQL(
                requestContext,
                {
                    id: 'createCart',
                    method: 'post',
                    query: {
                        queryId: 'shopifyCartCreate',
                        query: `mutation CreateCart($input: CartInput!) {
                        cartCreate(input: $input) {
                            cart { ${this.CART_FIELDS} }
                            userErrors { field message }
                        }
                    }`,
                    },
                },
                {
                    input: {
                        lines: items.map((item) => ({ merchandiseId: item.identifier, quantity: item.quantity })),
                    },
                },
            );
        }

        return this.executeGQL(
            requestContext,
            {
                id: 'addCartItems',
                method: 'post',
                query: {
                    queryId: 'shopifyCartLinesAdd',
                    query: `mutation AddCartItems($cartId: ID!, $lines: [CartLineInput!]!) {
                    cartLinesAdd(cartId: $cartId, lines: $lines) {
                        cart { ${this.CART_FIELDS} }
                        userErrors { field message }
                    }
                }`,
                },
            },
            {
                cartId,
                lines: items.map((item) => ({ merchandiseId: item.identifier, quantity: item.quantity })),
            },
        );
    }

    async updateCartItems(requestContext: RequestContext, cartId: string, items: CartItemUpdateInput[]) {
        return this.executeGQL(
            requestContext,
            {
                id: 'updateCartItems',
                method: 'post',
                query: {
                    queryId: 'shopifyCartLinesUpdate',
                    query: `mutation UpdateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
                    cartLinesUpdate(cartId: $cartId, lines: $lines) {
                        cart { ${this.CART_FIELDS} }
                        userErrors { field message }
                    }
                }`,
                },
            },
            {
                cartId,
                lines: items.map((item) => ({ id: item.id, quantity: item.quantity })),
            },
        );
    }

    async deleteCartItems(requestContext: RequestContext, cartId: string, items: CartItemDeleteInput[]) {
        return this.executeGQL(
            requestContext,
            {
                id: 'deleteCartItems',
                method: 'post',
                query: {
                    queryId: 'shopifyCartLinesRemove',
                    query: `mutation DeleteCartItems($cartId: ID!, $lineIds: [ID!]!) {
                    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
                        cart { ${this.CART_FIELDS} }
                        userErrors { field message }
                    }
                }`,
                },
            },
            {
                cartId,
                lineIds: items.map((item) => item.id),
            },
        );
    }

    async updateShipping(requestContext: RequestContext, cartId: string, address: CartAddressInput) {
        return this.executeGQL(
            requestContext,
            {
                id: 'updateShipping',
                method: 'post',
                query: {
                    queryId: 'updateShipping',
                    query: `
                        mutation UpdateShipping($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
                            cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
                                cart { ${this.CART_FIELDS} }
                            }
                        }
                    `,
                },
            },
            {
                cartId,
                buyerIdentity: {
                    deliveryAddressPreferences: [
                        {
                            deliveryAddress: {
                                address1: address?.line1 || address['addressLine1'] || address['street'] || '',
                                city: address?.city,
                                country: address?.country,
                                firstName: address?.firstName,
                                lastName: address?.lastName,
                                zip: address?.postalCode,
                            },
                        },
                    ],
                },
            },
        );
    }
}
