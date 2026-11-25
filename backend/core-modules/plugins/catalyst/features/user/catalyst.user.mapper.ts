import { RequestContext } from '@context/request';
import { BaseMapper } from '@plugin/mapper';
import { Pagination } from '@feature/models';
import { User, UserResultSet } from '@feature-user';
import { CatalystUserEntity } from './entities/catalyst.user.entity';

export class CatalystUserMapper extends BaseMapper {
    composePagination(limit: number, offset: number, count: number): Pagination {
        const totalPages = count < limit ? 1 : Math.ceil(count / limit);
        const pageNumber = Math.ceil(offset / limit) + 1;

        return {
            page: pageNumber,
            pageSize: limit,
            resultCount: count,
            pageCount: totalPages,
            hasMorePages: pageNumber < totalPages,
        };
    }

    mapUserResultSet(requestContext: RequestContext, dbUsers: CatalystUserEntity[], count: number, limit: number, offset: number): UserResultSet {
        return {
            pagination: this.composePagination(limit, offset, count),
            results: dbUsers ? dbUsers.map((u) => this.mapUser(requestContext, u)) : [],
        };
    }

    mapUser(requestContext: RequestContext, dbUser: CatalystUserEntity): User {
        if (!dbUser) {
            return null;
        }

        return {
            id: `${dbUser.id}`,
            identifier: `${dbUser.id}`,
            name: dbUser.name,
            username: dbUser.name,
            createdAt: dbUser.createdAt ? (dbUser.createdAt instanceof Date ? dbUser.createdAt.toISOString() : String(dbUser.createdAt)) : undefined,
        };
    }
}
