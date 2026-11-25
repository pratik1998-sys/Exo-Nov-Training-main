import { RequestContext } from "@context/request";
import { AdobeCommerceBaseDatasource } from "@plugin-adobe-commerce/common";
import { AdobeCommerceCustomerOrder, AdobeCommerceCustomerOrderFilterInput, AdobeCommerceCustomerOrderResultSet, AdobeCommerceCustomerOrderSortInput, AdobeCommerceOrderQueries, ScopeTypeEnum } from "./schema/adobe-commerce.order.schema";
import { GraphqlDatasourceServiceDefinition, GraphqlDatasourceServiceDefinitions, GraphqlHttpMethods } from "@plugin-datasource-graphql";

export interface AdobeCommerceOrderServiceDefinitions extends GraphqlDatasourceServiceDefinitions {
    getCustomerOrder: GraphqlDatasourceServiceDefinition;
    getCustomerOrders: GraphqlDatasourceServiceDefinition;
    getGuestOrder: GraphqlDatasourceServiceDefinition;
}

export class AdobeCommerceOrderDatasource extends AdobeCommerceBaseDatasource {
    protected serviceDefinitions: AdobeCommerceOrderServiceDefinitions = {
        /*
        getCustomerOrderHistory: {
            id: 'getCustomerOrderHistory',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401]
            },
            query: AdobeCommerceBaseDatasource.prettifyQuery(AdobeCommerceCustomerQueries.getCustomerOrderHistory)
        },
        */
        getCustomerOrder: {
            id: 'getCustomerOrder',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: undefined,
        },
        getCustomerOrders: {
            id: 'getCustomerOrders',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: undefined,
        },
        getGuestOrder: {
            id: 'getGuestOrder',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: undefined,
        },
    };

    /*
    async getCustomerOrderHistory(requestContext: RequestContext, input: CustomerOrderHistoryInput): Promise<CustomerOrderHistoryOutput[]> {
        const methodname = `${AdobeCommerceCustomerDatasource.name}.getCustomerOrderHistory`;

        let result: CustomerOrderHistoryOutput[] = [];

        const variables = {
            pageSize: input.pageSize
            //TODO Retrieve orders based on scope argument //scope: input.scope //scope: GLOBAL
        };

        try {
            const gqlResult = await this.executeGQL(requestContext, serviceDefinitions[serviceIds.getCustomerOrderHistory], variables);

            if (gqlResult.errors) {
                throw new Error(`GraphQL error: ${gqlResult.errors.map(e => e.message).join(', ')}`);
            }
            //console.log("GQL Result: ", gqlResult.customer.orders+ "  "+JSON.stringify(gqlResult));

            if (!gqlResult || !gqlResult.customer || !gqlResult.customer.orders || !gqlResult.customer.orders.items) {
                throw new Error('Invalid response structure or missing order data');
            }

            result = gqlResult.customer.orders.items.map((order: any) => ({
                orderId: order.id,
                orderNumber: order.order_number,
                orderDate: order.order_date,
                orderStatus: order.status,
                totalPrice: `${order.total.grand_total.value} ${order.total.grand_total.currency}`,
                shippingPrice: '',
                billingAddress: '',
                shippingAddress: '',
                items: []
            }));
        } catch (error) {
            this.logger.info(`${methodname} - Error retrieving customer order history for pageSize ${input.pageSize}: ${error.message}`, requestContext);
            throw error;
        }

        return result;
    }
    */

    async getCustomerOrder(id: string, requestContext: RequestContext): Promise<AdobeCommerceCustomerOrder> {
        const methodname = `${AdobeCommerceOrderDatasource.name}.getCustomerOrder`;

        const filter: AdobeCommerceCustomerOrderFilterInput = {
            number: {
                eq: id,
            },
        };

        const variables = {
            filter,
        };

        const gqlResult = await this.executeGQLService<{ customer: { orders: { items: AdobeCommerceCustomerOrder[] } } }>(
            requestContext,
            this.serviceDefinitions.getCustomerOrders,
            variables,
            this.getCustomerOrderQuery(requestContext),
        );

        return gqlResult?.customer?.orders?.items?.length > 0 ? gqlResult.customer.orders.items[0] : null;
    }

