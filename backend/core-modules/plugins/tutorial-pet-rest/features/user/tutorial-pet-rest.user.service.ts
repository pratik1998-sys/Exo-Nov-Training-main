import { RequestContext } from '@context/request';
import {
    TutorialPetRestUser,
    TutorialPetRestUserBodyBase,
    TutorialPetRestUserBodyCreate,
    TutorialPetRestUserBodyUpdate,
    TutorialPetRestUserQuery,
    TutorialPetRestUserResultSet,
} from './schema/tutorial-pet-rest.user.schema';
import { TutorialPetRestUserDatasource } from './tutorial-pet-rest.user.datasource';
import { TutorialPetRestUserMapper } from './tutorial-pet-rest.user.mapper';
import { TutorialPetRestBaseServiceImpl } from '@plugin-tutorial-pet-rest/common/tutorial-pet-rest.base.service';
import { User, UserCreate, UserCreateInput, UserErrors, UserFilterInput, UserInput, UserResultSet, UserService } from '@feature-user';
import { AuthenticateService } from '@feature-authenticate';
import { PaginationInput } from '@feature/models';
import { TutorialPetRestConsumerConfiguration } from '@plugin-tutorial-pet-rest/common/tutorial-pet-rest.configuration.type';


export class TutorialPetRestUserServiceImpl extends TutorialPetRestBaseServiceImpl implements UserService {
    getTokenId(requestContext: RequestContext): string {
        return this.getPluginTokenId(requestContext);
    }

    async getUsers(filter: UserFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<UserResultSet> {
        const methodname = `${TutorialPetRestUserServiceImpl.name}.getUsers`;

        const { configuration } = this.getPluginConsumerConfiguration<TutorialPetRestConsumerConfiguration>(requestContext);
        this.logger.info(`Plugin Consumer Configuration: ${this.logger.formatJSON(configuration, true)}`, requestContext);

        pagination = this.validatePagination(pagination, requestContext);

        const query: TutorialPetRestUserQuery = this.composeQuery(requestContext, pagination, null);

        query.identifiers = filter?.identifiers;
        query.usernames = filter?.usernames;

        let dsResultSet: TutorialPetRestUserResultSet;

        try {
            dsResultSet = await this.getUserDatasource(requestContext).getUsers(requestContext, query);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching users: ${this.logger.formatJSON(error)}`, requestContext);
            throw UserErrors.getUsersFailed();
        }

        return this.getUserMapper(requestContext).mapUserResultSet(requestContext, dsResultSet);
    }

    async getUser(identifier: string, requestContext: RequestContext, context?: any): Promise<User> {
        const methodname = `${TutorialPetRestUserServiceImpl.name}.getUser`;

        identifier = identifier ?? requestContext.user?.identifier ?? '@current';

        let dsResult: TutorialPetRestUser;

        try {
            dsResult = await this.getUserDatasource(requestContext).getUser(requestContext, identifier);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching user [${identifier}]: ${this.logger.formatJSON(error)}`, requestContext);
            throw UserErrors.getUserFailed();
        }

        return this.getUserMapper(requestContext).mapUser(requestContext, dsResult);
    }

    async createUser(userInput: UserCreateInput, requestContext: RequestContext, context?: any): Promise<UserCreate> {
        const methodname = `${TutorialPetRestUserServiceImpl.name}.createUser`;

        const { configuration } = this.getPluginConsumerConfiguration<TutorialPetRestConsumerConfiguration>(requestContext);
        this.logger.info(`Plugin Consumer Configuration: ${this.logger.formatJSON(configuration, true)}`, requestContext);

        const body = this.composeUserInputBaseBody(requestContext, userInput) as TutorialPetRestUserBodyCreate;

        body.username = userInput.username ?? userInput.email;
        body.password = userInput.password;

        let dsResult: TutorialPetRestUser;

        try {
            dsResult = await this.getUserDatasource(requestContext).createUser(requestContext, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error creating user [${this.logger.formatJSON(userInput, true)}]: ${this.logger.formatJSON(error)}`, requestContext);
            throw UserErrors.createUserFailed();
        }

        const user = this.getUserMapper(requestContext).mapUser(requestContext, dsResult) as UserCreate;

        user.authenticate = await this.getService<AuthenticateService>(requestContext, AuthenticateService).authenticate(userInput.username, userInput.password, false, {}, requestContext, context);

        return user;
    }

    async updateUser(identifier: string, userInput: UserInput, requestContext: RequestContext, context?: any): Promise<User> {
        const methodname = `${TutorialPetRestUserServiceImpl.name}.updateUser`;

        const { configuration } = this.getPluginConsumerConfiguration<TutorialPetRestConsumerConfiguration>(requestContext);
        this.logger.info(`Plugin Consumer Configuration: ${this.logger.formatJSON(configuration, true)}`, requestContext);

        identifier = identifier ?? requestContext.user?.identifier;

        const body = this.composeUserInputBaseBody(requestContext, userInput) as TutorialPetRestUserBodyUpdate;

        let dsResult: TutorialPetRestUser;

        try {
            dsResult = await this.getUserDatasource(requestContext).updateUser(requestContext, identifier, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error updating user [${identifier}] - [${this.logger.formatJSON(userInput, true)}]: ${this.logger.formatJSON(error)}`, requestContext);
            throw UserErrors.updateUserFailed();
        }

        return this.getUserMapper(requestContext).mapUser(requestContext, dsResult);
    }

    async deleteUser(identifier: string, requestContext: RequestContext, context?: any): Promise<User> {
        const methodname = `${TutorialPetRestUserServiceImpl.name}.deleteUser`;

        const { configuration } = this.getPluginConsumerConfiguration<TutorialPetRestConsumerConfiguration>(requestContext);
        this.logger.info(`Plugin Consumer Configuration: ${this.logger.formatJSON(configuration, true)}`, requestContext);

        identifier = identifier ?? requestContext.user?.identifier;

        let dsResult: TutorialPetRestUser;

        try {
            dsResult = await this.getUserDatasource(requestContext).deleteUser(requestContext, identifier);
        } catch (error) {
            this.logger.info(`${methodname} - Error deleting user [${identifier}]: ${this.logger.formatJSON(error)}`, requestContext);
            throw UserErrors.deleteUserFailed();
        }

        return this.getUserMapper(requestContext).mapUser(requestContext, dsResult);
    }

    protected composeUserInputBaseBody(requestContext: RequestContext, userInput: UserInput): TutorialPetRestUserBodyBase {
        const body: TutorialPetRestUserBodyBase = {
            firstName: userInput.firstName,
            middleName: userInput.middleName,
            lastName: userInput.lastName,
            email: userInput.email,
            phone: userInput.phone,
        };

        return body;
    }

    protected getUserDatasource(requestContext: RequestContext) {
        return this.getDatasource<TutorialPetRestUserDatasource>(requestContext, TutorialPetRestUserDatasource);
    }

    protected getUserMapper(requestContext: RequestContext) {
        return this.getMapper<TutorialPetRestUserMapper>(requestContext, TutorialPetRestUserMapper);
    }
}
