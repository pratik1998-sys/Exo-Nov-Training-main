import { ApiConfiguration, ApiOperationDefinition, ApiOperationOptions } from "@api";
import { Order, OrderResultSet, OrderStatusResultSet } from "./order.model";
import { OrderRequestParameters } from "./order.parameters";

export interface OrderApiOperations {
    order: ApiOperationDefinition;
    orders: ApiOperationDefinition;
    orderStatuses: ApiOperationDefinition;
}

export class OrderApiConfiguration extends ApiConfiguration {
    static operations: OrderApiOperations = {
        order: {
            id: 'order',
            description: 'Get order',
            summary: 'Get order',
            isAuthRequired: false,
            restOptions: {
                isById: true,
                path: `:${OrderRequestParameters.id.id}`,
                apiOkResponseOptions: {
                    type: Order,
                },
                tags: [],
            },
            queryOptions: {
                required: false,
            },
        },
        orders: {
            id: 'orders',
            description: 'Get orders',
            summary: 'Get orders',
            isAuthRequired: false,
            restOptions: {
                apiOkResponseOptions: {
                    type: OrderResultSet,
                },
                tags: [],
            },
            queryOptions: {
                required: false,
            },
        },
        // orderSubmit: {
        //     id: 'orderSubmit',
        //     description: 'Submit order',
        //     summary: 'Submit order',
        //     restOptions: {
        //         apiOkResponseOptions: {
        //             type: Order
        //         },
        //         tags: []
        //     },
        //     mutationOptions: {
        //         required: false,
        //     }
        // },
        orderStatuses: {
            id: 'orderStatuses',
            description: 'Get order statuses',
            summary: 'Get order statuses',
            isAuthRequired: false,
            restOptions: {
                path: `status`,
                apiOkResponseOptions: {
                    type: OrderStatusResultSet,
                },
                tags: [],
            },
            queryOptions: {
                required: false,
            },
        },
    };

    static order(): ApiOperationOptions {
        return this.composeOperationOptions(this.operations.order);
    }

    static orders(): ApiOperationOptions {
        return this.composeOperationOptions(this.operations.orders);
    }

    static orderStatuses(): ApiOperationOptions {
        return this.composeOperationOptions(this.operations.orderStatuses);
    }
}
