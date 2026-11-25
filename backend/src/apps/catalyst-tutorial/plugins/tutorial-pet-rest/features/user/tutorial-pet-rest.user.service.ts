import { RequestContext } from "@context/request";
import { UserFilterInput, UserResultSet } from "@feature-user";
import { PaginationInput } from "@feature/models";
import { TutorialPetRestUserServiceImpl } from "@plugin-tutorial-pet-rest/features/user";

export class ExtTutorialPetRestUserServiceImpl extends TutorialPetRestUserServiceImpl {
    async getUsers(filter: UserFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<UserResultSet> {
        const methodname = `${ExtTutorialPetRestUserServiceImpl.name}.getUsers`;

        this.logger.info(`${methodname} - In Extension`, requestContext);

        return await super.getUsers(filter, pagination, requestContext, context);
    }
}
