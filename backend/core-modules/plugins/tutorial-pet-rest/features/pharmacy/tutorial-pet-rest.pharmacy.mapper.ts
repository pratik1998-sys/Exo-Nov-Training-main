import { RequestContext } from '@context/request';
import { TutorialPetRestPharmacyResultSet, TutorialPetRestPharmacy } from './schema/tutorial-pet-rest.pharmacy.schema';
import { TutorialPetRestBaseMapper } from '@plugin-tutorial-pet-rest/common/tutorial-pet-rest.base.mapper';
import { PharmacyResultSet } from '@feature-tutorial-pet/pharmacy/pharmacy.model';
import { Pharmacy } from '@feature-tutorial-pet/pharmacy/pharmacy.model';
import { TutorialPetRestAddressMapper } from '@plugin-tutorial-pet-rest/features/address/tutorial-pet-rest.address.mapper';

export class TutorialPetRestPharmacyMapper extends TutorialPetRestBaseMapper {
    mapPharmacyResultSet(requestContext: RequestContext, dsPharmacyResultSet: TutorialPetRestPharmacyResultSet): PharmacyResultSet {
        return dsPharmacyResultSet ?
            {
                pagination: this.mapPagination(requestContext, dsPharmacyResultSet.pagination),
                results: dsPharmacyResultSet.results?.map((dsPharmacy) => this.mapPharmacy(requestContext, dsPharmacy)),
            }
            : null;
    }

    mapPharmacy(requestContext: RequestContext, dsPharmacy: TutorialPetRestPharmacy): Pharmacy {
        return dsPharmacy ?
            {
                id: dsPharmacy.id,
                identifier: dsPharmacy.identifier,
                type: dsPharmacy.type,
                name: dsPharmacy.name,
                description: dsPharmacy.description,
                email: dsPharmacy.email,
                phone: dsPharmacy.phone,
                address: this.getAddressMapper(requestContext).mapAddress(requestContext, dsPharmacy.address),
            }
            : null;
    }

    protected getAddressMapper(requestContext: RequestContext) {
        return this.getMapper<TutorialPetRestAddressMapper>(requestContext, TutorialPetRestAddressMapper);
    }
}
