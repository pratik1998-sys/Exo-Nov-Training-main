import { GraphqlDatasourceQueries } from "@plugin-datasource-graphql";

export class HCLCommerceTokens {
    static baseGQL = `
        wCToken
        wCTrustedToken
    `;
}

export const HCLCommerceECAuthenticateQueries: GraphqlDatasourceQueries = {
    guestIdentityLogin: {
        queryId: 'guestIdentityLogin',
        query: `mutation GuestIdentityLogin($storeId: String!) {
            guestIdentityLogin(storeId: $storeId) {
                ${HCLCommerceTokens.baseGQL}
            }
        }`,
    },
    loginIdentityLogin: {
        queryId: 'loginIdentityLogin',
        query: `mutation LoginIdentityLogin($storeId: String!, $requestBody: loginIdentityFormInput!) {
            loginIdentityLogin(storeId: $storeId, requestBody: $requestBody) {
                userId
                ${HCLCommerceTokens.baseGQL}
            }
        }`,
    },
};
