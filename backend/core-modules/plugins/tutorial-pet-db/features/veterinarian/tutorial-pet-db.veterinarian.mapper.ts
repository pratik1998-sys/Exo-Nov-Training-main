import { RequestContext } from '@context/request';
import { DBTutorialPetVeterinarianEntity } from './entities/tutorial-pet-db.veterinarian.entity';
import { DBTutorialPetBaseMapper } from '@plugin-tutorial-pet-db/common/db-tutorial-pet.base.mapper';
import { Veterinarian, VeterinarianResultSet } from '@feature-tutorial-pet/veterinarian/veterinarian.model';
import { DBTutorialPetAddressMapper } from '@plugin-tutorial-pet-db/features/address/tutorial-pet-db.address.mapper';

export class DBTutorialPetVeterinarianMapper extends DBTutorialPetBaseMapper {
    mapVeterinarianResultSet(requestContext: RequestContext, dbVeterinarians: DBTutorialPetVeterinarianEntity[], count: number, limit: number, offset: number): VeterinarianResultSet {
        const mapperId = 'mapVeterinarianResultSet';
        const methodname = `${DBTutorialPetVeterinarianMapper.name}.${mapperId}`;

        return {
            pagination: this.composePagination(limit, offset, count),
            results:
                dbVeterinarians ?
                    dbVeterinarians.map((dbUser) => {
                        return this.mapVeterinarian(requestContext, dbUser);
                    })
                    : [],
        };
    }

    mapVeterinarian(requestContext: RequestContext, dbVeterinarian: DBTutorialPetVeterinarianEntity): Veterinarian {
        const mapperId = 'mapVeterinarian';
        const methodname = `${DBTutorialPetVeterinarianMapper.name}.${mapperId}`;

        return dbVeterinarian ?
            {
                id: `${dbVeterinarian.id}`,
                identifier: dbVeterinarian.identifier,
                firstName: dbVeterinarian.firstName,
                middleName: dbVeterinarian.middleName,
                lastName: dbVeterinarian.lastName,
                email: dbVeterinarian.email,
                phone: dbVeterinarian.phone,
                type: dbVeterinarian.type,
                thumbnail: {
                    url: dbVeterinarian.thumbnail,
                },
                address: this.getMapper<DBTutorialPetAddressMapper>(requestContext, DBTutorialPetAddressMapper).mapAddress(requestContext, dbVeterinarian.address),
            }
            : null;
    }
}
