import { FindManyOptions, FindOptionsWhere, In, Repository } from 'typeorm';
import { RequestContext } from '@context/request';
import { StringUtility } from '@utilities';
import { v4 as uuidv4 } from 'uuid';
import { DBTutorialPetUserEntity } from './entities/tutorial-pet-db.user.entity';
import { DBTutorialPetUserMapper } from './tutorial-pet-db.user.mapper';
import { AuthenticateService } from '@feature-authenticate';
import { UserService, UserFilterInput, UserResultSet, User, UserCreateInput, UserCreate, UserInput, UserErrors } from '@feature-user';
import { PaginationInput } from '@feature/models';
import { PetService } from '@feature-tutorial-pet/pet/pet.service';
import { DBTutorialPetBaseServiceImpl } from '@plugin-tutorial-pet-db/common/db-tutorial-pet.base.service';
import { DBTutorialPetAuthenticateUtility } from '@plugin-tutorial-pet-db/features/authenticate/tutorial-pet-db.authenticate.utility';
import { TutorialPetErrors } from '@feature-tutorial-pet/common/tutorial-pet.error';
import { TokenUtility } from '@token/utilities';


export class DBTutorialPetUserServiceImpl extends DBTutorialPetBaseServiceImpl implements UserService {
    getTokenId(requestContext: RequestContext): string {
        return this.getPluginTokenId(requestContext);
    }

