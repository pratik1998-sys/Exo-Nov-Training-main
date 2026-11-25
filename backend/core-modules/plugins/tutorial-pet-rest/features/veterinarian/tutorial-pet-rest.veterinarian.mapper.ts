import { RequestContext } from '@context/request';

import { TutorialPetRestVeterinarianResultSet, TutorialPetRestVeterinarian } from './schema/tutorial-pet-rest.veterinarian.schema';
import { VeterinarianResultSet, Veterinarian } from '@feature-tutorial-pet/veterinarian/veterinarian.model';
import { TutorialPetRestBaseMapper } from '@plugin-tutorial-pet-rest/common/tutorial-pet-rest.base.mapper';
import { TutorialPetRestAddressMapper } from '@plugin-tutorial-pet-rest/features/address/tutorial-pet-rest.address.mapper';

export class TutorialPetRestVeterinarianMapper extends TutorialPetRestBaseMapper {
    mapVeterinarianResultSet(requestContext: RequestContext, dsVeterinarianResultSet: TutorialPetRestVeterinarianResultSet): VeterinarianResultSet {
        return dsVeterinarianResultSet ?
            {
                pagination: this.mapPagination(requestContext, dsVeterinarianResultSet.pagination),
                results: dsVeterinarianResultSet.results?.map((dsVeterinarian) => this.mapVeterinarian(requestContext, dsVeterinarian)),
            }
            : null;
    }

    mapVeterinarian(requestContext: RequestContext, dsVeterinarian: TutorialPetRestVeterinarian): Veterinarian {
        return dsVeterinarian ?
            {
                id: dsVeterinarian.id,
                identifier: dsVeterinarian.identifier,
                type: dsVeterinarian.type,
                firstName: dsVeterinarian.firstName,
                middleName: dsVeterinarian.middleName,
                lastName: dsVeterinarian.lastName,
                email: dsVeterinarian.email,
                phone: dsVeterinarian.phone,
                thumbnail: this.mapThumbnail(requestContext, dsVeterinarian.thumbnail),
                address: this.getAddressMapper(requestContext).mapAddress(requestContext, dsVeterinarian.address),
            }
            : null;
    }

    protected getAddressMapper(requestContext: RequestContext) {
        return this.getMapper<TutorialPetRestAddressMapper>(requestContext, TutorialPetRestAddressMapper);
    }
}
