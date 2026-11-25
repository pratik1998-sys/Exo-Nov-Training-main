
import { User, UserFilterInput, UserInput, UserCreateInput, UserResultSet, UserCreate } from '@feature-user';
import { BaseFeatureService } from '@feature/service';
import { RequestContext } from '@context/request';
import { PaginationInput } from '@feature/models';

export abstract class UserService extends BaseFeatureService {
    abstract getUsers(filter: UserFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<UserResultSet>;
    abstract getUser(identifier: string, requestContext: RequestContext, context?: any): Promise<User>;
    abstract createUser(userInput: UserCreateInput, requestContext: RequestContext, context?: any): Promise<UserCreate>;
    abstract updateUser(identifier: string, userInput: UserInput, requestContext: RequestContext, context?: any): Promise<User>;
    abstract deleteUser(identifier: string, requestContext: RequestContext, context?: any): Promise<User>;

    abstract getTokenId(requestContext: RequestContext): string;
}
