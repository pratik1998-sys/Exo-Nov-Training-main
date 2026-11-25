import { AdobeCommerceMoney, AdobeCommerceResultSet } from "@plugin-adobe-commerce/common";
import { AdobeCommerceProduct } from "@plugin-adobe-commerce/features/product";
import { AdobeCommerceDiscount, AdobeCommerceTaxItem } from "@plugin-adobe-commerce/features/quote";
import { GraphqlDatasourceQuery } from "@plugin-datasource-graphql";

export class AdobeCommerceCustomerOrderFilterInput {
    number?: {
        eq?: string;
        in?: string[];
    };
    status?: {
        eq?: string;
        in?: string[];
    };
    dateFrom?: {
        gte?: string;
    };
    dateTo?: {
        lte?: string;
    };
}

export class AdobeCommerceOrderInformationInput {
    email: string;
    number: string;
    postcode: string;
}

export class AdobeCommerceCustomerOrderSortInput {
    sort_field?: string;
    sort_direction?: string;
}

export enum ScopeTypeEnum {
    GLOBAL = 'GLOBAL',
    WEBSITE = 'WEBSITE',
    STORE = 'STORE',
}

export class AdobeCommerceOrderAddress {
    city?: string;
    company?: string;
    fax?: string;
    firstname?: string;
    lastname?: string;
    postcode?: string;
    region?: string;
    street?: string[];
    telephone?: string;

    static baseGQL = `
        city
        company
        firstname
        lastname
        postcode
        region 
        street
        telephone
    `;
}

export class AdobeCommerceBillingOrderAddress extends AdobeCommerceOrderAddress { }
export class AdobeCommerceShippingOrderAddress extends AdobeCommerceOrderAddress { }

export class AdobeCommerceSalesCommentItem {
    message?: string;
    timestamp?: string;

    static baseGQL = `
        message
        timestamp
    `;
}

export class AdobeCommerceOrderItemOption {
    label?: string;
    value?: string;

    static baseGQL = `
        label
        value
    `;
}

export class AdobeCommerceOrderItem {
    //discounts?: AdobeCommerceDiscount[];
    id?: string;
    product?: AdobeCommerceProduct;
    quantity_ordered?: number;
    selected_options?: AdobeCommerceOrderItemOption[];
    product_name?: string;
    product_sale_price?: AdobeCommerceMoney;
    product_sku?: string;
    product_url_key?: string;
    product_type?: string;

    static baseGQL(customAttributes: string[]) {
        return `
            id
            product_name
            product_sale_price {
                ${AdobeCommerceMoney.baseGQL}
            }
            product_sku
            product_url_key
            product_type
            quantity_ordered
            selected_options {
                ${AdobeCommerceOrderItemOption.baseGQL}
            }
        `;
    }
}

export class AdobeCommerceOrderPaymentMethod {
    //additionalData?: AdobeCommerceKeyValue[];
    name?: string;
    type?: string;

    static baseGQL = `
        name
        type
    `;
}

export class AdobeCommerceShippingDiscount {
    amount?: AdobeCommerceMoney;

    static baseGQL = `
        amount {
            ${AdobeCommerceMoney.baseGQL}
        }
    `;
}

export class AdobeCommerceShippingHandlingTotal {
    amount_excluding_tax?: AdobeCommerceMoney;
    amount_including_tax?: AdobeCommerceMoney;
    discounts?: AdobeCommerceShippingDiscount[];
    taxes?: AdobeCommerceTaxItem[];
    total_amount?: AdobeCommerceMoney;

    static baseGQL = `
        amount_excluding_tax {
            ${AdobeCommerceMoney.baseGQL}
        }
        amount_including_tax {
            ${AdobeCommerceMoney.baseGQL}
        }
        discounts {
            ${AdobeCommerceShippingDiscount.baseGQL}
        }
        taxes {
            ${AdobeCommerceTaxItem.baseGQL}
        }
        total_amount {
            ${AdobeCommerceMoney.baseGQL}
        }
    `;
}

export class AdobeCommerceOrderTotal {
    base_grand_total?: AdobeCommerceMoney;
    discounts?: AdobeCommerceDiscount[];
    grand_total?: AdobeCommerceMoney;
    shipping_handling?: AdobeCommerceShippingHandlingTotal;
    subtotal?: AdobeCommerceMoney;
    taxes?: AdobeCommerceTaxItem[];
    total_giftcard?: AdobeCommerceMoney;
    total_shipping?: AdobeCommerceMoney;
    total_tax?: AdobeCommerceMoney;

    static baseGQL = `
        grand_total {
            ${AdobeCommerceMoney.baseGQL}
        }
    `;

    static fullGQL = `
        base_grand_total {
            ${AdobeCommerceMoney.baseGQL}
        }
        discounts {
            ${AdobeCommerceDiscount.baseGQL}
        }
        grand_total {
            ${AdobeCommerceMoney.baseGQL}
        }
        shipping_handling {
            ${AdobeCommerceShippingHandlingTotal.baseGQL}
        }
        subtotal {
            ${AdobeCommerceMoney.baseGQL}
        }
        taxes {
            ${AdobeCommerceTaxItem.baseGQL}
        }
        total_giftcard {
            ${AdobeCommerceMoney.baseGQL}
        }
        total_shipping {
            ${AdobeCommerceMoney.baseGQL}
        }
        total_tax {
            ${AdobeCommerceMoney.baseGQL}
        }
    `;
}

