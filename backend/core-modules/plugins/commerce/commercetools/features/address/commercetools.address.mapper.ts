import { RequestContext } from "@context/request";
import { Address, AddressInput } from "@feature-address";
import { CommercetoolsBaseMapper } from "@plugin-commercetools/common";
import { CommercetoolsAddress } from "./types/commercetools.address.schema";
import { StringUtility } from "@utilities";
import { CommercetoolsCustomer } from "@plugin-commercetools/features/ec-user";

export class CommercetoolsAddressMapper extends CommercetoolsBaseMapper {
    mapResultSetEntity(requestContext: RequestContext, dsAddress: CommercetoolsAddress): Address {
        return this.mapAddress(requestContext, dsAddress);
    }

    mapAddress(requestContext: RequestContext, dsAddress: CommercetoolsAddress, dsUser?: CommercetoolsCustomer): Address {
        let address: Address = null;

        if (dsAddress) {
            const line1 = this.composeStreetLine([dsAddress.streetNumber, dsAddress.streetName]);
            const line2 = this.composeStreetLine([dsAddress.pOBox, dsAddress.building, dsAddress.apartment]);

            address = {
                id: dsAddress.id,
                identifier: dsAddress.key,
                firstName: dsAddress.firstName,
                middleName: dsAddress.middleName,
                lastName: dsAddress.lastName,
                line1,
                line2,
                line3: dsAddress.additionalStreetInfo,
                city: dsAddress.city,
                state: dsAddress.state,
                postalCode: dsAddress.postalCode,
                country: dsAddress.country,
                phone: dsAddress.phone,
                email: dsAddress.email,
                isDefault: dsAddress.id === dsUser?.defaultShippingAddressId || dsAddress.id === dsUser?.defaultBillingAddressId,
            };
        }

        return address;
    }

    composeAddressInput(requestContext: RequestContext, addressInput: AddressInput, dsAddress: CommercetoolsAddress = {}): CommercetoolsAddress {
        return {
            key: addressInput.identifier,
            externalId: dsAddress.externalId,
            country: addressInput.country ?? dsAddress.country,
            title: dsAddress.title,
            salutation: dsAddress.salutation,
            firstName: addressInput.firstName ?? dsAddress.firstName,
            middleName: addressInput.middleName ?? dsAddress.middleName,
            lastName: addressInput.lastName ?? dsAddress.lastName,
            // streetName: addressInput.line1 ?? dsAddress.streetName,
            streetName: dsAddress.streetName,
            streetNumber: addressInput.line1 ?? dsAddress.streetNumber,
            pOBox: addressInput.line2 ?? dsAddress.pOBox,
            building: addressInput.line2 ?? dsAddress.building,
            apartment: addressInput.line2 ?? dsAddress.apartment,
            additionalStreetInfo: addressInput.line3 ?? dsAddress.additionalAddressInfo,
            postalCode: addressInput.postalCode ?? dsAddress.postalCode,
            city: addressInput.city ?? dsAddress.city,
            state: addressInput.state ?? dsAddress.state,
            company: dsAddress.company,
            department: dsAddress.department,
            phone: addressInput.phone ?? dsAddress.phone,
            mobile: dsAddress.mobile,
            email: addressInput.email ?? dsAddress.email,
            fax: dsAddress.fax,
            additionalAddressInfo: dsAddress.additionalAddressInfo,
        };
    }

    protected composeStreetLine(values: string[]) {
        values = values.filter((value) => StringUtility.isStringNotEmpty(value));

        return values.join(' ');
    }
}