    async getCustomerOrders(
        filter: AdobeCommerceCustomerOrderFilterInput,
        pageSize: number,
        currentPage: number,
        sort: AdobeCommerceCustomerOrderSortInput,
        scope: ScopeTypeEnum,
        requestContext: RequestContext,
        context?: any,
    ): Promise<AdobeCommerceCustomerOrderResultSet> {
        const methodname = `${AdobeCommerceOrderDatasource.name}.getCustomerOrders`;

        const variables = {
            filter,
            currentPage,
            pageSize,
            sort,
            scope,
        };

        const gqlResult = await this.executeGQL<{ customer: { orders: AdobeCommerceCustomerOrderResultSet } }>(
            requestContext,
            this.serviceDefinitions.getCustomerOrders,
            variables,
            this.getCustomerOrdersQuery(requestContext),
        );

        return gqlResult?.customer?.orders;
    }

    async getGuestOrder(identifier: string, email: string, postalCode: string, requestContext: RequestContext, context?: any): Promise<AdobeCommerceCustomerOrder> {
        const methodname = `${AdobeCommerceOrderDatasource.name}.getGuestOrder`;

        const variables = {
            input: {
                number: identifier,
                email,
                postcode: postalCode,
            },
        };

        const gqlResult = await this.executeGQLService<{ guestOrder: AdobeCommerceCustomerOrder }>(
            requestContext,
            this.serviceDefinitions.getGuestOrder,
            variables,
            this.getGuestOrderQuery(requestContext),
        );

        return gqlResult?.guestOrder;
    }

    /*
    async placeOrder(id: string, requestContext: RequestContext): Promise<AdobeCommerceCustomerOrder> {
        const methodname = `${AdobeCommerceOrderDatasource.name}.placeOrder`;

        let result: AdobeCommerceCustomerOrder;

        const variables = {
            input: {
                cart_id: id
            }
        };

        try {
            const gqlResult = await this.executeGQL(requestContext, serviceDefinitions[serviceIds.placeOrder], variables, this.getPlaceOrderQuery(requestContext));

            result = gqlResult?.placeOrder?.orderV2;

            this.logger.info(`${methodname}: Order placed successfully for cart ${id}`, requestContext);

        } catch (error) {
            this.logger.error(`${methodname}: Error placing order for cart ${id}: ${error.message}`, requestContext);
            throw error;
        }
        
        return result;
    }
    */

    // async placeOrder(id: string, requestContext: RequestContext): Promise<string> {
    //     const methodname = `${AdobeCommerceOrderDatasource.name}.placeOrder`;

    //     const variables = {
    //         input: {
    //             cart_id: id,
    //         },
    //     };

    //     const gqlResult = await this.executeGQL<{ placeOrder: { order: { order_number: string } } }>(
    //         requestContext,
    //         serviceDefinitions[serviceIds.placeOrder],
    //         variables,
    //         this.getPlaceOrderQuery(requestContext),
    //     );

    //     return gqlResult?.placeOrder?.order?.order_number;
    // }

    protected getCustomerOrdersQuery(requestContext: RequestContext) {
        const service = this.serviceDefinitions.getCustomerOrder;

        if (!service.query) {
            this.setServiceDynamicQuery(service, AdobeCommerceOrderQueries.getCustomerOrders(true, this.getProductAttributes(requestContext)));
        }

        return service.query;
    }

    protected getCustomerOrderQuery(requestContext: RequestContext) {
        const service = this.serviceDefinitions.getCustomerOrder;

        if (!service.query) {
            this.setServiceDynamicQuery(service, AdobeCommerceOrderQueries.getCustomerOrders(true, this.getProductAttributes(requestContext)));
        }

        return service.query;
    }

    protected getGuestOrderQuery(requestContext: RequestContext) {
        const service = this.serviceDefinitions.getGuestOrder;

        if (!service.query) {
            this.setServiceDynamicQuery(service, AdobeCommerceOrderQueries.getGuestOrder(true, this.getProductAttributes(requestContext)));
        }

        return service.query;
    }
}
