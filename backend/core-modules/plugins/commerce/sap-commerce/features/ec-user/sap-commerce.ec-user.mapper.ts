import { RequestContext } from "@context/request";
import { ECUser } from "@feature-commerce/ec-user";
import { GetUser, SAPCommerceBaseMapper } from "@plugin-sap-commerce/common";

export class SAPCommerceECUserMapper extends SAPCommerceBaseMapper {
    mapUser(requestContext: RequestContext, dsCustomer: GetUser.Response._200): ECUser {
        const customer: ECUser =
            dsCustomer ?
                {
                    id: dsCustomer.customerId,
                    username: dsCustomer.uid,
                    email: dsCustomer.email ?? dsCustomer.uid,
                    firstName: dsCustomer.firstName,
                    lastName: dsCustomer.lastName,
                }
                : {};

        return customer;
    }
}
