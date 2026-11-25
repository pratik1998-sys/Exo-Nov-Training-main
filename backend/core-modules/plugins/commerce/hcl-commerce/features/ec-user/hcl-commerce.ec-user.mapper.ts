import { RequestContext } from "@context/request";
import { ECAuthenticate } from "@feature-commerce/ec-authenticate";
import { ECUser, ECUserCreate } from "@feature-commerce/ec-user";
import { HCLCommerceBaseMapper } from "@plugin-hcl-commerce/common";
import { findPersonBySelf } from "@plugin-hcl-commerce/features/ec-user/schema/hcl-commerce.ec-user.schema";

export class HCLCommerceECUserMapper extends HCLCommerceBaseMapper {
    mapECUser(requestContext: RequestContext, dsUser: findPersonBySelf.Response._200): ECUser {
        const user: ECUser =
            dsUser ?
                {
                    id: dsUser.userId,
                    identifier: dsUser.userId,
                    username: dsUser.logonId,
                    firstName: dsUser.firstName,
                    middleName: dsUser.middleName,
                    lastName: dsUser.lastName,
                    dateOfBirth: dsUser.dateOfBirth,
                    isMarketingOptIn: true,
                    email: dsUser.email1,
                    phone: dsUser.phone1,
                }
                : {};

        return user;
    }

    mapECUserCreate(requestContext: RequestContext, dsUser: any, authentication: ECAuthenticate): ECUserCreate {
        const user: ECUserCreate = this.mapECUser(requestContext, dsUser) as ECUserCreate;

        user.authenticate = authentication;

        return user;
    }
}
