import { GraphqlDatasourceQueries } from "@plugin-datasource-graphql";

export const AdobeCommerceECAuthenticateQueries: GraphqlDatasourceQueries = {
    generateCustomerToken: {
        queryId: 'generateCustomerToken',
        query: `mutation GenerateCustomerToken($email:String!, $password:String!){
            generateCustomerToken(email:$email, password:$password){
                token
            }
        }`,
    },
};
