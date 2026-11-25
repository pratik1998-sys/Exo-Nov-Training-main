import { RequestContext } from "@context/request";
import { ECUser } from "@feature-commerce/ec-user";
import { CommercetoolsBaseMapper } from "@plugin-commercetools/common";
import { CommercetoolsAddressMapper } from "@plugin-commercetools/features/address";
import { CommercetoolsCustomer } from "./schema/commercetools.ec-user.schema";

export class CommercetoolsECUserMapper extends CommercetoolsBaseMapper {
    mapResultSetEntity(requestContext: RequestContext, dsCustomer: CommercetoolsCustomer): ECUser {
        return this.mapECUser(requestContext, dsCustomer);
    }

    mapECUser(requestContext: RequestContext, dsCustomer: CommercetoolsCustomer): ECUser {
        const customer = dsCustomer ?
            {
                id: dsCustomer.id,
                username: dsCustomer.email,
                firstName: dsCustomer.firstName,
                lastName: dsCustomer.lastName,
                email: dsCustomer.email,
                phone: this.getECUserPhone(dsCustomer),
                addresses: dsCustomer.addresses?.map((dsAddress) => this.getMapper<CommercetoolsAddressMapper>(requestContext, CommercetoolsAddressMapper).mapAddress(requestContext, dsAddress, dsCustomer)),
            }
            : {};

        return customer;
    }

    protected getECUserPhone(dsCustomer: CommercetoolsCustomer): string {
        let phone: string = null;

        const { defaultShippingAddressId, defaultBillingAddressId, addresses } = dsCustomer;

        if (defaultShippingAddressId) {
            phone = addresses.find((dsAddress) => dsAddress.id === defaultShippingAddressId)?.phone;
        }

        return phone;
    }
}
