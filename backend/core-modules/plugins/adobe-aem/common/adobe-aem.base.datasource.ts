import { AdobeAEMAuthenticationRegistry } from "./adobe-aem.common.authentication.registry";
import { RequestContext } from "@context/request";
import { AdobeAEMConsumerConfiguration, AdobeAEMPersistedQuery } from "@plugin-adobe-aem/common/types";
import { DatasourceServiceDefinition, BaseRestDatasource, RestDatasourceServiceDefinition } from "@plugin-datasource-rest";
import { StringUtility } from "@utilities";

export const AdobeAEMDatasourcePathParams = {
    language: ':language',
    path: ':path',
    id: ':id',
    appId: ':appId',
    siteId: ':siteId',
};

export abstract class AdobeAEMBaseDatasource extends BaseRestDatasource {
    protected consumerPersistedQueries: Record<string, Record<string, AdobeAEMPersistedQuery>> = {};

    protected composeHeaders(requestContext: RequestContext, datasourceConfig: any, headers: Record<string, any>, serviceDefinition: DatasourceServiceDefinition) {
        const authRegistry = this.getRegistry<AdobeAEMAuthenticationRegistry>(requestContext, AdobeAEMAuthenticationRegistry);

        return {
            authorization: authRegistry.getAuthorizationHeader(),
        };
    }

    protected async executePersistedQueryByPath(requestContext: RequestContext, serviceDefinition: RestDatasourceServiceDefinition, variables: Record<string, any>, pathKey: string, id?: string) {
        const methodname = `${AdobeAEMBaseDatasource.name}.executePersistedQueryByPath`;

        const persistedQuery: AdobeAEMPersistedQuery = this.resolvePersistedQuery(requestContext, serviceDefinition);

        variables = variables ?? {};

        variables[pathKey] = persistedQuery.contentFragmentPath;

        if (StringUtility.isStringNotEmpty(id)) {
            variables[pathKey] = `${variables[pathKey]}/${id}`;
        }

        return await this.executePersistedQuery(requestContext, serviceDefinition, variables);
    }

    protected async executePersistedQuery(requestContext: RequestContext, serviceDefinition: RestDatasourceServiceDefinition, variables: Record<string, any>) {
        const methodname = `${AdobeAEMBaseDatasource.name}.executePersistedQuery`;

        let result = null;

        const persistedQuery: AdobeAEMPersistedQuery = this.resolvePersistedQuery(requestContext, serviceDefinition);

        const paramMap = {
            [AdobeAEMDatasourcePathParams.path]: persistedQuery.graphqlPath,
        };

        const body = variables && Object.keys(variables).length > 0 ? { variables } : undefined;

        try {
            result = await this.execute(requestContext, serviceDefinition, undefined, {}, paramMap, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error executing persisted query [${serviceDefinition.id}]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    protected resolvePersistedQuery(requestContext: RequestContext, serviceDefinition: RestDatasourceServiceDefinition): AdobeAEMPersistedQuery {
        const methodname = `${AdobeAEMBaseDatasource.name}.resolvePersistedQuery`;

        const { id } = serviceDefinition;


        const { consumer, language } = requestContext;

        if (!this.consumerPersistedQueries[consumer]) {
            this.consumerPersistedQueries[consumer] = {};
        }

        if (!this.consumerPersistedQueries[consumer][id]) {
            const { configuration, aemAppId, aemSiteId } = this.getPluginConsumerConfiguration<AdobeAEMConsumerConfiguration>(requestContext);

            const { persistedQueries } = configuration;

            const persistedQuery: AdobeAEMPersistedQuery = persistedQueries[id];

            this.consumerPersistedQueries[consumer][id] = {
                graphqlPath: persistedQuery?.graphqlPath?.replace(AdobeAEMDatasourcePathParams.appId, aemAppId).replace(AdobeAEMDatasourcePathParams.siteId, aemSiteId).replace(AdobeAEMDatasourcePathParams.language, language),
                contentFragmentPath: persistedQuery?.contentFragmentPath?.replace(AdobeAEMDatasourcePathParams.appId, aemAppId).replace(AdobeAEMDatasourcePathParams.siteId, aemSiteId).replace(AdobeAEMDatasourcePathParams.language, language),
            };
        }

        if (StringUtility.isStringEmpty(this.consumerPersistedQueries[consumer][id]?.graphqlPath)) {
            this.logger.info(`${methodname} - WARNING: AEM Persisted query path not found for service: ${id}`, requestContext);
        }

        return this.consumerPersistedQueries[consumer][id];
    }
}
