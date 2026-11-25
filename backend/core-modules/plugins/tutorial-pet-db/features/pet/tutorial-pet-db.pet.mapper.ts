import { RequestContext } from '@context/request';
import { DBTutorialPetPetEntity } from './entities/tutorial-pet-db.pet.entity';
import { Pet, PetResultSet } from '@feature-tutorial-pet/pet/pet.model';
import { DBTutorialPetBaseMapper } from '@plugin-tutorial-pet-db/common/db-tutorial-pet.base.mapper';

export class DBTutorialPetPetMapper extends DBTutorialPetBaseMapper {
    mapPetResultSet(requestContext: RequestContext, dbPets: DBTutorialPetPetEntity[], count: number, limit: number, offset: number): PetResultSet {
        const mapperId = 'mapPetResultSet';
        const methodname = `${DBTutorialPetPetMapper.name}.${mapperId}`;

        return {
            pagination: this.composePagination(limit, offset, count),
            results:
                dbPets ?
                    dbPets.map((dbUser) => {
                        return this.mapPet(requestContext, dbUser);
                    })
                    : [],
        };
    }

    mapPet(requestContext: RequestContext, dbPet: DBTutorialPetPetEntity): Pet {
        const mapperId = 'mapPet';
        const methodname = `${DBTutorialPetPetMapper.name}.${mapperId}`;

        return dbPet ?
            {
                id: `${dbPet.id}`,
                identifier: dbPet.identifier,
                user: {
                    identifier: dbPet.userIdentifier,
                },
                firstName: dbPet.firstName,
                middleName: dbPet.middleName,
                lastName: dbPet.lastName,
                breed: dbPet.breed,
                height: dbPet.height,
                weight: dbPet.weight,
                type: dbPet.type,
                thumbnail: {
                    url: dbPet.thumbnail,
                },
            }
            : null;
    }
}
