import { RequestContext } from '@context/request';
import {
    HCLCommerceAddPromoCodeBodyInput,
    HCLCommerceCartItemAddBodyInput,
    HCLCommerceCartItemUpdateBodyInput,
    HCLCommerceCartQueries,
    HCLCommercePaymentInstructionAddBodyInput,
    HCLCommerceShippingInfoInput,
} from './schema/hcl-commerce.cart.gql.schema';
import { HCLCommerceBaseGQLDatasource } from '@plugin-hcl-commerce/common';
import { GraphqlDatasourceServiceDefinition, GraphqlDatasourceServiceDefinitions, GraphqlHttpMethods } from '@plugin-datasource-graphql';

export interface HCLCommerceCartServiceDefinitions extends GraphqlDatasourceServiceDefinitions {
    createCart: GraphqlDatasourceServiceDefinition;
    addOrderItems: GraphqlDatasourceServiceDefinition;
    updateOrderItems: GraphqlDatasourceServiceDefinition;
    getCart: GraphqlDatasourceServiceDefinition;
    calculateOrder: GraphqlDatasourceServiceDefinition;
    addPaymentInstruction: GraphqlDatasourceServiceDefinition;
    deletePaymentInstruction: GraphqlDatasourceServiceDefinition;
    precheckout: GraphqlDatasourceServiceDefinition;
    checkout: GraphqlDatasourceServiceDefinition;
    setShipping: GraphqlDatasourceServiceDefinition;
    addPromoCode: GraphqlDatasourceServiceDefinition;
    deletePromoCode: GraphqlDatasourceServiceDefinition;
}

export class HCLCommerceCartGQLDatasource extends HCLCommerceBaseGQLDatasource {
    protected serviceDefinitions: HCLCommerceCartServiceDefinitions = {
        createCart: {
            id: 'createCart',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: HCLCommerceCartQueries.createCart,
        },
        addOrderItems: {
            id: 'addOrderItems',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: HCLCommerceCartQueries.addOrderItems,
        },
        updateOrderItems: {
            id: 'updateOrderItems',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: HCLCommerceCartQueries.updateOrderItems,
        },
        getCart: {
            id: 'getCart',
            method: GraphqlHttpMethods.get,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: HCLCommerceCartQueries.getCart,
        },
        calculateOrder: {
            id: 'calculateOrder',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: HCLCommerceCartQueries.calculateOrder,
        },
        addPaymentInstruction: {
            id: 'addPaymentInstruction',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: HCLCommerceCartQueries.addPaymentInstruction,
        },
        deletePaymentInstruction: {
            id: 'deletePaymentInstruction',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: HCLCommerceCartQueries.deletePaymentInstruction,
        },
        precheckout: {
            id: 'precheckout',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: HCLCommerceCartQueries.precheckout,
        },
        checkout: {
            id: 'checkout',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: HCLCommerceCartQueries.checkout,
        },
        setShipping: {
            id: 'setShipping',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: HCLCommerceCartQueries.setShipping,
        },
        addPromoCode: {
            id: 'addPromoCode',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: HCLCommerceCartQueries.addPromoCode,
        },
        deletePromoCode: {
            id: 'deletePromoCode',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: HCLCommerceCartQueries.deletePromoCode,
        },
    };

    async createCart(requestContext: RequestContext) {
        return await this.executeCartGQL(requestContext, this.serviceDefinitions.createCart);
    }

    async addOrderItems(requestContext: RequestContext, requestBody: HCLCommerceCartItemAddBodyInput) {
        const variables = {
            requestBody,
        };

        return await this.executeCartGQL(requestContext, this.serviceDefinitions.addOrderItems, variables);
    }

    async updateOrderItems(requestContext: RequestContext, requestBody: HCLCommerceCartItemUpdateBodyInput) {
        const variables = {
            requestBody,
        };

        return await this.executeCartGQL(requestContext, this.serviceDefinitions.updateOrderItems, variables);
    }

    async getCart(requestContext: RequestContext) {
        return await this.executeCartGQL(requestContext, this.serviceDefinitions.getCart);
    }

    async calculateOrder(requestContext: RequestContext, orderId: string) {
        const variables = {
            orderId,
        };

        return await this.executeCartGQL(requestContext, this.serviceDefinitions.calculateOrder, variables);
    }

    async addPaymentInstruction(requestContext: RequestContext, requestBody: HCLCommercePaymentInstructionAddBodyInput) {
        const variables = {
            requestBody,
        };

        return await this.executeCartGQL(requestContext, this.serviceDefinitions.addPaymentInstruction, variables);
    }

    async deletePaymentInstruction(requestContext: RequestContext, paymentInstructionId: string) {
        const variables = {
            paymentInstructionId,
        };

        return await this.executeCartGQL(requestContext, this.serviceDefinitions.deletePaymentInstruction, variables);
    }

    async setShipping(requestContext: RequestContext, requestBody: HCLCommerceShippingInfoInput) {
        const variables = {
            requestBody,
        };

        return await this.executeCartGQL(requestContext, this.serviceDefinitions.setShipping, variables);
    }

    async addPromoCode(requestContext: RequestContext, requestBody: HCLCommerceAddPromoCodeBodyInput) {
        const variables = {
            requestBody,
        };

        return await this.executeCartGQL(requestContext, this.serviceDefinitions.addPromoCode, variables);
    }

    async deletePromoCode(requestContext: RequestContext, promoCode: string) {
        const variables = {
            promoCode,
        };

        return await this.executeCartGQL(requestContext, this.serviceDefinitions.deletePromoCode, variables);
    }

    async precheckout(requestContext: RequestContext, orderId: string) {
        const variables = {
            orderId,
        };

        return await this.executeCartGQL(requestContext, this.serviceDefinitions.precheckout, variables);
    }

    async checkout(requestContext: RequestContext, orderId: string) {
        const variables = {
            orderId,
        };

        return await this.executeCartGQL(requestContext, this.serviceDefinitions.checkout, variables);
    }

    protected async executeCartGQL(requestContext: RequestContext, serviceDefinition: GraphqlDatasourceServiceDefinition, variables: any = {}, query?: any) {
        const methodname = `${HCLCommerceCartGQLDatasource.name}.executeCartGQL`;

        const queryId = serviceDefinition.query.queryId;

        let dsResult;

        try {
            const gqlResult = await this.executeGQL(requestContext, serviceDefinition, variables, query);

            dsResult = gqlResult[queryId];
        } catch (error) {
            this.logger.info(`${methodname} - Error executing ${queryId} ${this.logger.formatJSON(variables)}: ${this.logger.formatJSON(error)}`, requestContext);
            throw error;
        }

        return dsResult;
    }
}
