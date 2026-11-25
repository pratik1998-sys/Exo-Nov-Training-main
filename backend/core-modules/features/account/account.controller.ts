import { Controller, Get } from '@api-decorators';
import { Account, AccountFilterInput, AccountResultSet, AccountResultSetQuery } from './account.model';
import { AccountModule } from './account.module';
import { AccountService } from './account.service';
import { AccountApiConfiguration } from './account.api.configuration';
import { AccountRequestParameters } from './account.parameters';
import { BaseFeatureController } from '@feature/controller';
import { ResultSetQueryType } from '@feature/controller/types';
import { Param, Query, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

const paths = {
    root: 'account',
};

const feature = AccountModule.feature;

@Controller({ tags: 'account', path: paths.root, feature })
export class AccountController extends BaseFeatureController {
    @Get(AccountApiConfiguration.accounts().restOptions, feature)
    async accounts(@Req() request: FastifyRequest, @Query() query: AccountResultSetQuery): Promise<AccountResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<AccountService>(request, AccountService);

        const resultSetQuery: ResultSetQueryType = this.processResultSetQuery(query);

        const { pagination } = resultSetQuery;

        const filter: AccountFilterInput = null;

        return await service.getAccounts(query.isDetailed, filter, pagination, requestContext, request);
    }

    @Get(AccountApiConfiguration.account().restOptions, feature)
    async account(@Param(AccountRequestParameters.id.id) id: string, @Req() request: FastifyRequest): Promise<Account> {
        const { requestContext, service } = this.getRequestContextAndService<AccountService>(request, AccountService);

        return await service.getAccount(id, requestContext, request);
    }
}
