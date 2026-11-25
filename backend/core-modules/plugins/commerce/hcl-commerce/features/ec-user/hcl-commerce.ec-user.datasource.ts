import { RequestContext } from "@context/request";
import {
    resetPasswordByAdmin,
    deleteContextAttributeForPerson,
    findByQuery,
    registerPersonOnUserRegistrationAdminAdd,
    findByUserIdWRolesOfUserInOrgsICanAdminProfileName,
    updatePersonByAdmin,
    performActionByAdmin,
    deletePersonByAdmin,
    getCheckoutProfile,
    updateCheckoutProfile,
    createCheckoutProfile,
    updateCheckoutProfileById,
    getByIdCheckoutProfile,
    deleteCheckoutProfile,
    updateMemberUser,
    findPersonBySelf,
    updatePersonOnUserRegistrationUpdate,
    findPersonNameBySelf,
    activeUser,
    resendActiveUser,
    changeLanguageCurrency,
    findOptOutBySelfWOptOutAllProfileName,
} from './schema/hcl-commerce.ec-user.schema';
import { HCLCommerceBaseRestDatasource } from "@plugin-hcl-commerce/common";
import { RestDatasourceServiceDefinitions, HttpMethods, RestDatasourceServiceDefinition } from "@plugin-datasource-rest";

const HCLCommerceECUserDatasourcePathParams = {
    storeId: '{storeId}',
    attributeName: '{attributeName}',
    value: '{value}',
    userId: '{userId}',
    checkoutProfileId: '{checkoutProfileId}',
    nickName: '{nickName}',
};

export interface HCLCommerceECUserServiceDefinitions extends RestDatasourceServiceDefinitions {
    resetPasswordByAdmin: RestDatasourceServiceDefinition;
    deleteContextAttributeForPerson: RestDatasourceServiceDefinition;
    findByQuery: RestDatasourceServiceDefinition;
    registerPersonOnUserRegistrationAdminAdd: RestDatasourceServiceDefinition;
    findByUserIdWRolesOfUserInOrgsICanAdminProfileName: RestDatasourceServiceDefinition;
    updatePersonByAdmin: RestDatasourceServiceDefinition;
    performActionByAdmin: RestDatasourceServiceDefinition;
    deletePersonByAdmin: RestDatasourceServiceDefinition;
    getCheckoutProfile: RestDatasourceServiceDefinition;
    updateCheckoutProfile: RestDatasourceServiceDefinition;
    createCheckoutProfile: RestDatasourceServiceDefinition;
    updateCheckoutProfileById: RestDatasourceServiceDefinition;
    getByIdCheckoutProfile: RestDatasourceServiceDefinition;
    deleteCheckoutProfile: RestDatasourceServiceDefinition;
    updateMemberUser: RestDatasourceServiceDefinition;
    findPersonBySelf: RestDatasourceServiceDefinition;
    updatePersonOnUserRegistrationUpdate: RestDatasourceServiceDefinition;
    findPersonNameBySelf: RestDatasourceServiceDefinition;
    activeUser: RestDatasourceServiceDefinition;
    resendActiveUser: RestDatasourceServiceDefinition;
    changeLanguageCurrency: RestDatasourceServiceDefinition;
    findOptOutBySelfWOptOutAllProfileName: RestDatasourceServiceDefinition;
}


