import { RequestContext } from '@context/request';
import { DBTutorialPetAddressEntity } from './entities/tutorial-pet-db.address.entity';
import { Address, AddressResultSet } from '@feature-address';
import { DBTutorialPetBaseMapper } from '@plugin-tutorial-pet-db/common';

export class DBTutorialPetAddressMapper extends DBTutorialPetBaseMapper {
    mapAddressResultSet(requestContext: RequestContext, dbAddresses: DBTutorialPetAddressEntity[], count: number, limit: number, offset: number): AddressResultSet {
        return {
            pagination: this.composePagination(limit, offset, count),
            results:
                dbAddresses ?
                    dbAddresses.map((dbAddress) => {
                        return this.mapAddress(requestContext, dbAddress);
                    })
                    : [],
        };
    }

    mapAddresses(requestContext: RequestContext, dbAddresses: DBTutorialPetAddressEntity[]): Address[] {
        const addresses =
            dbAddresses ?
                dbAddresses.map((dbAddresses) => {
                    return this.mapAddress(requestContext, dbAddresses);
                })
                : [];

        return addresses;
    }

    mapAddress(requestContext: RequestContext, dbAddress: DBTutorialPetAddressEntity): Address {
        return dbAddress ?
            {
                id: `${dbAddress.id}`,
                identifier: dbAddress.identifier,
                //description: dbAddress.description,
                line1: dbAddress.street1,
                line2: dbAddress.street2,
                line3: dbAddress.street3,
                city: dbAddress.city,
                state: dbAddress.state,
                postalCode: dbAddress.zipcode,
                country: dbAddress.country,
                type: dbAddress.type,
                phone: dbAddress.phone,
                email: dbAddress.email,
                //canEdit: dbAddress.canEdit,
            }
            : null;
    }
}