    async getUsers(filter: UserFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<UserResultSet> {
        const methodname = `${DBTutorialPetUserServiceImpl.name}.getUsers`;

        this.checkAuthorizationAdmin(requestContext);

        return await this.doGetUsers(filter, pagination, requestContext, context);
    }

    async getUser(identifier: string, requestContext: RequestContext, context?: any): Promise<User> {
        const methodname = `${DBTutorialPetUserServiceImpl.name}.getUser`;

        identifier = identifier ?? requestContext.user?.identifier ?? requestContext.tokens[this.getTokenId(requestContext)]?.token;

        this.checkUserAuthorization(requestContext, identifier);

        const user = await this.doGetUser(identifier, requestContext, context);

        return user;
    }

    async createUser(userInput: UserCreateInput, requestContext: RequestContext, context?: any): Promise<UserCreate> {
        const methodname = `${DBTutorialPetUserServiceImpl.name}.createUser`;

        let user = null;

        try {
            const userResultSet = await this.doGetUsers({ usernames: [userInput.username] }, null, requestContext, context);

            user = userResultSet?.results?.[0];
        } catch (error) { }

        if (user == null) {
            if (StringUtility.isStringEmpty(userInput.username) || StringUtility.isStringEmpty(userInput.password)) {
                UserErrors.createUserFailed();
            }

            const userEntity: DBTutorialPetUserEntity = {
                id: undefined,
                identifier: uuidv4(),
                username: userInput.username,
                password: DBTutorialPetAuthenticateUtility.encryptPassword(requestContext, userInput.password),
                firstName: userInput.firstName,
                middleName: userInput.middleName,
                lastName: userInput.lastName,
                type: userInput.type,
                email: userInput.email,
                phone: userInput.phone,
                canEdit: true,
            };

            try {
                const result = await this.getDBTutorialPetUserRepository().save(userEntity);

                user = await this.doGetUser(result.identifier, requestContext, context);

                this.logger.info(`${methodname} - Created user (${user.identifier}): ${this.logger.formatJSON(user, true)}`, requestContext);
            } catch (error) {
                throw UserErrors.createUserFailed();
            }
        } else {
            throw UserErrors.userExists();
        }

        return {
            ...user,
            authentication: await this.getService<AuthenticateService>(requestContext, AuthenticateService).authenticate(userInput.username, userInput.password, false, {}, requestContext, context),
        };
    }

    async updateUser(identifier: string, userInput: UserInput, requestContext: RequestContext, context?: any): Promise<User> {
        const methodname = `${DBTutorialPetUserServiceImpl.name}.createUser`;

        identifier = identifier ?? requestContext.user?.identifier;

        this.checkUserAuthorization(requestContext, identifier);

        if (!this.isAdmin(requestContext) && userInput.roles?.length > 0) {
            throw TutorialPetErrors.notAuthorized();
        }

        await this.getUserForEdit(identifier, requestContext, context);

        const userEntity: DBTutorialPetUserEntity = {
            firstName: userInput.firstName,
            middleName: userInput.middleName,
            lastName: userInput.lastName,
            email: userInput.email,
            phone: userInput.phone,
        };

        if (
            Object.values(userEntity).find((val) => {
                return val != undefined;
            })
        ) {
            const options: FindOptionsWhere<DBTutorialPetUserEntity> = { identifier: identifier };

            try {
                await this.getDBTutorialPetUserRepository().update(options, userEntity);
            } catch (error) {
                throw UserErrors.updateUserFailed();
            }
        }

        const user = await this.getUser(identifier, requestContext, context);

        this.logger.info(`${methodname} - Updated user (${identifier}): ${this.logger.formatJSON(user, true)}`, requestContext);

        return user;
    }

    async deleteUser(identifier: string, requestContext: RequestContext, context?: any): Promise<User> {
        const methodname = `${DBTutorialPetUserServiceImpl.name}.deleteUser`;

        this.checkAuthorizationAdmin(requestContext);

        const dsUser = await this.getUserForEdit(identifier, requestContext, context);

        const user = this.getUserMapper(requestContext).mapUser(requestContext, dsUser);

        try {
            await this.getDBTutorialPetUserRepository().delete({ identifier: identifier });

            const petService = this.getService<PetService>(requestContext, PetService);

            const petResultSet = await petService.getPets({ userIdentifier: identifier }, null, requestContext, context);

            const async = petResultSet?.results?.map((pet) => petService.deletePet(pet.identifier, requestContext, context));

            await Promise.all(async);
        } catch (error) {
            throw UserErrors.deleteUserFailed();
        }

        this.logger.info(`${methodname} - Deleted user (${identifier}): ${this.logger.formatJSON(user, true)}`, requestContext);

        return user;
    }

    protected async doGetUsers(filter: UserFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<UserResultSet> {
        const methodname = `${DBTutorialPetUserServiceImpl.name}.doGetUsers`;

        const { limit, offset } = this.translateLimitOffsetPagination(requestContext, pagination);

        let result: [DBTutorialPetUserEntity[], number];

        const userOptions: FindManyOptions<DBTutorialPetUserEntity> = {
            where: {
                identifier: filter?.identifiers ? In(filter.identifiers) : undefined,
                username: filter?.usernames ? In(filter.usernames) : undefined,
            },
            skip: offset,
            take: limit,
        };

        result = await this.getDBTutorialPetUserRepository().findAndCount(userOptions);

        this.logger.info(`${methodname} - Users: ${this.logger.formatJSON(result[0])}`, requestContext);

        return this.getUserMapper(requestContext).mapUserResultSet(requestContext, result[0], result[1], limit, offset);
    }

    protected async doGetUser(identifier: string, requestContext: RequestContext, context?: any): Promise<User> {
        const methodname = `${DBTutorialPetUserServiceImpl.name}.getUser`;

        const userResultSet = await this.doGetUsers({ identifiers: [identifier] }, null, requestContext, context);

        const user = userResultSet.results.length > 0 ? userResultSet.results[0] : null;

        if (!user) {
            throw UserErrors.getUserFailed();
        }

        return user;
    }

    protected async fetchUser(requestContext: RequestContext, identifier: string, whereClause: any = {}) {
        return await this.getDBTutorialPetUserRepository().findOne({
            where: {
                identifier: identifier,
                ...whereClause,
            },
        });
    }

    private async getUserForEdit(identifier: string, requestContext: RequestContext, context?: any): Promise<DBTutorialPetUserEntity> {
        const methodname = `${DBTutorialPetUserServiceImpl.name}.getUserForEdit`;

        const result = await this.fetchUser(requestContext, identifier);

        if (result && !result.canEdit) {
            throw UserErrors.userNotEditable();
        }

        return result;
    }

    protected checkUserAuthorization(requestContext: RequestContext, identifier: string) {
        const token = this.getPluginToken(requestContext);

        if (StringUtility.isStringNotEmpty(identifier) && !this.isAdmin(requestContext) && identifier != requestContext.user?.identifier && identifier != requestContext.tokens[this.getTokenId(requestContext)]?.token) {
            throw TutorialPetErrors.notAuthorized();
        }
    }

    protected getUserMapper(requestContext: RequestContext) {
        return this.getMapper<DBTutorialPetUserMapper>(requestContext, DBTutorialPetUserMapper);
    }

    protected getDBTutorialPetUserRepository(): Repository<DBTutorialPetUserEntity> {
        return this.getRepository<Repository<DBTutorialPetUserEntity>>(DBTutorialPetUserEntity);
    }
}
