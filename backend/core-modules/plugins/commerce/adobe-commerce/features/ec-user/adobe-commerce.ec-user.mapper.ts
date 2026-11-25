import { RequestContext } from "@context/request";
import { ECAuthenticate } from "@feature-commerce/ec-authenticate";
import { ECUser, ECUserCreate } from "@feature-commerce/ec-user";
import { AdobeCommerceBaseMapper } from "@plugin-adobe-commerce/common";
import { AdobeCommerceCustomer } from "./schema/adobe-commerce.ec-user.schema";

export class AdobeCommerceECUserMapper extends AdobeCommerceBaseMapper {
    //TODO: Change from AdobeCommerceCreateECUserOutput to the offical AdobeCommerceCustomer
    mapECUser(requestContext: RequestContext, dsECUser: AdobeCommerceCustomer): ECUser {
        return dsECUser ?
            {
                username: dsECUser.email,
                firstName: dsECUser.firstname,
                middleName: dsECUser.middlename,
                lastName: dsECUser.lastname,
                email: dsECUser.email,
                phone: dsECUser.telephone,
                addresses:
                    dsECUser.addresses?.length > 0 ?
                        dsECUser.addresses.map((dsAddress) => {
                            return this.mapAddress(requestContext, dsAddress);
                        })
                        : [],
            }
            : {};
    }

    mapECUserCreate(requestContext: RequestContext, dsECUser: AdobeCommerceCustomer, authenticate: ECAuthenticate): ECUserCreate {
        const user: ECUserCreate = this.mapECUser(requestContext, dsECUser) as ECUserCreate;

        user.authenticate = authenticate;

        return user;
    }
}
