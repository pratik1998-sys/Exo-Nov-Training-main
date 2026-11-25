import { AdobeCommerceAttributeValueInput, AdobeCommerceMoney, AdobeCommerceResultSet } from "@plugin-adobe-commerce/common";
import { AdobeCommerceDownloadableProductLinks, AdobeCommerceDownloadableProductSamples, AdobeCommerceProduct } from "@plugin-adobe-commerce/features/product";
import { AdobeCommerceAppliedCoupon, AdobeCommerceDiscount, AdobeCommerceQuoteAddress } from "@plugin-adobe-commerce/features/quote";
import { GraphqlDatasourceQuery } from "@plugin-datasource-graphql";

export class AdobeCommerceCartAddressInput {
    city?: string;
    company?: string;
    country_code?: string;
    custom_attributes?: AdobeCommerceAttributeValueInput[];
    fax?: string;
    firstname?: string;
    lastname?: string;
    middlename?: string;
    postcode?: string;
    prefix?: string;
    region?: string;
    region_id?: number;
    save_in_address_book?: boolean;
    street?: string[];
    suffix?: string;
    telephone?: string;
    vat_id?: string;
}

export class AdobeCommerceAppliedGiftCard {
    applied_balance?: AdobeCommerceMoney;
    code?: string;
    current_balance?: AdobeCommerceMoney;
    expiration_date?: string;

    static baseGQL = `
        applied_balance{
            ${AdobeCommerceMoney.baseGQL}
        }
        code
        current_balance{
            ${AdobeCommerceMoney.baseGQL}
        }
        expiration_date
    `;
}

export class AdobeCommerceRewardPointsAmount {
    money?: AdobeCommerceMoney;
    points?: number;
}

export class AdobeCommerceAppliedStoreCredit {
    applied_balance?: AdobeCommerceMoney;
    current_balance?: number;
    enabled?: boolean;
}

export class AdobeCommerceGiftWrappingImage {
    label?: string;
    url?: string;
}

export class AdobeCommerceGiftWrapping {
    design?: string;
    image?: AdobeCommerceGiftWrappingImage;
    price?: AdobeCommerceMoney;
    uid?: string;
}

export class AdobeCommerceAvailablePaymentMethod {
    code?: string;
    title?: string;

    static baseGQL = `
        code
        title
    `;
}

export class AdobeCommerceShippingMethod {
    amount?: AdobeCommerceMoney;
    carrier_code?: string;
    carrier_title?: string;
    method_code?: string;
    method_title?: string;
    // price_excl_tax?: AdobeCommerceMoney;
    // price_incl_tax?: AdobeCommerceMoney;

    static baseGQL = `
        amount {
            ${AdobeCommerceMoney.baseGQL}
        }
        carrier_code
        carrier_title
        method_code
        method_title
    `;
}

export class AdobeCommerceSelectedShippingMethod extends AdobeCommerceShippingMethod { }

export class AdobeCommerceAvailableShippingMethod extends AdobeCommerceShippingMethod {
    available?: boolean;
    error_message?: string;

    static baseGQL = `
        available
        error_message
    `;
}

export class AdobeCommerceCartItemError {
    code?: string;
    message?: string;

    static baseGQL = `
        code
        message
    `;
}

export class AdobeCommerceItemNote {
    created_at?: string;
    creator_id?: number;
    creator_type?: number;
    negotiable_quote_item_uid?: string;
    note?: string;
    note_uid?: string;

    static baseGQL = `
        created_at
        creator_id
        creator_type
        negotiable_quote_item_uid
        note
        note_uid
    `;
}

export class AdobeCommerceFixedProductTax {
    amount?: AdobeCommerceMoney;
    label?: string;

    static baseGQL = `
        amount {
            ${AdobeCommerceMoney.baseGQL}
        }
        label
    `;
}

export class AdobeCommerceCartItemPrices {
    discounts?: AdobeCommerceDiscount[];
    fixed_product_taxes?: AdobeCommerceFixedProductTax[];
    price?: AdobeCommerceMoney;
    price_including_tax?: AdobeCommerceMoney;
    row_total?: AdobeCommerceMoney;
    row_total_including_tax?: AdobeCommerceMoney;
    total_item_discount?: AdobeCommerceMoney;

