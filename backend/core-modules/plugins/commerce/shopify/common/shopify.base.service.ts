import { BaseDatasourcePluginServiceImpl } from '@plugin/service';
import { ShopifyAddress } from '../features/address/shopify.address.schema';
import { RequestContext } from '@context/request';
import { AddressInput } from '@feature-address';

export class ShopifyBaseServiceImpl extends BaseDatasourcePluginServiceImpl {
    protected mapAddressInput(requestContext: RequestContext, addressInput: AddressInput): ShopifyAddress {
        return addressInput ?
            {
                address1: addressInput.line1,
                address2: addressInput.line2,
                city: addressInput.city,
                province: addressInput.state,
                zip: addressInput.postalCode,
                country: addressInput.country,
                firstName: addressInput.firstName,
                lastName: addressInput.lastName,
                phone: addressInput.phone,
            }
            : null;
    }
}
