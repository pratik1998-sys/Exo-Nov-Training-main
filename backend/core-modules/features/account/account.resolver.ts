import { Context } from '@nestjs/graphql';
import { Account, AccountFilterInput, AccountResultSet } from './account.model';
import { AccountModule } from './account.module';
import { AccountApiConfiguration } from './account.api.configuration';
import { AccountRequestParameters } from './account.parameters';
import { AccountService } from './account.service';
import { Args, Query, Resolver } from '@api-decorators';
import { BaseFeatureResolver } from '@feature/resolver';
import { PaginationInput } from '@feature/models';

const feature = AccountModule.feature;

@Resolver((of) => Account, { feature })
export class AccountResolver extends BaseFeatureResolver {
    @Query(() => AccountResultSet, AccountApiConfiguration.accounts().queryOptions, feature)
    async accounts(
        @Args({ parameter: AccountRequestParameters.isDetailed, required: false })
        isDetailed: boolean,
        @Args({ parameter: AccountRequestParameters.filter, required: false })
        filter: AccountFilterInput,
        @Args({ parameter: AccountRequestParameters.pagination, required: false })
        pagination: PaginationInput,
        @Context() context: any,
    ): Promise<AccountResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<AccountService>(context, AccountService);

        return await service.getAccounts(isDetailed, filter, pagination, requestContext, context);
    }

    @Query(() => Account, AccountApiConfiguration.account().queryOptions, feature)
    async account(
        @Args({ parameter: AccountRequestParameters.id, required: true })
        id: string,
        @Context() context: any,
    ): Promise<Account> {
        const { requestContext, service } = this.getRequestContextAndService<AccountService>(context, AccountService);

        return await service.getAccount(id, requestContext, context);
    }
}