export class AdobeCommerceCustomerOrder {
    //applied_coupons?: AdobeCommerceAppliedCoupon[];
    billing_address?: AdobeCommerceBillingOrderAddress;
    carrier?: string;
    comments?: AdobeCommerceSalesCommentItem[];
    //email?: string;
    id?: string;
    items?: AdobeCommerceOrderItem[];
    number?: string;
    order_date?: string;
    payment_methods?: AdobeCommerceOrderPaymentMethod[];
    shipping_address?: AdobeCommerceShippingOrderAddress;
    shipping_method?: string;
    status?: string;
    //token?: string;
    total?: AdobeCommerceOrderTotal;

    static baseGQL = `
        id
        items {
            id
        }
        number
        order_date
        status
        total {
            ${AdobeCommerceOrderTotal.baseGQL}
        }
    `;

    static detailGQL(customAttributes: string[]) {
        return `
            billing_address {
                ${AdobeCommerceBillingOrderAddress.baseGQL}
            }
            carrier
            comments {
                ${AdobeCommerceSalesCommentItem.baseGQL}
            }
            id
            items {
                ${AdobeCommerceOrderItem.baseGQL(customAttributes)}
            }
            number
            order_date
            payment_methods {
                ${AdobeCommerceOrderPaymentMethod.baseGQL}
            }
            shipping_address {
                ${AdobeCommerceShippingOrderAddress.baseGQL}
            }
            shipping_method
            status
            total {
                ${AdobeCommerceOrderTotal.fullGQL}
            }
        `;
    }
}

export class AdobeCommerceCustomerOrderResultSet extends AdobeCommerceResultSet {
    items: AdobeCommerceCustomerOrder[];

    static baseGQL = `
        ${super.baseGQL}
        items {
            ${AdobeCommerceCustomerOrder.baseGQL}
        }      
    `;

    static detailGQL(customAttributes: string[]) {
        return `
            ${super.baseGQL}
            items {
                ${AdobeCommerceCustomerOrder.detailGQL(customAttributes)}
            }      
        `;
    }
}

export const AdobeCommerceOrderQueries = {
    /*
    getCustomerOrderHistory: `query GetCustomerOrderHistory($pageSize: Int) {
           customer {
               orders(pageSize: $pageSize) {
                   items {
                      ${CustomerOrderHistoryOutput.baseGQL}
                   }
               }
           }
       }`,
    */

    /*
    getCustomerOrderDetail: `query GetCustomerOrderDetail($orderId: String!) {
        customer {
            orders(filter:{number:{eq: $orderId}}) {
                ${AdobeCommerceCustomerOrderResultSet.baseGQL}
            }
        }
    }`,
    */

    /*
    getCustomerOrders: (isDetailed: boolean, customAttributes: string[]): GraphqlDatasourceQuery => {
        return {
            queryId: 'customer.orders',
            query: `query GetCustomerOrders($filter: CustomerOrdersFilterInput, $currentPage: Int, $pageSize: Int, $sort: CustomerOrderSortInput, $scope: ScopeTypeEnum) {
                customer {
                    orders(filter: $filter, currentPage: $currentPage, pageSize: $pageSize, sort: $sort, scope: $scope) {
                        ${isDetailed ? AdobeCommerceCustomerOrderResultSet.detailGQL(customAttributes) : AdobeCommerceCustomerOrderResultSet.baseGQL}            
                    } 
                }  
            }`,
        };
    },
    */
    getCustomerOrders: (isDetailed: boolean, customAttributes: string[]): GraphqlDatasourceQuery => {
        return {
            queryId: 'customer.orders',
            query: `query GetCustomerOrders($filter: CustomerOrdersFilterInput, $currentPage: Int, $pageSize: Int) {
                customer {
                    orders(filter: $filter, currentPage: $currentPage, pageSize: $pageSize) {
                        ${isDetailed ? AdobeCommerceCustomerOrderResultSet.detailGQL(customAttributes) : AdobeCommerceCustomerOrderResultSet.baseGQL}            
                    } 
                }  
            }`,
        };
    },

    getGuestOrder: (isDetailed: boolean, customAttributes: string[]): GraphqlDatasourceQuery => {
        return {
            queryId: 'guestOrder',
            query: `query GuestOrder($input:OrderInformationInput) {
                guestOrder(input:$input) {
                        ${isDetailed ? AdobeCommerceCustomerOrderResultSet.detailGQL(customAttributes) : AdobeCommerceCustomerOrderResultSet.baseGQL}            
                }  
            }`,
        };
    },

    /*
    placeOrder: (customAttributes: string[]) => `mutation PlaceOrder($input: PlaceOrderInput!) {
        placeOrder(input: $input) {
            orderV2 {
                ${AdobeCommerceCustomerOrderResultSet.detailGQL(customAttributes)}
            }
        }
    }`,
    */
};
