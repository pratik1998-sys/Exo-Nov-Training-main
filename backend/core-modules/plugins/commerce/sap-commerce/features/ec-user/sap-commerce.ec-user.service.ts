import { RequestContext } from "@context/request";
import { ECAuthenticate, ECAuthenticateService } from "@feature-commerce/ec-authenticate";
import { ECUserService, ECUserCreateInput, ECUserCreate, ECUser, ECUserErrors, ECUserInput } from "@feature-commerce/ec-user";
import { CreateUser, GetUser, SAPCommerceBaseServiceImpl } from "@plugin-sap-commerce/common";
import { SAPCommerceECUserDatasource } from "./sap-commerce.ec-user.datasource";
import { SAPCommerceECUserMapper } from "./sap-commerce.ec-user.mapper";

export class SAPCommerceECUserServiceImpl extends SAPCommerceBaseServiceImpl implements ECUserService {
    async createUser(customerInput: ECUserCreateInput, cartId: string, requestContext: RequestContext, context?: any): Promise<ECUserCreate> {
        const methodname: string = `${SAPCommerceECUserServiceImpl.name}.createUser`;

        let dsCustomer: CreateUser.Response._201 = null;

        try {
            dsCustomer = await this.getECUserDatasource(requestContext).createUser(requestContext, customerInput);
        } catch (error) {
            this.logger.info(`${methodname} - Error creating user: ${this.logger.formatJSON(error)}`);
            throw ECUserErrors.createUserFailed();
        }

        let authentication: ECAuthenticate = null;

        if (dsCustomer) {
            authentication = await this.getService<ECAuthenticateService>(requestContext, ECAuthenticateService).authenticate(
                customerInput.username,
                customerInput.password,
                false,
                false,
                null,
                requestContext,
                context,
            );
        }

        const customer = this.getECUserMapper(requestContext).mapUser(requestContext, dsCustomer) as ECUserCreate;

        customer.authenticate = authentication;

        return customer;
    }

    async updateUser(identifier: string, customer: ECUserInput, requestContext: RequestContext, context?: any): Promise<ECUser> {
        throw new Error("Method not implemented.");
    }

    async getUser(identifier: string, requestContext: RequestContext, context?: any): Promise<ECUser> {
        const methodname: string = `${SAPCommerceECUserServiceImpl.name}.getUser`;

        let dsUser: GetUser.Response._200 = null;

        try {
            dsUser = await this.getECUserDatasource(requestContext).getUser(requestContext);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching user: ${this.logger.formatJSON(error)}`);
            throw ECUserErrors.getUserFailed();
        }

        return this.getECUserMapper(requestContext).mapUser(requestContext, dsUser);
    }

    protected getECUserDatasource(requestContext: RequestContext) {
        return this.getDatasource<SAPCommerceECUserDatasource>(requestContext, SAPCommerceECUserDatasource);
    }

    protected getECUserMapper(requestContext: RequestContext) {
        return this.getMapper<SAPCommerceECUserMapper>(requestContext, SAPCommerceECUserMapper);
    }

    getTokenPurseId(requestContext: RequestContext): string {
        return this.getPluginTokenId(requestContext);
    }
}