    static baseGQL = `
        discounts {
            ${AdobeCommerceDiscount.baseGQL}
        }
        fixed_product_taxes {
            ${AdobeCommerceFixedProductTax.baseGQL}
        }
        price {
            ${AdobeCommerceMoney.baseGQL}
        }
        price_including_tax {
            ${AdobeCommerceMoney.baseGQL}
        }
        row_total {
            ${AdobeCommerceMoney.baseGQL}
        }
        row_total_including_tax {
            ${AdobeCommerceMoney.baseGQL}
        }
        total_item_discount {
            ${AdobeCommerceMoney.baseGQL}
        }
    `;
}

export class AdobeCommerceCartItemSelectedOptionValuePrice {
    type?: string;
    units?: string;
    value?: number;
}

export class AdobeCommerceSelectedCustomizableOptionValue {
    customizable_option_value_uid?: string;
    label?: string;
    price?: AdobeCommerceCartItemSelectedOptionValuePrice;
    value?: string;
}

export class AdobeCommerceSelectedCustomizableOption {
    customizable_option_uid?: string;
    is_required?: boolean;
    label?: string;
    sort_order?: number;
    type?: string;
    values?: AdobeCommerceSelectedCustomizableOptionValue[];
}

export class AdobeCommerceSelectedConfigurableOption {
    configurable_product_option_uid?: string;
    configurable_product_option_value_uid?: string;
    option_label?: string;
    value_label?: string;
}

export class AdobeCommerceSelectedBundleOptionValue {
    label?: string;
    price?: number;
    quantity?: number;
    uid?: string;
}

export class AdobeCommerceSelectedBundleOption {
    label?: string;
    type?: string;
    uid?: string;
    values?: AdobeCommerceSelectedBundleOptionValue[];
}

export class AdobeCommerceCartItem {
    //discount?: AdobeCommerceDiscount[];
    errors?: AdobeCommerceCartItemError[];
    //is_available?: boolean;
    //max_qty?: number;
    //min_qty?: number;
    //note_from_buyer?: AdobeCommerceItemNote[];
    //note_from_seller?: AdobeCommerceItemNote[];
    prices?: AdobeCommerceCartItemPrices;
    product?: AdobeCommerceProduct;
    quantity?: number;
    uid?: string;

    static baseGQL(customAttributes: string[]) {
        return `
            errors {
                ${AdobeCommerceCartItemError.baseGQL}
            }
            prices {
                ${AdobeCommerceCartItemPrices.baseGQL}
            }
            product {
                ${AdobeCommerceProduct.cartProductBaseGQL(customAttributes)}
            }
            quantity
            uid
            ... on ConfigurableCartItem {
                configurable_options {
                    configurable_product_option_uid
                    configurable_product_option_value_uid
                    id
                    option_label
                    value_id
                    value_label
                }
            }
        `;
    }
}

export class AdobeCommerceSimpleCartItem {
    available_gift_wrapping?: AdobeCommerceGiftWrapping[];
    customizable_options?: AdobeCommerceSelectedCustomizableOption[];
    gift_message?: AdobeCommerceGiftMessage;
    gift_wrapping?: AdobeCommerceGiftWrapping;
}

export class AdobeCommerceVirtualCartItem {
    customizable_options?: AdobeCommerceSelectedCustomizableOption[];
}

export class AdobeCommerceConfigurableCartItem {
    available_gift_wrapping?: AdobeCommerceGiftWrapping[];
    configurable_options?: AdobeCommerceSelectedConfigurableOption[];
    configured_variant?: AdobeCommerceProduct;
    customizable_options?: AdobeCommerceSelectedCustomizableOption[];
    gift_message?: AdobeCommerceGiftMessage;
    gift_wrapping?: AdobeCommerceGiftWrapping;
}

export class AdobeCommerceDownloadableCartItem {
    customizable_options?: AdobeCommerceSelectedCustomizableOption[];
    links?: AdobeCommerceDownloadableProductLinks[];
    samples?: AdobeCommerceDownloadableProductSamples[];
}

export class AdobeCommerceBundleCartItem {
    available_gift_wrapping?: AdobeCommerceGiftWrapping[];
    bundle_options?: AdobeCommerceSelectedBundleOption[];
    customizable_options?: AdobeCommerceSelectedCustomizableOption[];
    gift_message?: AdobeCommerceGiftMessage;
    gift_wrapping?: AdobeCommerceGiftWrapping;
}

export class AdobeCommerceGiftCardCartItem {
    amount?: AdobeCommerceMoney;
    customizable_options?: AdobeCommerceSelectedCustomizableOption[];
    message?: string;
    recipient_email?: string;
    recipient_name?: string;
    sender_email?: string;
    sender_name?: string;
}

