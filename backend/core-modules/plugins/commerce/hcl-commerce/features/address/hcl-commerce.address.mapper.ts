import { RequestContext } from "@context/request";
import { Address, AddressResultSet } from "@feature-address";
import { HCLCommerceBaseMapper } from "@plugin-hcl-commerce/common";

export class HCLCommerceAddressMapper extends HCLCommerceBaseMapper {
    mapAddressResultSet(requestContext: RequestContext, dsAddressResult: any): AddressResultSet {
        const addressCount = dsAddressResult?.contact?.length ?? 0;

        return {
            pagination: {
                page: 1,
                pageSize: addressCount,
                pageCount: 1,
                resultCount: addressCount,
                hasMorePages: false,
            },
            results: dsAddressResult?.contact ? dsAddressResult?.contact.map((dsAddress) => this.mapAddress(requestContext, dsAddress)) : [],
        };
    }

    mapAddress(requestContext: RequestContext, dsAddress: any): Address {
        return dsAddress ?
            {
                id: dsAddress.addressId,
                identifier: dsAddress.nickName,
                firstName: dsAddress.firstName,
                middleName: dsAddress.middleName,
                lastName: dsAddress.lastName,
                line1: dsAddress.addressLine?.length > 0 ? dsAddress.addressLine[0] : undefined,
                line2: dsAddress.addressLine?.length > 1 ? dsAddress.addressLine[1] : undefined,
                line3: dsAddress.addressLine?.length > 2 ? dsAddress.addressLine[2] : undefined,
                city: dsAddress.city,
                state: dsAddress.state,
                country: dsAddress.country,
                postalCode: dsAddress.zipCode,
                phone: dsAddress.phone1,
                email: dsAddress.email1,
            }
            : {};
    }
}
