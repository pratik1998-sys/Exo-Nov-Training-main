import { RequestContext } from '@context/request';
import { ShopifyCustomer } from './shopify.ec-user.schema';
import { ShopifyBaseMapper } from '@plugin-shopify/common';
import { ECUser } from '@feature-commerce/ec-user';

export class ShopifyECUserMapper extends ShopifyBaseMapper {
    mapUser(requestContext: RequestContext, dsCustomer: ShopifyCustomer): ECUser {
        let user: ECUser = null;

        if (dsCustomer) {
            user = {
                firstName: dsCustomer.firstName,
                lastName: dsCustomer.lastName,
                isMarketingOptIn: dsCustomer.acceptsMarketing,
                phone: dsCustomer.phone,
                email: dsCustomer.email,
                id: dsCustomer.id,
                addresses: dsCustomer.addresses?.edges?.length > 0 ? dsCustomer.addresses.edges.map((edge) => this.mapAddress(requestContext, edge.node)) : [],
            };
        }

        return user;
    }
}