export class AdobeCommerceBillingCartAddress extends AdobeCommerceQuoteAddress { }

export class AdobeCommerceShippingCartAddress extends AdobeCommerceQuoteAddress {
    available_shipping_methods?: AdobeCommerceAvailableShippingMethod[];
    cart_items_v2?: AdobeCommerceCartItem[];
    //custom_attributes?: AdobeCommerceAttributeValue;
    //middlename?: string;
    pickup_location_code?: string;
    //prefix?: string;
    selected_shipping_method?: AdobeCommerceSelectedShippingMethod;
    //suffix?: string;

    static gqlWithProducts(customAttributes: string[]) {
        return `
            ${super.baseGQL}
            available_shipping_methods {
                ${AdobeCommerceAvailableShippingMethod.baseGQL}
            }
            pickup_location_code
            selected_shipping_method {
                ${AdobeCommerceSelectedShippingMethod.baseGQL}
            }
        `;
    }
}

export class AdobeCommerceGiftMessage {
    from?: string;
    message?: string;
    to?: string;

    static baseGQL = `
        from
        message
        to
    `;
}

export class AdobeCommerceCartItems extends AdobeCommerceResultSet {
    items?: AdobeCommerceCartItem[];

    static gqlWithProducts(customAttributes: string[]) {
        return `
            ${this.baseGQL}
            items {
                ${AdobeCommerceCartItem.baseGQL(customAttributes)}
            }
        `;
    }
}

export class AdobeCommerceCartTaxItem {
    amount?: AdobeCommerceMoney;
    label?: string;

    static baseGQL = `
        amount {
            ${AdobeCommerceMoney.baseGQL}
        }
        label
    `;
}

export class AdobeCommerceGiftOptionsPrices {
    gift_wrapping_for_items?: AdobeCommerceMoney;
    gift_wrapping_for_order?: AdobeCommerceMoney;
    printed_card?: AdobeCommerceMoney;
}

export class AdobeCommerceCartPrices {
    applied_taxes?: AdobeCommerceCartTaxItem[];
    discounts?: AdobeCommerceDiscount[];
    gift_options?: AdobeCommerceGiftOptionsPrices;
    grand_total?: AdobeCommerceMoney;
    subtotal_excluding_tax?: AdobeCommerceMoney;
    subtotal_including_tax?: AdobeCommerceMoney;
    subtotal_with_discount_excluding_tax?: AdobeCommerceMoney;

    static baseGQL = `
        applied_taxes {
            ${AdobeCommerceCartTaxItem.baseGQL}
        }
        discounts {
            ${AdobeCommerceDiscount.baseGQL}
        }
        grand_total{
            ${AdobeCommerceMoney.baseGQL}
        }
        subtotal_excluding_tax{
            ${AdobeCommerceMoney.baseGQL}
        }
        subtotal_including_tax{
            ${AdobeCommerceMoney.baseGQL}
        }
        subtotal_with_discount_excluding_tax{
            ${AdobeCommerceMoney.baseGQL}
        }
    `;
}

export class AdobeCommerceSelectedPaymentMethod {
    code?: string;
    purchase_order_number?: string;
    title?: string;

    static baseGQL = `
        code
        purchase_order_number
        title
    `;
}

export class AdobeCommerceCart {
    applied_coupons?: AdobeCommerceAppliedCoupon[];
    applied_gift_cards?: AdobeCommerceAppliedGiftCard[];
    applied_reward_points?: AdobeCommerceRewardPointsAmount;
    applied_store_credit?: AdobeCommerceAppliedStoreCredit;
    available_gift_wrappings?: AdobeCommerceGiftWrapping[];
    available_payment_methods?: AdobeCommerceAvailablePaymentMethod[];
    billing_address?: AdobeCommerceBillingCartAddress;
    email?: string;
    gift_message?: AdobeCommerceGiftMessage;
    gift_receipt_included?: boolean;
    gift_wrapping?: AdobeCommerceGiftWrapping;
    id?: string;
    is_virtual?: string;
    items?: AdobeCommerceCartItem[];
    //itemsV2?: AdobeCommerceCartItems;
    prices?: AdobeCommerceCartPrices;
    printed_card_included?: boolean;
    selected_payment_method?: AdobeCommerceSelectedPaymentMethod;
    shipping_addresses?: AdobeCommerceShippingCartAddress[];
    total_quantity?: number;

