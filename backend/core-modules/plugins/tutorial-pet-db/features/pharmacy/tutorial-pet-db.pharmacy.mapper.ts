import { RequestContext } from '@context/request';
import { DBTutorialPetPharmacyEntity } from './entities/tutorial-pet-db.pharmacy.entity';
import { PharmacyResultSet } from '@feature-tutorial-pet/pharmacy/pharmacy.model';
import { Pharmacy } from '@feature-tutorial-pet/pharmacy/pharmacy.model';
import { DBTutorialPetBaseMapper } from '@plugin-tutorial-pet-db/common/db-tutorial-pet.base.mapper';
import { DBTutorialPetAddressMapper } from '@plugin-tutorial-pet-db/features/address/tutorial-pet-db.address.mapper';

export class DBTutorialPetPharmacyMapper extends DBTutorialPetBaseMapper {
    mapPharmacyResultSet(requestContext: RequestContext, dbPharmacies: DBTutorialPetPharmacyEntity[], count: number, limit: number, offset: number): PharmacyResultSet {
        const mapperId = 'mapPharmacyResultSet';
        const methodname = `${DBTutorialPetPharmacyMapper.name}.${mapperId}`;

        return {
            pagination: this.composePagination(limit, offset, count),
            results:
                dbPharmacies ?
                    dbPharmacies.map((dbUser) => {
                        return this.mapPharmacy(requestContext, dbUser);
                    })
                    : [],
        };
    }

    mapPharmacy(requestContext: RequestContext, dbPharmacy: DBTutorialPetPharmacyEntity): Pharmacy {
        const mapperId = 'mapPharmacy';
        const methodname = `${DBTutorialPetPharmacyMapper.name}.${mapperId}`;

        return dbPharmacy ?
            {
                id: `${dbPharmacy.id}`,
                identifier: dbPharmacy.identifier,
                name: dbPharmacy.name,
                description: dbPharmacy.description,
                email: dbPharmacy.email,
                phone: dbPharmacy.phone,
                type: dbPharmacy.type,
                address: this.getMapper<DBTutorialPetAddressMapper>(requestContext, DBTutorialPetAddressMapper).mapAddress(requestContext, dbPharmacy.address),
            }
            : null;
    }
}
