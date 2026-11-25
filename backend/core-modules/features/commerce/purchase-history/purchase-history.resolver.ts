import { Context } from '@nestjs/graphql';
import { Args, Query, Resolver } from '@api-decorators';
import { PurchaseHistoryFilterInput, PurchaseHistoryItem, PurchaseHistoryResultSet } from './purchase-history.model';
import { PurchaseHistoryApiConfiguration } from './purchase-history.api.configuration';
import { PurchaseHistoryModule } from './purchase-history.module';
import { PurchaseHistoryRequestParameters } from './purchase-history.parameters';
import { PurchaseHistoryService } from './purchase-history.service';
import { BaseFeatureResolver } from '@feature/resolver';
import { PaginationInput, SortByInput } from '@feature/models';

const feature = PurchaseHistoryModule.feature;

@Resolver((of) => PurchaseHistoryItem, { feature })
export class PurchaseHistoryResolver extends BaseFeatureResolver {
    @Query(() => PurchaseHistoryResultSet, PurchaseHistoryApiConfiguration.purchaseHistory().queryOptions, feature)
    async purchaseHistory(
        @Args({ parameter: PurchaseHistoryRequestParameters.filter, type: () => PurchaseHistoryFilterInput, required: false })
        filter: PurchaseHistoryFilterInput,
        @Args({ parameter: PurchaseHistoryRequestParameters.pagination, type: () => PaginationInput, required: false })
        pagination: PaginationInput,
        @Args({ parameter: PurchaseHistoryRequestParameters.sortBy, type: () => SortByInput, required: false })
        sortBy: SortByInput,
        @Context()
        context,
    ): Promise<PurchaseHistoryResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<PurchaseHistoryService>(context, PurchaseHistoryService);

        return await service.getPurchaseHistory(filter, pagination, sortBy, requestContext, context);
    }
}