    static baseGQL(customAttributes: string[]) {
        return `
            applied_coupons {
                ${AdobeCommerceAppliedCoupon.baseGQL}
            }
            applied_gift_cards {
                ${AdobeCommerceAppliedGiftCard.baseGQL}
            }
            available_payment_methods{
                ${AdobeCommerceAvailablePaymentMethod.baseGQL}
            }
            billing_address{
                ${AdobeCommerceBillingCartAddress.baseGQL}
            }
            email
            gift_message {
                ${AdobeCommerceGiftMessage.baseGQL}
            }
            gift_receipt_included
            id
            is_virtual
            items{
                ${AdobeCommerceCartItem.baseGQL(customAttributes)}
            }
            prices {
                ${AdobeCommerceCartPrices.baseGQL}
            }
            selected_payment_method {
                ${AdobeCommerceSelectedPaymentMethod.baseGQL}
            }
            shipping_addresses {
                ${AdobeCommerceShippingCartAddress.gqlWithProducts(customAttributes)}
            }
            total_quantity
        `;
    }
}

export class AdobeCommerceApplyCouponToCartInput {
    cart_id?: string;
    coupon_code?: string;
}

export class AdobeCommerceRemoveCouponFromCartInput {
    cart_id?: string;
    coupon_code?: string;
}

export class AdobeCommerceSetGuestEmailOnCartInput {
    cart_id?: string;
    email?: string;
}

export class AdobeCommerceCartUserInputError {
    code?: string;
    message?: string;

    static baseGQL = `
        code
        message
    `;
}

export class AdobeCommerceAddProductsToCartOutput {
    cart?: AdobeCommerceCart;
    user_errors?: AdobeCommerceCartUserInputError[];

    static baseGQL(customAttributes: string[]) {
        return `
            cart {
                ${AdobeCommerceCart.baseGQL(customAttributes)}
            }
            user_errors {
                ${AdobeCommerceCartUserInputError.baseGQL}
            }
        `;
    }
}

export class AdobeCommerceEnteredOptionInput {
    uid?: string;
    value?: string;
}

export class AdobeCommerceCartItemInput {
    entered_options?: AdobeCommerceEnteredOptionInput[];
    parent_sku?: string;
    quantity?: number;
    selected_options?: string[];
    sku?: string;
}

export class AdobeCommerceUpdateCartItemsOutput {
    cart?: AdobeCommerceCart;

    static baseGQL(customAttributes: string[]) {
        return `
            cart {
                ${AdobeCommerceCart.baseGQL(customAttributes)}
            }
        `;
    }
}

export class AdobeCommerceCustomizableOptionInput {
    id?: string;
    uid?: string;
    value_string?: string;
}

export class AdobeCommerceGiftMessageInput {
    from?: string;
    message?: string;
    to?: string;
}

export class AdobeCommerceCartItemUpdateInput {
    cart_item_uid?: string;
    customizable_options?: AdobeCommerceCustomizableOptionInput[];
    gift_message?: AdobeCommerceGiftMessageInput;
    gift_wrapping_id?: string;
    quantity?: number;
}

export class AdobeCommerceShippingMethodInput {
    carrier_code?: string;
    method_code?: string;
}

export class AdobeCommercePaymentMethodInput {
    code?: string;
}

export class ApplyCouponsToCartInput {
    cart_id?: string;
    coupon_code?: string;
}

export class AdobeCommerceBaseAddressInput {
    address?: AdobeCommerceCartAddressInput;
    customer_address_id?: number;
}
export class AdobeCommerceShippingAddressInput extends AdobeCommerceBaseAddressInput {
    customer_notes?: string;
    pickup_location_code?: string;
}

export class AdobeCommerceBillingAddressInput extends AdobeCommerceBaseAddressInput {
    same_as_shipping?: boolean;
    use_for_shipping?: boolean;
}

export class AdobeCommerceUpdateCartItemsInput {
    cart_id?: string;
    cart_items?: AdobeCommerceCartItemUpdateInput[];
}

export class AdobeCommerceSetShippingMethodsOnCartInput {
    cart_id?: string;
    shipping_methods?: AdobeCommerceShippingMethodInput[];
}

export class AdobeCommerceSetPaymentMethodOnCartInput {
    cart_id?: string;
    payment_method?: AdobeCommercePaymentMethodInput;
}

export class AdobeCommerceSetBillingAddressOnCartInput {
    cart_id?: string;
    billing_address?: AdobeCommerceBillingAddressInput;
}

