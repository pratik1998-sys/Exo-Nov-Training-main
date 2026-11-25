import { RequestContext } from "@context/request";
import { HttpMethods, RestDatasourceServiceDefinition, RestDatasourceServiceDefinitions } from "@plugin-datasource-rest";
import { HCLCommerceBaseDatasourcePathParams, HCLCommerceBaseRestDatasource } from "@plugin-hcl-commerce/common";
import { addPersonContact, deletePersonContact, findPersonContactById, findPersonContactByNickName, getAllPersonContact, updatePersonContact } from "./schema/hcl-commerce.address.schema";

const HCLCommerceAddressDatasourcePathParams = {
    ...HCLCommerceBaseDatasourcePathParams,
    addressId: '{addressId}',
    nickName: '{nickName}',
};

export interface HCLCommerceAddressServiceDefinitions extends RestDatasourceServiceDefinitions {
    getAllPersonContact: RestDatasourceServiceDefinition;
    addPersonContact: RestDatasourceServiceDefinition;
    findPersonContactById: RestDatasourceServiceDefinition;
    findPersonContactByNickName: RestDatasourceServiceDefinition;
    updatePersonContact: RestDatasourceServiceDefinition;
    deletePersonContact: RestDatasourceServiceDefinition;
}


export class HCLCommerceAddressDatasource extends HCLCommerceBaseRestDatasource {
    protected serviceDefinitions: HCLCommerceAddressServiceDefinitions = {
        getAllPersonContact: {
            id: 'getAllPersonContact',
            method: HttpMethods.get,
            path: `/store/${HCLCommerceAddressDatasourcePathParams.storeId}/person/@self/contact`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        addPersonContact: {
            id: 'addPersonContact',
            method: HttpMethods.post,
            path: `/store/${HCLCommerceAddressDatasourcePathParams.storeId}/person/@self/contact`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        findPersonContactById: {
            id: 'findPersonContactById',
            method: HttpMethods.get,
            path: `/store/${HCLCommerceAddressDatasourcePathParams.storeId}/person/@self/contact/byAddressId/${HCLCommerceAddressDatasourcePathParams.addressId}`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        findPersonContactByNickName: {
            id: 'findPersonContactByNickName',
            method: HttpMethods.get,
            path: `/store/${HCLCommerceAddressDatasourcePathParams.storeId}/person/@self/contact/${HCLCommerceAddressDatasourcePathParams.nickName}`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        updatePersonContact: {
            id: 'updatePersonContact',
            method: HttpMethods.put,
            path: `/store/${HCLCommerceAddressDatasourcePathParams.storeId}/person/@self/contact/${HCLCommerceAddressDatasourcePathParams.nickName}`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        deletePersonContact: {
            id: 'deletePersonContact',
            method: HttpMethods.delete,
            path: `/store/${HCLCommerceAddressDatasourcePathParams.storeId}/person/@self/contact/${HCLCommerceAddressDatasourcePathParams.nickName}`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
    };

    async getAllPersonContact(
        requestContext: RequestContext,
        queryParams?: getAllPersonContact.Query,
        headers?: getAllPersonContact.Header,
    ): Promise<getAllPersonContact.Response._200 | getAllPersonContact.Response._400 | getAllPersonContact.Response._401 | getAllPersonContact.Response._403 | getAllPersonContact.Response._500> {
        const methodname: string = `${HCLCommerceAddressDatasource.name}.getAllPersonContact`;

        let result: getAllPersonContact.Response._200 | getAllPersonContact.Response._400 | getAllPersonContact.Response._401 | getAllPersonContact.Response._403 | getAllPersonContact.Response._500 =
            null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.getAllPersonContact, queryParams, headers, {});
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [getAllPersonContact]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async addPersonContact(
        requestContext: RequestContext,
        body: addPersonContact.Body,
        queryParams?: addPersonContact.Query,
        headers?: addPersonContact.Header,
    ): Promise<
        | addPersonContact.Response._200
        | addPersonContact.Response._201
        | addPersonContact.Response._400
        | addPersonContact.Response._401
        | addPersonContact.Response._403
        | addPersonContact.Response._500
    > {
        const methodname: string = `${HCLCommerceAddressDatasource.name}.addPersonContact`;

        let result:
            | addPersonContact.Response._200
            | addPersonContact.Response._201
            | addPersonContact.Response._400
            | addPersonContact.Response._401
            | addPersonContact.Response._403
            | addPersonContact.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.addPersonContact, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [addPersonContact]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async findPersonContactById(
        requestContext: RequestContext,
        addressId: string,
        queryParams?: findPersonContactById.Query,
        headers?: findPersonContactById.Header,
    ): Promise<
        | findPersonContactById.Response._200
        | findPersonContactById.Response._400
        | findPersonContactById.Response._401
        | findPersonContactById.Response._403
        | findPersonContactById.Response._404
        | findPersonContactById.Response._500
    > {
        const methodname: string = `${HCLCommerceAddressDatasource.name}.findPersonContactById`;

        let result:
            | findPersonContactById.Response._200
            | findPersonContactById.Response._400
            | findPersonContactById.Response._401
            | findPersonContactById.Response._403
            | findPersonContactById.Response._404
            | findPersonContactById.Response._500 = null;

        let paramMap = {
            [HCLCommerceAddressDatasourcePathParams.addressId]: addressId,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.findPersonContactById, queryParams, headers, paramMap);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [findPersonContactById] - id: ${addressId}: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async findPersonContactByNickName(
        requestContext: RequestContext,
        nickName: string,
        queryParams?: findPersonContactByNickName.Query,
        headers?: findPersonContactByNickName.Header,
    ): Promise<
        | findPersonContactByNickName.Response._200
        | findPersonContactByNickName.Response._400
        | findPersonContactByNickName.Response._401
        | findPersonContactByNickName.Response._403
        | findPersonContactByNickName.Response._404
        | findPersonContactByNickName.Response._500
    > {
        const methodname: string = `${HCLCommerceAddressDatasource.name}.findPersonContactByNickName`;

        let result:
            | findPersonContactByNickName.Response._200
            | findPersonContactByNickName.Response._400
            | findPersonContactByNickName.Response._401
            | findPersonContactByNickName.Response._403
            | findPersonContactByNickName.Response._404
            | findPersonContactByNickName.Response._500 = null;

        let paramMap = {
            [HCLCommerceAddressDatasourcePathParams.nickName]: nickName,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.findPersonContactByNickName, queryParams, headers, paramMap);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [findPersonContactByNickName]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async updatePersonContact(
        requestContext: RequestContext,
        nickName: string,
        body: updatePersonContact.Body,
        queryParams?: updatePersonContact.Query,
        headers?: updatePersonContact.Header,
    ): Promise<
        | updatePersonContact.Response._200
        | updatePersonContact.Response._400
        | updatePersonContact.Response._401
        | updatePersonContact.Response._403
        | updatePersonContact.Response._404
        | updatePersonContact.Response._500
    > {
        const methodname: string = `${HCLCommerceAddressDatasource.name}.updatePersonContact`;

        let result:
            | updatePersonContact.Response._200
            | updatePersonContact.Response._400
            | updatePersonContact.Response._401
            | updatePersonContact.Response._403
            | updatePersonContact.Response._404
            | updatePersonContact.Response._500 = null;

        let paramMap = {
            [HCLCommerceAddressDatasourcePathParams.nickName]: nickName,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.updatePersonContact, queryParams, headers, paramMap, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [updatePersonContact]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async deletePersonContact(
        requestContext: RequestContext,
        nickName: string,
        body?: deletePersonContact.Body,
        queryParams?: deletePersonContact.Query,
        headers?: deletePersonContact.Header,
    ): Promise<
        | deletePersonContact.Response._200
        | deletePersonContact.Response._400
        | deletePersonContact.Response._401
        | deletePersonContact.Response._403
        | deletePersonContact.Response._404
        | deletePersonContact.Response._500
    > {
        const methodname: string = `${HCLCommerceAddressDatasource.name}.deletePersonContact`;

        let result:
            | deletePersonContact.Response._200
            | deletePersonContact.Response._400
            | deletePersonContact.Response._401
            | deletePersonContact.Response._403
            | deletePersonContact.Response._404
            | deletePersonContact.Response._500 = null;

        let paramMap = {
            [HCLCommerceAddressDatasourcePathParams.nickName]: nickName,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.deletePersonContact, queryParams, headers, paramMap, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [deletePersonContact]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }
}
