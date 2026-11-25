import { RequestContext } from '@context/request';
import { TutorialPetGraphqlBaseServiceImpl } from '@plugin-tutorial-pet-graphql/common/tutorial-pet-graphql.base.service';
import { UserService } from '@feature-user';
import { UserFilterInput, UserResultSet, User, UserCreateInput, UserCreate, UserInput } from '@feature-user';
import { PaginationInput } from '@feature/models';

export class TutorialPetGraphqlUserServiceImpl extends TutorialPetGraphqlBaseServiceImpl implements UserService {
    getTokenId(requestContext: RequestContext): string {
        return this.getPluginTokenId(requestContext);
    }

    async getUsers(filter: UserFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<UserResultSet> {
        const methodname = `${TutorialPetGraphqlUserServiceImpl.name}.getUsers`;

        throw new Error('Method not implemented.');
    }

    async getUser(identifier: string, requestContext: RequestContext, context?: any): Promise<User> {
        const methodname = `${TutorialPetGraphqlUserServiceImpl.name}.getUser`;

        throw new Error('Method not implemented.');
    }

    async createUser(userInput: UserCreateInput, requestContext: RequestContext, context?: any): Promise<UserCreate> {
        const methodname = `${TutorialPetGraphqlUserServiceImpl.name}.createUser`;

        throw new Error('Method not implemented.');
    }

    async updateUser(identifier: string, userInput: UserInput, requestContext: RequestContext, context?: any): Promise<User> {
        const methodname = `${TutorialPetGraphqlUserServiceImpl.name}.updateUser`;

        throw new Error('Method not implemented.');
    }

    async deleteUser(identifier: string, requestContext: RequestContext, context?: any): Promise<User> {
        const methodname = `${TutorialPetGraphqlUserServiceImpl.name}.deleteUser`;

        throw new Error('Method not implemented.');
    }
}