export class AdobeCommerceSetShippingAddressesOnCartInput {
    cart_id?: string;
    shipping_addresses?: AdobeCommerceShippingAddressInput[];
}

export class AdobeCommerceSetShippingAddressesOnCartOutput {
    cart?: AdobeCommerceCart;

    static baseGQL(customAttributes: string[]) {
        return `
            cart {
                ${AdobeCommerceCart.baseGQL(customAttributes)}
            }
        `;
    }
}

export class AdobeCommerceSetBillingAddressOnCartOutput {
    cart?: AdobeCommerceCart;

    static baseGQL(customAttributes: string[]) {
        return `
            cart {
                ${AdobeCommerceCart.baseGQL(customAttributes)}
            }
        `;
    }
}

export class AdobeCommerceApplyCouponToCartOutput {
    cart?: AdobeCommerceCart;

    static baseGQL(customAttributes: string[]) {
        return `
            cart {
                ${AdobeCommerceCart.baseGQL(customAttributes)}
            }
        `;
    }
}

export class AdobeCommerceSetGuestEmailOnCartOutput {
    cart?: AdobeCommerceCart;

    static baseGQL(customAttributes: string[]) {
        return `
            cart {
                ${AdobeCommerceCart.baseGQL(customAttributes)}
            }
        `;
    }
}

export class AdobeCommerceRemoveCouponFromCartOutput {
    cart?: AdobeCommerceCart;

    static baseGQL(customAttributes: string[]) {
        return `
            cart {
                ${AdobeCommerceCart.baseGQL(customAttributes)}
            }
        `;
    }
}

export class AdobeCommerceRemoveItemFromCartOutput {
    cart?: AdobeCommerceCart;

    static baseGQL(customAttributes: string[]) {
        return `
            cart {
                ${AdobeCommerceCart.baseGQL(customAttributes)}
            }
        `;
    }
}

export class AdobeCommerceSetPaymentMethodOnCartOutput {
    cart?: AdobeCommerceCart;

    static baseGQL(customAttributes: string[]) {
        return `
            cart {
                ${AdobeCommerceCart.baseGQL(customAttributes)}
            }
        `;
    }
}

export class AdobeCommerceSetShippingMethodsOnCartOutput {
    cart?: AdobeCommerceCart;

    static baseGQL(customAttributes: string[]) {
        return `
            cart {
                ${AdobeCommerceCart.baseGQL(customAttributes)}
            }
        `;
    }
}

export class AdobeCommerceRemoveItemFromCartInput {
    cart_id?: string;
    cart_item_uid?: string;
}

