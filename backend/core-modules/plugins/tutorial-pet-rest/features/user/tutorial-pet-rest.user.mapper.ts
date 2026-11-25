import { RequestContext } from '@context/request';
import { TutorialPetRestUser, TutorialPetRestUserResultSet } from './schema/tutorial-pet-rest.user.schema';
import { TutorialPetRestBaseMapper } from '@plugin-tutorial-pet-rest/common/tutorial-pet-rest.base.mapper';
import { User, UserResultSet } from '@feature-user';


export class TutorialPetRestUserMapper extends TutorialPetRestBaseMapper {
    mapUserResultSet(requestContext: RequestContext, dsUserResultSet: TutorialPetRestUserResultSet): UserResultSet {
        return dsUserResultSet ?
            {
                pagination: this.mapPagination(requestContext, dsUserResultSet.pagination),
                results: dsUserResultSet.results?.map((dsUser) => this.mapUser(requestContext, dsUser)),
            }
            : null;
    }

    mapUser(requestContext: RequestContext, dsUser: TutorialPetRestUser): User {
        return dsUser ?
            {
                id: dsUser.id,
                identifier: dsUser.identifier,
                username: dsUser.username,
                type: dsUser.type,
                firstName: dsUser.firstName,
                middleName: dsUser.middleName,
                lastName: dsUser.lastName,
                email: dsUser.email,
                phone: dsUser.phone,
                roles: dsUser.roles,
            }
            : null;
    }
}
