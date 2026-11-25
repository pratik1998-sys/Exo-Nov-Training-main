import { FindManyOptions, Repository } from 'typeorm';
import { RequestContext } from '@context/request';
import { BasePluginServiceImpl } from '@plugin/service';
import { User, UserFilterInput, UserResultSet, UserCreateInput, UserCreate, UserInput, UserService } from '@feature-user';
import { PaginationInput } from '@feature/models';
import { CatalystUserEntity } from './entities/catalyst.user.entity';
import { CatalystUserMapper } from './catalyst.user.mapper';

export class CatalystUserServiceImpl extends BasePluginServiceImpl implements UserService {
    getTokenId(requestContext: RequestContext): string {
        return this.getPluginTokenId(requestContext);
    }

    async getUsers(filter: UserFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<UserResultSet> {
        const { limit, offset } = this.translateLimitOffsetPagination(requestContext, pagination);

        const options: FindManyOptions<CatalystUserEntity> = {
            skip: offset,
            take: limit,
            order: { id: 'ASC' },
        };

        const [entities, count] = await this.getUserRepository().findAndCount(options);

        return this.getUserMapper(requestContext).mapUserResultSet(requestContext, entities, count, limit, offset);
    }

    async getUser(id: string, requestContext: RequestContext, context?: any): Promise<User> {
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) {
            return null;
        }

        const entity = await this.getUserRepository().findOne({
            where: { id: numericId },
        });

        return this.getUserMapper(requestContext).mapUser(requestContext, entity);
    }

    async createUser(userInput: UserCreateInput, requestContext: RequestContext, context?: any): Promise<UserCreate> {
        const entity = this.getUserRepository().create({
            name: userInput.username ?? userInput.firstName ?? 'New User',
        });
        const saved = await this.getUserRepository().save(entity);
        return this.getUserMapper(requestContext).mapUser(requestContext, saved) as UserCreate;
    }

    async updateUser(id: string, userInput: UserInput, requestContext: RequestContext, context?: any): Promise<User> {
        const numericId = parseInt(id, 10);
        if (!isNaN(numericId)) {
            await this.getUserRepository().update({ id: numericId }, { name: userInput.firstName });
        }
        return await this.getUser(id, requestContext, context);
    }

    async deleteUser(id: string, requestContext: RequestContext, context?: any): Promise<User> {
        const user = await this.getUser(id, requestContext, context);
        const numericId = parseInt(id, 10);
        if (!isNaN(numericId)) {
            await this.getUserRepository().delete({ id: numericId });
        }
        return user;
    }

    protected getUserMapper(requestContext: RequestContext): CatalystUserMapper {
        return this.getMapper<CatalystUserMapper>(requestContext, CatalystUserMapper);
    }

    protected getUserRepository(): Repository<CatalystUserEntity> {
        return this.getRepository<Repository<CatalystUserEntity>>(CatalystUserEntity);
    }
}
