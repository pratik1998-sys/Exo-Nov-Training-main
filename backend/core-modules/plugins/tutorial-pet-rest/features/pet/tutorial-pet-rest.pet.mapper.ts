import { RequestContext } from '@context/request';
import { TutorialPetRestPet, TutorialPetRestPetResultSet } from './schema/tutorial-pet-rest.pet.schema';
import { TutorialPetRestBaseMapper } from '@plugin-tutorial-pet-rest/common/tutorial-pet-rest.base.mapper';
import { PetResultSet, Pet } from '@feature-tutorial-pet/pet/pet.model';

export class TutorialPetRestPetMapper extends TutorialPetRestBaseMapper {
    mapPetResultSet(requestContext: RequestContext, dsPetResultSet: TutorialPetRestPetResultSet): PetResultSet {
        return dsPetResultSet ?
            {
                pagination: this.mapPagination(requestContext, dsPetResultSet.pagination),
                results: dsPetResultSet.results?.map((dsPet) => this.mapPet(requestContext, dsPet)),
            }
            : null;
    }

    mapPet(requestContext: RequestContext, dsPet: TutorialPetRestPet): Pet {
        return dsPet ?
            {
                id: dsPet.id,
                identifier: dsPet.identifier,
                type: dsPet.type,
                firstName: dsPet.firstName,
                middleName: dsPet.middleName,
                lastName: dsPet.lastName,
                breed: dsPet.breed,
                height: dsPet.height,
                weight: dsPet.weight,
                thumbnail: this.mapThumbnail(requestContext, dsPet.thumbnail),
            }
            : null;
    }
}
