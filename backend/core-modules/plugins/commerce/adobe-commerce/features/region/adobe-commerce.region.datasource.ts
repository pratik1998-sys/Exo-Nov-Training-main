import { RequestContext } from "@context/request";
import { AdobeCommerceBaseDatasource } from "@plugin-adobe-commerce/common";
import { AdobeCommerceCountry, AdobeCommerceRegionQueries } from "./schema/adobe-commerce.region.schema";
import { GraphqlDatasourceServiceDefinition, GraphqlDatasourceServiceDefinitions, GraphqlHttpMethods } from "@plugin-datasource-graphql";

export interface AdobeCommerceRegionServiceDefinitions extends GraphqlDatasourceServiceDefinitions {
    countries: GraphqlDatasourceServiceDefinition;
    country: GraphqlDatasourceServiceDefinition;
}

export class AdobeCommerceRegionDatasource extends AdobeCommerceBaseDatasource {
    protected serviceDefinitions: AdobeCommerceRegionServiceDefinitions = {
        countries: {
            id: 'countries',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: AdobeCommerceRegionQueries.countries,
        },
        country: {
            id: 'country',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
            query: AdobeCommerceRegionQueries.country,
        },
    };

    async getCountries(requestContext: RequestContext): Promise<AdobeCommerceCountry[]> {
        const methodname = `${AdobeCommerceRegionDatasource.name}.getCountries`;

        const gqlResult = await this.executeGQLService<{ countries: AdobeCommerceCountry[] }>(requestContext, this.serviceDefinitions.countries);

        return gqlResult.countries;
    }

    async getCountry(requestContext: RequestContext, id: string): Promise<AdobeCommerceCountry> {
        const methodname = `${AdobeCommerceRegionDatasource.name}.getCountry`;

        const gqlResult = await this.executeGQLService<{ country: AdobeCommerceCountry }>(requestContext, this.serviceDefinitions.country);

        return gqlResult.country;
    }
}
