import { RequestContext } from "@context/request";
import { GraphqlDatasourceServiceDefinition, GraphqlDatasourceServiceDefinitions, GraphqlHttpMethods } from "@plugin-datasource-graphql";
import { HCLCommerceBaseGQLDatasource } from "@plugin-hcl-commerce/common";
import { HCLCommerceECAuthenticateQueries } from "./schema/hcl-commerce.ec-authenticate.gql.schema";

export interface HCLCommerceECAuthenticateServiceDefinitions extends GraphqlDatasourceServiceDefinitions {
    loginIdentityLogin: GraphqlDatasourceServiceDefinition;
    guestIdentityLogin: GraphqlDatasourceServiceDefinition;
}

export class HCLCommerceECAuthenticateDatasource extends HCLCommerceBaseGQLDatasource {
    protected serviceDefinitions: HCLCommerceECAuthenticateServiceDefinitions = {
        loginIdentityLogin: {
            id: 'loginIdentityLogin',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: HCLCommerceECAuthenticateQueries.loginIdentityLogin,
        },
        guestIdentityLogin: {
            id: 'guestIdentityLogin',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: HCLCommerceECAuthenticateQueries.guestIdentityLogin,
        },
    };

    private readonly identityTypes = {
        login: 'login',
        guest: 'guest',
    };

    async authenticate(requestContext: RequestContext, username: string, password: string): Promise<{ WCToken: string; WCTrustToken: string }> {
        const methodname = `${HCLCommerceECAuthenticateDatasource.name}.authenticate`;

        let result = null;

        const variables = {
            requestBody: {
                logonId: username,
                logonPassword: password,
            },
        };

        try {
            const gqlResult = await this.executeGQL<{ loginIdentityLogin: any }>(requestContext, this.serviceDefinitions.loginIdentityLogin, variables);

            result = this.extractTokens(requestContext, gqlResult?.loginIdentityLogin, variables, this.identityTypes.login);
        } catch (error) {
            this.logger.info(`${methodname} - Error executing login: ${this.logger.formatJSON(error)}`, requestContext);
            throw error;
        }

        return result;
    }

    async authenticateGuest(requestContext: RequestContext): Promise<{ WCToken: string; WCTrustToken: string }> {
        const methodname = `${HCLCommerceECAuthenticateDatasource.name}.authenticate`;

        let result = null;

        try {
            const gqlResult = await this.executeGQL<{ guestIdentityLogin: any }>(requestContext, this.serviceDefinitions.guestIdentityLogin);

            result = this.extractTokens(requestContext, gqlResult?.guestIdentityLogin, {}, this.identityTypes.guest);
        } catch (error) {
            this.logger.info(`${methodname} - Error executing guest authentication: ${this.logger.formatJSON(error)}`, requestContext);
            throw error;
        }

        return result;
    }

    protected extractTokens(requestContext: RequestContext, response: any, variables: any, identityType: string) {
        const methodname = `${HCLCommerceECAuthenticateDatasource.name}.extractResponseTokens`;

        let result = null;

        if (response?.wCToken || !response?.wCTrustedToken) {
            const { wCToken, wCTrustedToken } = response;

            result = {
                wcToken: wCToken,
                wcTrustedToken: wCTrustedToken,
            };
        } else {
            this.logger.info(
                `${methodname} - Invalid ${identityType} authentication response: ${this.logger.formatJSON(response, true)} - Result: ${this.logger.formatJSON(variables, true)}`,
                requestContext,
            );
            throw new Error('AUTHENTICATION_INVALID_AUTHENTICATION_RESPONSE');
        }

        return result;
    }
}
