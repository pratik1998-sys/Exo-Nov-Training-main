import { RequestContext } from "@context/request";
import { ECAuthenticateService } from "@feature-commerce/ec-authenticate";
import { ECUser, ECUserCreate, ECUserCreateInput, ECUserErrors, ECUserInput, ECUserService } from "@feature-commerce/ec-user";
import { HCLCommerceBaseServiceImpl } from "@plugin-hcl-commerce/common";
import { HCLCommerceECUserDatasource } from "./hcl-commerce.ec-user.datasource";
import { HCLCommerceECUserMapper } from "./hcl-commerce.ec-user.mapper";
import { findPersonBySelf, registerPersonOnUserRegistrationAdminAdd } from "./schema/hcl-commerce.ec-user.schema";
import { TokenUtility } from "@token/utilities";

export class HCLCommerceECUserServiceImpl extends HCLCommerceBaseServiceImpl implements ECUserService {
    async createUser(userInput: ECUserCreateInput, cartId: string, requestContext: RequestContext, context?: any): Promise<ECUserCreate> {
        const methodname = `${HCLCommerceECUserServiceImpl.name}.createUser`;

        const body: registerPersonOnUserRegistrationAdminAdd.Body = {
            logonId: userInput.username,
            logonPassword: userInput.password,
            firstName: userInput.firstName,
            middleName: userInput.middleName,
            lastName: userInput.lastName,
            dateOfBirth: userInput.dateOfBirth,
            gender: userInput.gender,
            marketingTrackingConsent: userInput.isMarketingOptIn ? 'true' : 'false',
            email1: userInput.email,
            phone1: userInput.phone,
        };

        try {
            await this.getDatasource<HCLCommerceECUserDatasource>(requestContext, HCLCommerceECUserDatasource).registerPersonOnUserRegistrationAdminAdd(requestContext, body, { mode: 'self' });
        } catch (error) {
            this.logger.info(`${methodname} - Error creating customer: ${this.logger.formatJSON(error)}`, requestContext);
            throw ECUserErrors.createUserFailed();
        }

        const authenticate = await this.getService<ECAuthenticateService>(requestContext, ECAuthenticateService).authenticate(
            userInput.username,
            userInput.password,
            false,
            true,
            cartId,
            requestContext,
            context,
        );

        requestContext.tokens = TokenUtility.decryptTokens(requestContext, authenticate.token);

        const userCreate: ECUserCreate = (await this.getUser(null, requestContext, context)) as ECUserCreate;

        userCreate.authenticate = authenticate;

        return userCreate;
    }

    async updateUser(identifier: string, customer: ECUserInput, requestContext: RequestContext, context?: any): Promise<ECUser> {
        throw new Error("Method not implemented.");
    }

    async getUser(identifier: string, requestContext: RequestContext, context?: any): Promise<ECUser> {
        const methodname = `${HCLCommerceECUserServiceImpl.name}.getUser`;

        let dsUser: findPersonBySelf.Response._200;

        try {
            dsUser = await this.getDatasource<HCLCommerceECUserDatasource>(requestContext, HCLCommerceECUserDatasource).findPersonBySelf(requestContext);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching user [${identifier}]: ${this.logger.formatJSON(error)}`, requestContext);
            throw ECUserErrors.getUserFailed();
        }

        return this.getMapper<HCLCommerceECUserMapper>(requestContext, HCLCommerceECUserMapper).mapECUser(requestContext, dsUser);
    }

    getTokenPurseId(requestContext: RequestContext): string {
        return this.getPluginTokenId(requestContext);
    }
}