export class HCLCommerceECUserDatasource extends HCLCommerceBaseRestDatasource {
    protected serviceDefinitions: HCLCommerceECUserServiceDefinitions = {
        resetPasswordByAdmin: {
            id: 'resetPasswordByAdmin',
            method: HttpMethods.post,
            path: `/store/${HCLCommerceECUserDatasourcePathParams.storeId}/person/updateMemberPassword`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        deleteContextAttributeForPerson: {
            id: 'deleteContextAttributeForPerson',
            method: HttpMethods.delete,
            path: `/store/${HCLCommerceECUserDatasourcePathParams.storeId}/person/@self/contextattributes/${HCLCommerceECUserDatasourcePathParams.attributeName}/${HCLCommerceECUserDatasourcePathParams.value}`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        findByQuery: {
            id: 'findByQuery',
            method: HttpMethods.get,
            path: `/store/${HCLCommerceECUserDatasourcePathParams.storeId}/person`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        registerPersonOnUserRegistrationAdminAdd: {
            id: 'registerPersonOnUserRegistrationAdminAdd',
            method: HttpMethods.post,
            path: `/store/${HCLCommerceECUserDatasourcePathParams.storeId}/person`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        findByUserIdWRolesOfUserInOrgsICanAdminProfileName: {
            id: 'findByUserIdWRolesOfUserInOrgsICanAdminProfileName',
            method: HttpMethods.get,
            path: `/store/${HCLCommerceECUserDatasourcePathParams.storeId}/person/${HCLCommerceECUserDatasourcePathParams.userId}`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        updatePersonByAdmin: {
            id: 'updatePersonByAdmin',
            method: HttpMethods.put,
            path: `/store/${HCLCommerceECUserDatasourcePathParams.storeId}/person/${HCLCommerceECUserDatasourcePathParams.userId}`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        performActionByAdmin: {
            id: 'performActionByAdmin',
            method: HttpMethods.post,
            path: `/store/${HCLCommerceECUserDatasourcePathParams.storeId}/person/${HCLCommerceECUserDatasourcePathParams.userId}`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        deletePersonByAdmin: {
            id: 'deletePersonByAdmin',
            method: HttpMethods.delete,
            path: `/store/${HCLCommerceECUserDatasourcePathParams.storeId}/person/${HCLCommerceECUserDatasourcePathParams.userId}`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        getCheckoutProfile: {
            id: 'getCheckoutProfile',
            method: HttpMethods.get,
            path: `/store/${HCLCommerceECUserDatasourcePathParams.storeId}/person/@self/checkoutProfile`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        updateCheckoutProfile: {
            id: 'updateCheckoutProfile',
            method: HttpMethods.put,
            path: `/store/${HCLCommerceECUserDatasourcePathParams.storeId}/person/@self/checkoutProfile`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        createCheckoutProfile: {
            id: 'createCheckoutProfile',
            method: HttpMethods.post,
            path: `/store/${HCLCommerceECUserDatasourcePathParams.storeId}/person/@self/checkoutProfile`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        updateCheckoutProfileById: {
            id: 'updateCheckoutProfileById',
            method: HttpMethods.put,
            path: `/store/${HCLCommerceECUserDatasourcePathParams.storeId}/person/checkoutProfile/${HCLCommerceECUserDatasourcePathParams.checkoutProfileId}`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        getByIdCheckoutProfile: {
            id: 'getByIdCheckoutProfile',
            method: HttpMethods.get,
            path: `/store/${HCLCommerceECUserDatasourcePathParams.storeId}/person/checkoutProfile/${HCLCommerceECUserDatasourcePathParams.checkoutProfileId}`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        deleteCheckoutProfile: {
            id: 'deleteCheckoutProfile',
            method: HttpMethods.delete,
            path: `/store/${HCLCommerceECUserDatasourcePathParams.storeId}/person/checkoutProfile/${HCLCommerceECUserDatasourcePathParams.checkoutProfileId}`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        updateMemberUser: {
            id: 'updateMemberUser',
            method: HttpMethods.post,
            path: `/store/${HCLCommerceECUserDatasourcePathParams.storeId}/person/updateMemberUser/${HCLCommerceECUserDatasourcePathParams.userId}`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        findPersonBySelf: {
            id: 'findPersonBySelf',
            method: HttpMethods.get,
            path: `/store/${HCLCommerceECUserDatasourcePathParams.storeId}/person/@self`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        updatePersonOnUserRegistrationUpdate: {
            id: 'updatePersonOnUserRegistrationUpdate',
            method: HttpMethods.put,
            path: `/store/${HCLCommerceECUserDatasourcePathParams.storeId}/person/@self`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        findPersonNameBySelf: {
            id: 'findPersonNameBySelf',
            method: HttpMethods.get,
            path: `/store/${HCLCommerceECUserDatasourcePathParams.storeId}/person/@self/name`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        activeUser: {
            id: 'activeUser',
            method: HttpMethods.put,
            path: `/store/${HCLCommerceECUserDatasourcePathParams.storeId}/useractivate/emailactivate`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        resendActiveUser: {
            id: 'resendActiveUser',
            method: HttpMethods.post,
            path: `/store/${HCLCommerceECUserDatasourcePathParams.storeId}/useractivate/resendemail`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        changeLanguageCurrency: {
            id: 'changeLanguageCurrency',
            method: HttpMethods.put,
            path: `/store/${HCLCommerceECUserDatasourcePathParams.storeId}/person/@self/languageCurrency`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        findOptOutBySelfWOptOutAllProfileName: {
            id: 'findOptOutBySelfWOptOutAllProfileName',
            method: HttpMethods.get,
            path: `/store/${HCLCommerceECUserDatasourcePathParams.storeId}/person/@self/optOut`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
    };

    async resetPasswordByAdmin(
        requestContext: RequestContext,
        body: resetPasswordByAdmin.Body,
        queryParams?: resetPasswordByAdmin.Query,
        headers?: resetPasswordByAdmin.Header,
    ): Promise<resetPasswordByAdmin.Response._200 | resetPasswordByAdmin.Response._400 | resetPasswordByAdmin.Response._401 | resetPasswordByAdmin.Response._403 | resetPasswordByAdmin.Response._500> {
        const methodname: string = `${HCLCommerceECUserDatasource.name}.resetPasswordByAdmin`;

        let result:
            | resetPasswordByAdmin.Response._200
            | resetPasswordByAdmin.Response._400
            | resetPasswordByAdmin.Response._401
            | resetPasswordByAdmin.Response._403
            | resetPasswordByAdmin.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.resetPasswordByAdmin, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [resetPasswordByAdmin]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async deleteContextAttributeForPerson(
        requestContext: RequestContext,
        attributeName: string,
        value: string,
        body?: deleteContextAttributeForPerson.Body,
        queryParams?: deleteContextAttributeForPerson.Query,
        headers?: deleteContextAttributeForPerson.Header,
    ): Promise<
        | deleteContextAttributeForPerson.Response._200
        | deleteContextAttributeForPerson.Response._400
        | deleteContextAttributeForPerson.Response._401
        | deleteContextAttributeForPerson.Response._403
        | deleteContextAttributeForPerson.Response._500
    > {
        const methodname: string = `${HCLCommerceECUserDatasource.name}.deleteContextAttributeForPerson`;

        let result:
            | deleteContextAttributeForPerson.Response._200
            | deleteContextAttributeForPerson.Response._400
            | deleteContextAttributeForPerson.Response._401
            | deleteContextAttributeForPerson.Response._403
            | deleteContextAttributeForPerson.Response._500 = null;

        let paramMap = {
            [HCLCommerceECUserDatasourcePathParams.attributeName]: attributeName,
            [HCLCommerceECUserDatasourcePathParams.value]: value,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.deleteContextAttributeForPerson, queryParams, headers, paramMap, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [deleteContextAttributeForPerson]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async findByQuery(
        requestContext: RequestContext,
        queryParams?: findByQuery.Query,
        headers?: findByQuery.Header,
    ): Promise<findByQuery.Response._200 | findByQuery.Response._400 | findByQuery.Response._401 | findByQuery.Response._403 | findByQuery.Response._500> {
        const methodname: string = `${HCLCommerceECUserDatasource.name}.findByQuery`;

        let result: findByQuery.Response._200 | findByQuery.Response._400 | findByQuery.Response._401 | findByQuery.Response._403 | findByQuery.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.findByQuery, queryParams, headers, {});
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [findByQuery]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async registerPersonOnUserRegistrationAdminAdd(
        requestContext: RequestContext,
        body: registerPersonOnUserRegistrationAdminAdd.Body,
        queryParams?: registerPersonOnUserRegistrationAdminAdd.Query,
        headers?: registerPersonOnUserRegistrationAdminAdd.Header,
    ): Promise<
        | registerPersonOnUserRegistrationAdminAdd.Response._201
        | registerPersonOnUserRegistrationAdminAdd.Response._400
        | registerPersonOnUserRegistrationAdminAdd.Response._401
        | registerPersonOnUserRegistrationAdminAdd.Response._403
        | registerPersonOnUserRegistrationAdminAdd.Response._500
    > {
        const methodname: string = `${HCLCommerceECUserDatasource.name}.registerPersonOnUserRegistrationAdminAdd`;

        let result:
            | registerPersonOnUserRegistrationAdminAdd.Response._201
            | registerPersonOnUserRegistrationAdminAdd.Response._400
            | registerPersonOnUserRegistrationAdminAdd.Response._401
            | registerPersonOnUserRegistrationAdminAdd.Response._403
            | registerPersonOnUserRegistrationAdminAdd.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.registerPersonOnUserRegistrationAdminAdd, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [registerPersonOnUserRegistrationAdminAdd]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async findByUserIdWRolesOfUserInOrgsICanAdminProfileName(
        requestContext: RequestContext,
        userId: string,
        queryParams?: findByUserIdWRolesOfUserInOrgsICanAdminProfileName.Query,
        headers?: findByUserIdWRolesOfUserInOrgsICanAdminProfileName.Header,
    ): Promise<
        | findByUserIdWRolesOfUserInOrgsICanAdminProfileName.Response._200
        | findByUserIdWRolesOfUserInOrgsICanAdminProfileName.Response._400
        | findByUserIdWRolesOfUserInOrgsICanAdminProfileName.Response._401
        | findByUserIdWRolesOfUserInOrgsICanAdminProfileName.Response._403
        | findByUserIdWRolesOfUserInOrgsICanAdminProfileName.Response._500
    > {
        const methodname: string = `${HCLCommerceECUserDatasource.name}.findByUserIdWRolesOfUserInOrgsICanAdminProfileName`;

        let result:
            | findByUserIdWRolesOfUserInOrgsICanAdminProfileName.Response._200
            | findByUserIdWRolesOfUserInOrgsICanAdminProfileName.Response._400
            | findByUserIdWRolesOfUserInOrgsICanAdminProfileName.Response._401
            | findByUserIdWRolesOfUserInOrgsICanAdminProfileName.Response._403
            | findByUserIdWRolesOfUserInOrgsICanAdminProfileName.Response._500 = null;

        let paramMap = {
            [HCLCommerceECUserDatasourcePathParams.userId]: userId,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.findByUserIdWRolesOfUserInOrgsICanAdminProfileName, queryParams, headers, paramMap);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [findByUserIdWRolesOfUserInOrgsICanAdminProfileName]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async updatePersonByAdmin(
        requestContext: RequestContext,
        userId: string,
        body: updatePersonByAdmin.Body,
        queryParams?: updatePersonByAdmin.Query,
        headers?: updatePersonByAdmin.Header,
    ): Promise<updatePersonByAdmin.Response._200 | updatePersonByAdmin.Response._400 | updatePersonByAdmin.Response._401 | updatePersonByAdmin.Response._403 | updatePersonByAdmin.Response._500> {
        const methodname: string = `${HCLCommerceECUserDatasource.name}.updatePersonByAdmin`;

        let result: updatePersonByAdmin.Response._200 | updatePersonByAdmin.Response._400 | updatePersonByAdmin.Response._401 | updatePersonByAdmin.Response._403 | updatePersonByAdmin.Response._500 =
            null;

        let paramMap = {
            [HCLCommerceECUserDatasourcePathParams.userId]: userId,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.updatePersonByAdmin, queryParams, headers, paramMap, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [updatePersonByAdmin]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async performActionByAdmin(
        requestContext: RequestContext,
        userId: string,
        body: performActionByAdmin.Body,
        queryParams?: performActionByAdmin.Query,
        headers?: performActionByAdmin.Header,
    ): Promise<performActionByAdmin.Response._200 | performActionByAdmin.Response._400 | performActionByAdmin.Response._401 | performActionByAdmin.Response._403 | performActionByAdmin.Response._500> {
        const methodname: string = `${HCLCommerceECUserDatasource.name}.performActionByAdmin`;

        let result:
            | performActionByAdmin.Response._200
            | performActionByAdmin.Response._400
            | performActionByAdmin.Response._401
            | performActionByAdmin.Response._403
            | performActionByAdmin.Response._500 = null;

        let paramMap = {
            [HCLCommerceECUserDatasourcePathParams.userId]: userId,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.performActionByAdmin, queryParams, headers, paramMap, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [performActionByAdmin]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async deletePersonByAdmin(
        requestContext: RequestContext,
        userId: string,
        body?: deletePersonByAdmin.Body,
        queryParams?: deletePersonByAdmin.Query,
        headers?: deletePersonByAdmin.Header,
    ): Promise<deletePersonByAdmin.Response._200 | deletePersonByAdmin.Response._400 | deletePersonByAdmin.Response._401 | deletePersonByAdmin.Response._403 | deletePersonByAdmin.Response._500> {
        const methodname: string = `${HCLCommerceECUserDatasource.name}.deletePersonByAdmin`;

        let result: deletePersonByAdmin.Response._200 | deletePersonByAdmin.Response._400 | deletePersonByAdmin.Response._401 | deletePersonByAdmin.Response._403 | deletePersonByAdmin.Response._500 =
            null;

        let paramMap = {
            [HCLCommerceECUserDatasourcePathParams.userId]: userId,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.deletePersonByAdmin, queryParams, headers, paramMap, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [deletePersonByAdmin]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async getCheckoutProfile(
        requestContext: RequestContext,
        queryParams?: getCheckoutProfile.Query,
        headers?: getCheckoutProfile.Header,
    ): Promise<
        | getCheckoutProfile.Response._200
        | getCheckoutProfile.Response._400
        | getCheckoutProfile.Response._401
        | getCheckoutProfile.Response._403
        | getCheckoutProfile.Response._404
        | getCheckoutProfile.Response._500
    > {
        const methodname: string = `${HCLCommerceECUserDatasource.name}.getCheckoutProfile`;

        let result:
            | getCheckoutProfile.Response._200
            | getCheckoutProfile.Response._400
            | getCheckoutProfile.Response._401
            | getCheckoutProfile.Response._403
            | getCheckoutProfile.Response._404
            | getCheckoutProfile.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.getCheckoutProfile, queryParams, headers, {});
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [getCheckoutProfile]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async updateCheckoutProfile(
        requestContext: RequestContext,
        body: updateCheckoutProfile.Body,
        queryParams?: updateCheckoutProfile.Query,
        headers?: updateCheckoutProfile.Header,
    ): Promise<
        | updateCheckoutProfile.Response._200
        | updateCheckoutProfile.Response._400
        | updateCheckoutProfile.Response._401
        | updateCheckoutProfile.Response._403
        | updateCheckoutProfile.Response._404
        | updateCheckoutProfile.Response._500
    > {
        const methodname: string = `${HCLCommerceECUserDatasource.name}.updateCheckoutProfile`;

        let result:
            | updateCheckoutProfile.Response._200
            | updateCheckoutProfile.Response._400
            | updateCheckoutProfile.Response._401
            | updateCheckoutProfile.Response._403
            | updateCheckoutProfile.Response._404
            | updateCheckoutProfile.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.updateCheckoutProfile, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [updateCheckoutProfile]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async createCheckoutProfile(
        requestContext: RequestContext,
        body: createCheckoutProfile.Body,
        queryParams?: createCheckoutProfile.Query,
        headers?: createCheckoutProfile.Header,
    ): Promise<
        | createCheckoutProfile.Response._201
        | createCheckoutProfile.Response._400
        | createCheckoutProfile.Response._401
        | createCheckoutProfile.Response._403
        | createCheckoutProfile.Response._404
        | createCheckoutProfile.Response._500
    > {
        const methodname: string = `${HCLCommerceECUserDatasource.name}.createCheckoutProfile`;

        let result:
            | createCheckoutProfile.Response._201
            | createCheckoutProfile.Response._400
            | createCheckoutProfile.Response._401
            | createCheckoutProfile.Response._403
            | createCheckoutProfile.Response._404
            | createCheckoutProfile.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.createCheckoutProfile, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [createCheckoutProfile]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async updateCheckoutProfileById(
        requestContext: RequestContext,
        checkoutProfileId: string,
        body: updateCheckoutProfileById.Body,
        queryParams?: updateCheckoutProfileById.Query,
        headers?: updateCheckoutProfileById.Header,
    ): Promise<
        | updateCheckoutProfileById.Response._200
        | updateCheckoutProfileById.Response._400
        | updateCheckoutProfileById.Response._401
        | updateCheckoutProfileById.Response._403
        | updateCheckoutProfileById.Response._404
        | updateCheckoutProfileById.Response._500
    > {
        const methodname: string = `${HCLCommerceECUserDatasource.name}.updateCheckoutProfileById`;

        let result:
            | updateCheckoutProfileById.Response._200
            | updateCheckoutProfileById.Response._400
            | updateCheckoutProfileById.Response._401
            | updateCheckoutProfileById.Response._403
            | updateCheckoutProfileById.Response._404
            | updateCheckoutProfileById.Response._500 = null;

        let paramMap = {
            [HCLCommerceECUserDatasourcePathParams.checkoutProfileId]: checkoutProfileId,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.updateCheckoutProfileById, queryParams, headers, paramMap, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [updateCheckoutProfileById]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async getByIdCheckoutProfile(
        requestContext: RequestContext,
        checkoutProfileId: string,
        queryParams?: getByIdCheckoutProfile.Query,
        headers?: getByIdCheckoutProfile.Header,
    ): Promise<
        | getByIdCheckoutProfile.Response._200
        | getByIdCheckoutProfile.Response._400
        | getByIdCheckoutProfile.Response._401
        | getByIdCheckoutProfile.Response._403
        | getByIdCheckoutProfile.Response._404
        | getByIdCheckoutProfile.Response._500
    > {
        const methodname: string = `${HCLCommerceECUserDatasource.name}.getByIdCheckoutProfile`;

        let result:
            | getByIdCheckoutProfile.Response._200
            | getByIdCheckoutProfile.Response._400
            | getByIdCheckoutProfile.Response._401
            | getByIdCheckoutProfile.Response._403
            | getByIdCheckoutProfile.Response._404
            | getByIdCheckoutProfile.Response._500 = null;

        let paramMap = {
            [HCLCommerceECUserDatasourcePathParams.checkoutProfileId]: checkoutProfileId,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.getByIdCheckoutProfile, queryParams, headers, paramMap);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [getByIdCheckoutProfile]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async deleteCheckoutProfile(
        requestContext: RequestContext,
        checkoutProfileId: string,
        body?: deleteCheckoutProfile.Body,
        queryParams?: deleteCheckoutProfile.Query,
        headers?: deleteCheckoutProfile.Header,
    ): Promise<
        | deleteCheckoutProfile.Response._204
        | deleteCheckoutProfile.Response._400
        | deleteCheckoutProfile.Response._401
        | deleteCheckoutProfile.Response._403
        | deleteCheckoutProfile.Response._404
        | deleteCheckoutProfile.Response._500
        | null
    > {
        const methodname: string = `${HCLCommerceECUserDatasource.name}.deleteCheckoutProfile`;

        let result:
            | deleteCheckoutProfile.Response._204
            | deleteCheckoutProfile.Response._400
            | deleteCheckoutProfile.Response._401
            | deleteCheckoutProfile.Response._403
            | deleteCheckoutProfile.Response._404
            | deleteCheckoutProfile.Response._500
            | null = null;

        let paramMap = {
            [HCLCommerceECUserDatasourcePathParams.checkoutProfileId]: checkoutProfileId,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.deleteCheckoutProfile, queryParams, headers, paramMap, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [deleteCheckoutProfile]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async updateMemberUser(
        requestContext: RequestContext,
        userId: string,
        body: updateMemberUser.Body,
        queryParams?: updateMemberUser.Query,
        headers?: updateMemberUser.Header,
    ): Promise<updateMemberUser.Response._200 | updateMemberUser.Response._400 | updateMemberUser.Response._401 | updateMemberUser.Response._403 | updateMemberUser.Response._500> {
        const methodname: string = `${HCLCommerceECUserDatasource.name}.updateMemberUser`;

        let result: updateMemberUser.Response._200 | updateMemberUser.Response._400 | updateMemberUser.Response._401 | updateMemberUser.Response._403 | updateMemberUser.Response._500 = null;

        let paramMap = {
            [HCLCommerceECUserDatasourcePathParams.userId]: userId,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.updateMemberUser, queryParams, headers, paramMap, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [updateMemberUser]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async findPersonBySelf(
        requestContext: RequestContext,
        queryParams?: findPersonBySelf.Query,
        headers?: findPersonBySelf.Header,
    ): Promise<findPersonBySelf.Response._200 | findPersonBySelf.Response._400 | findPersonBySelf.Response._401 | findPersonBySelf.Response._403 | findPersonBySelf.Response._500> {
        const methodname: string = `${HCLCommerceECUserDatasource.name}.findPersonBySelf`;

        let result: findPersonBySelf.Response._200 | findPersonBySelf.Response._400 | findPersonBySelf.Response._401 | findPersonBySelf.Response._403 | findPersonBySelf.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.findPersonBySelf, queryParams, headers, {});
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [findPersonBySelf]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async updatePersonOnUserRegistrationUpdate(
        requestContext: RequestContext,
        body: updatePersonOnUserRegistrationUpdate.Body,
        queryParams?: updatePersonOnUserRegistrationUpdate.Query,
        headers?: updatePersonOnUserRegistrationUpdate.Header,
    ): Promise<
        | updatePersonOnUserRegistrationUpdate.Response._200
        | updatePersonOnUserRegistrationUpdate.Response._400
        | updatePersonOnUserRegistrationUpdate.Response._401
        | updatePersonOnUserRegistrationUpdate.Response._403
        | updatePersonOnUserRegistrationUpdate.Response._500
    > {
        const methodname: string = `${HCLCommerceECUserDatasource.name}.updatePersonOnUserRegistrationUpdate`;

        let result:
            | updatePersonOnUserRegistrationUpdate.Response._200
            | updatePersonOnUserRegistrationUpdate.Response._400
            | updatePersonOnUserRegistrationUpdate.Response._401
            | updatePersonOnUserRegistrationUpdate.Response._403
            | updatePersonOnUserRegistrationUpdate.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.updatePersonOnUserRegistrationUpdate, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [updatePersonOnUserRegistrationUpdate]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async findPersonNameBySelf(
        requestContext: RequestContext,
        queryParams?: findPersonNameBySelf.Query,
        headers?: findPersonNameBySelf.Header,
    ): Promise<findPersonNameBySelf.Response._200 | findPersonNameBySelf.Response._400 | findPersonNameBySelf.Response._401 | findPersonNameBySelf.Response._403 | findPersonNameBySelf.Response._500> {
        const methodname: string = `${HCLCommerceECUserDatasource.name}.findPersonNameBySelf`;

        let result:
            | findPersonNameBySelf.Response._200
            | findPersonNameBySelf.Response._400
            | findPersonNameBySelf.Response._401
            | findPersonNameBySelf.Response._403
            | findPersonNameBySelf.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.findPersonNameBySelf, queryParams, headers, {});
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [findPersonNameBySelf]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async activeUser(
        requestContext: RequestContext,
        body: activeUser.Body,
        queryParams?: activeUser.Query,
        headers?: activeUser.Header,
    ): Promise<activeUser.Response._200 | activeUser.Response._400 | activeUser.Response._401 | activeUser.Response._403 | activeUser.Response._404 | activeUser.Response._500> {
        const methodname: string = `${HCLCommerceECUserDatasource.name}.activeUser`;

        let result: activeUser.Response._200 | activeUser.Response._400 | activeUser.Response._401 | activeUser.Response._403 | activeUser.Response._404 | activeUser.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.activeUser, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [activeUser]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async resendActiveUser(
        requestContext: RequestContext,
        body: resendActiveUser.Body,
        queryParams?: resendActiveUser.Query,
        headers?: resendActiveUser.Header,
    ): Promise<
        | resendActiveUser.Response._201
        | resendActiveUser.Response._400
        | resendActiveUser.Response._401
        | resendActiveUser.Response._403
        | resendActiveUser.Response._404
        | resendActiveUser.Response._500
    > {
        const methodname: string = `${HCLCommerceECUserDatasource.name}.resendActiveUser`;

        let result:
            | resendActiveUser.Response._201
            | resendActiveUser.Response._400
            | resendActiveUser.Response._401
            | resendActiveUser.Response._403
            | resendActiveUser.Response._404
            | resendActiveUser.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.resendActiveUser, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [resendActiveUser]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async changeLanguageCurrency(
        requestContext: RequestContext,
        body: changeLanguageCurrency.Body,
        queryParams?: changeLanguageCurrency.Query,
        headers?: changeLanguageCurrency.Header,
    ): Promise<
        changeLanguageCurrency.Response._200 | changeLanguageCurrency.Response._400 | changeLanguageCurrency.Response._401 | changeLanguageCurrency.Response._403 | changeLanguageCurrency.Response._500
    > {
        const methodname: string = `${HCLCommerceECUserDatasource.name}.changeLanguageCurrency`;

        let result:
            | changeLanguageCurrency.Response._200
            | changeLanguageCurrency.Response._400
            | changeLanguageCurrency.Response._401
            | changeLanguageCurrency.Response._403
            | changeLanguageCurrency.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.changeLanguageCurrency, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [changeLanguageCurrency]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async findOptOutBySelfWOptOutAllProfileName(
        requestContext: RequestContext,
        queryParams?: findOptOutBySelfWOptOutAllProfileName.Query,
        headers?: findOptOutBySelfWOptOutAllProfileName.Header,
    ): Promise<
        | findOptOutBySelfWOptOutAllProfileName.Response._200
        | findOptOutBySelfWOptOutAllProfileName.Response._400
        | findOptOutBySelfWOptOutAllProfileName.Response._401
        | findOptOutBySelfWOptOutAllProfileName.Response._403
        | findOptOutBySelfWOptOutAllProfileName.Response._500
    > {
        const methodname: string = `${HCLCommerceECUserDatasource.name}.findOptOutBySelfWOptOutAllProfileName`;

        let result:
            | findOptOutBySelfWOptOutAllProfileName.Response._200
            | findOptOutBySelfWOptOutAllProfileName.Response._400
            | findOptOutBySelfWOptOutAllProfileName.Response._401
            | findOptOutBySelfWOptOutAllProfileName.Response._403
            | findOptOutBySelfWOptOutAllProfileName.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.findOptOutBySelfWOptOutAllProfileName, queryParams, headers, {});
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [findOptOutBySelfWOptOutAllProfileName]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }
}
