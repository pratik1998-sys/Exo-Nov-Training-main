
import { BaseMapper } from '@plugin/mapper';
import { ShopifyAddress } from '../features/address/shopify.address.schema';
import { RequestContext } from '@context/request';
import { Address } from '@feature-address';


export class ShopifyBaseMapper extends BaseMapper {
    protected readonly idDelimiter = '?';

    mapAddress(requestContext: RequestContext, dsAddress: ShopifyAddress): Address {
        return dsAddress ?
            {
                line1: dsAddress.address1,
                line2: dsAddress.address2,
                city: dsAddress.city,
                state: dsAddress.province,
                postalCode: dsAddress.zip,
                country: dsAddress.countryCodeV2,
                firstName: dsAddress.firstName,
                lastName: dsAddress.lastName,
                phone: dsAddress.phone,
                id: dsAddress.id,
            }
            : null;
    }
}
