import { RequestContext } from '@context/request';
import { DBTutorialPetUserEntity } from './entities/tutorial-pet-db.user.entity';
import { DBTutorialPetBaseMapper } from '@plugin-tutorial-pet-db/common/db-tutorial-pet.base.mapper';
import { UserResultSet } from '@feature-user';
import { User } from '@feature-user';

export class DBTutorialPetUserMapper extends DBTutorialPetBaseMapper {
    mapUserResultSet(requestContext: RequestContext, dbUsers: DBTutorialPetUserEntity[], count: number, limit: number, offset: number): UserResultSet {
        const mapperId = 'mapPetResultSet';
        const methodname = `${DBTutorialPetUserMapper.name}.${mapperId}`;

        return {
            pagination: this.composePagination(limit, offset, count),
            results:
                dbUsers ?
                    dbUsers.map((dbUser) => {
                        return this.mapUser(requestContext, dbUser);
                    })
                    : [],
        };
    }

    mapUser(requestContext: RequestContext, dbUser: DBTutorialPetUserEntity): User {
        const mapperId = 'mapUser';
        const methodname = `${DBTutorialPetUserMapper.name}.${mapperId}`;

        return dbUser ?
            {
                id: `${dbUser.id}`,
                identifier: dbUser.identifier,
                username: dbUser.username,
                firstName: dbUser.firstName,
                middleName: dbUser.middleName,
                lastName: dbUser.lastName,
                type: dbUser.type,
                email: dbUser.email,
                phone: dbUser.phone,
                roles: dbUser.roles?.split(','),
            }
            : null;
    }
}
