
import { UserFilterInput, UserResultSet } from '@feature-user';
import { ExtTutorialPetRestUserServiceImpl } from './tutorial-pet-rest.user.service';
import { PaginationInput } from '@feature/models';
import { RequestContext } from '@context/request';

export class ExtSite2TutorialPetRestUserServiceImpl extends ExtTutorialPetRestUserServiceImpl {
    async getUsers(filter: UserFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<UserResultSet> {
        const methodname = `${ExtTutorialPetRestUserServiceImpl.name}.getUsers`;

        this.logger.info(`${methodname} - In Extension Site 2`, requestContext);

        return await super.getUsers(filter, pagination, requestContext, context);
    }
}