export const AdobeCommerceCartQueries = {
    getCartById: (customAttributes: string[]): GraphqlDatasourceQuery => {
        return {
            queryId: 'cart',
            query: `query GetCartById($cart_id:String!){
                cart(cart_id:$cart_id){
                    ${AdobeCommerceCart.baseGQL(customAttributes)}
                }
            }`,
        };
    },

    getCustomerCart: (customAttributes: string[]): GraphqlDatasourceQuery => {
        return {
            queryId: 'customerCart',
            query: `query GetCustomerCart{
                customerCart{
                    ${AdobeCommerceCart.baseGQL(customAttributes)}
                }
            }`,
        };
    },

    /*
    createGuestCart: (customAttributes: string[]) => `mutation CreateGuestCart($input:ApplyCouponToCartInput){
            createGuestCart(input:$input){
                ${AdobeCommerceCart.baseGQL(customAttributes)}
            }
        }`,
    */

    createEmptyCart: (): GraphqlDatasourceQuery => {
        return {
            queryId: 'createEmptyCart',
            query: `mutation CreateEmptyCart{
                createEmptyCart
            }`,
        };
    },

    mergeCarts: (customAttributes: string[]): GraphqlDatasourceQuery => {
        return {
            queryId: 'mergeCarts',
            query: `mutation MergeCarts($source_cart_id:String!, $destination_cart_id:String){
                mergeCarts(source_cart_id:$source_cart_id, destination_cart_id:$destination_cart_id){
                    ${AdobeCommerceCart.baseGQL(customAttributes)}
                }
            }`,
        };
    },

    addProductsToCart: (customAttributes: string[]): GraphqlDatasourceQuery => {
        return {
            queryId: 'addProductsToCart',
            query: `mutation AddProductsToCart($cartId:String!, $cartItems: [CartItemInput!]!){
                addProductsToCart(cartId:$cartId, cartItems:$cartItems){
                    ${AdobeCommerceAddProductsToCartOutput.baseGQL(customAttributes)}
                }
            }`,
        };
    },

    updateCartItems: (customAttributes: string[]): GraphqlDatasourceQuery => {
        return {
            queryId: 'updateCartItems',
            query: `mutation UpdateCartItems($input:UpdateCartItemsInput){
                updateCartItems(input:$input){
                    ${AdobeCommerceUpdateCartItemsOutput.baseGQL(customAttributes)}
                }
            }`,
        };
    },

    removeItemFromCart: (customAttributes: string[]): GraphqlDatasourceQuery => {
        return {
            queryId: 'removeItemFromCart',
            query: `mutation RemovItemFromCart($input:RemovItemFromCartInput){
                removeItemFromCart(input:$input){
                    ${AdobeCommerceRemoveItemFromCartOutput.baseGQL(customAttributes)}
                }
            }`,
        };
    },
    setShippingMethodsOnCart: (customAttributes: string[]): GraphqlDatasourceQuery => {
        return {
            queryId: 'setShippingMethodsOnCart',
            query: `mutation SetShippingMethodsOnCart($input:SetShippingMethodsOnCartInput) {
                setShippingMethodsOnCart(input: $input) {
                    ${AdobeCommerceSetShippingMethodsOnCartOutput.baseGQL(customAttributes)}
                }
            }`,
        };
    },
    setPaymentMethodOnCart: (customAttributes: string[]): GraphqlDatasourceQuery => {
        return {
            queryId: 'setPaymentMethodOnCart',
            query: `mutation SetPaymentMethodOnCart($input:SetPaymentMethodOnCartInput) {
                setPaymentMethodOnCart(input: $input) {
                    ${AdobeCommerceSetPaymentMethodOnCartOutput.baseGQL(customAttributes)}
                }
            }`,
        };
    },
    setShippingAddressOnCart: (customAttributes: string[]): GraphqlDatasourceQuery => {
        return {
            queryId: 'setShippingAddressesOnCart',
            query: `mutation SetShippingAddressOnCart($input: SetShippingAddressesOnCartInput) {
                setShippingAddressesOnCart(input: $input) {
                    ${AdobeCommerceSetShippingAddressesOnCartOutput.baseGQL(customAttributes)}
                }
            }`,
        };
    },
    setBillingAddressOnCart: (customAttributes: string[]): GraphqlDatasourceQuery => {
        return {
            queryId: 'setBillingAddressOnCart',
            query: `mutation SetBillingAddressOnCart($input:SetBillingAddressOnCartInput) {
                setBillingAddressOnCart(input: $input) {
                    ${AdobeCommerceSetBillingAddressOnCartOutput.baseGQL(customAttributes)}
                }
            }`,
        };
    },
    applyCouponToCart: (customAttributes: string[]): GraphqlDatasourceQuery => {
        return {
            queryId: 'applyCouponToCart',
            query: `mutation ApplyCouponToCart($input: ApplyCouponToCartInput) {
                applyCouponToCart(input: $input) {
                    ${AdobeCommerceApplyCouponToCartOutput.baseGQL(customAttributes)}
                }
            }`,
        };
    },
    removeCouponFromCart: (customAttributes: string[]): GraphqlDatasourceQuery => {
        return {
            queryId: 'removeCouponFromCart',
            query: `mutation RemoveCouponFromCart($input: RemoveCouponFromCartInput) {
                removeCouponFromCart(input: $input) {
                    ${AdobeCommerceApplyCouponToCartOutput.baseGQL(customAttributes)}
                }
            }`,
        };
    },
    setGuestEmailOnCart: (customAttributes: string[]): GraphqlDatasourceQuery => {
        return {
            queryId: 'setGuestEmailOnCart',
            query: `mutation SetGuestEmailOnCart($input: SetGuestEmailOnCartInput) {
                setGuestEmailOnCart(input: $input) {
                    ${AdobeCommerceSetGuestEmailOnCartOutput.baseGQL(customAttributes)}
                }
            }`,
        };
    },
    placeOrder: (customAttributes: string[]): GraphqlDatasourceQuery => {
        return {
            queryId: 'placeOrder',
            query: `mutation PlaceOrder($input: PlaceOrderInput!) {
                placeOrder(input: $input) {
                    order {
                        order_number
                    }
                }
            }`,
        };
    },
};
