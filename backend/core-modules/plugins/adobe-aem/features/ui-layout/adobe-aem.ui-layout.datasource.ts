import { RequestContext } from "@context/request";
import { AdobeAEMBaseDatasource } from "@plugin-adobe-aem/common";
import { HttpMethods, RestDatasourceServiceDefinition, RestDatasourceServiceDefinitions } from "@plugin-datasource-rest";

const params = {
    id: ':id',
    path: ':path',
};

export interface AdobeAEMUILayoutServiceDefinitions extends RestDatasourceServiceDefinitions {
    getLayoutById: RestDatasourceServiceDefinition;
}

export class AdobeAEMUILayoutDatasource extends AdobeAEMBaseDatasource {
    protected serviceDefinitions: AdobeAEMUILayoutServiceDefinitions = {
        getLayoutById: {
            id: 'getLayoutById',
            method: HttpMethods.get,
            path: `${params.path}/${params.id}.model.json`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
    };

    async getLayoutById(requestContext: RequestContext, path: string, id: string) {
        const methodname = `${AdobeAEMUILayoutDatasource.name}.getLayoutById`;

        const serviceDefinition = this.serviceDefinitions.getLayoutById;

        let result = null;

        const paramMap = {
            [params.id]: id,
            [params.path]: path,
        };

        try {
            result = await this.execute(requestContext, serviceDefinition, {}, {}, paramMap);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching layout with id ${id}`, requestContext);
            throw error;
        }

        return result;
    }
}
