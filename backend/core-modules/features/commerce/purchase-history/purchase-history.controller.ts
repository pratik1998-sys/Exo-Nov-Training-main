import { Query, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Get, Controller } from '@api-decorators';
import { BaseFeatureController } from '@feature/controller';
import { PurchaseHistoryFilterInput, PurchaseHistoryResultSet, PurchaseHistoryResultSetQuery } from './purchase-history.model';
import { PurchaseHistoryApiConfiguration } from './purchase-history.api.configuration';
import { PurchaseHistoryModule } from './purchase-history.module';
import { PurchaseHistoryService } from './purchase-history.service';

const feature = PurchaseHistoryModule.feature;

@Controller({ tags: 'purchase-history', path: 'purchase-history', feature })
export class PurchaseHistoryController extends BaseFeatureController {
    @Get(PurchaseHistoryApiConfiguration.purchaseHistory().restOptions, feature)
    async purchaseHistory(@Query() query: PurchaseHistoryResultSetQuery, @Req() request: FastifyRequest): Promise<PurchaseHistoryResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<PurchaseHistoryService>(request, PurchaseHistoryService);

        const { pagination, sortBy } = this.processResultSetQuery(query);

        let filter: PurchaseHistoryFilterInput = null;

        if (query) {
            filter = {
                identifiers: query.identifiers,
                statuses: query.statuses,
                date: {
                    from: query.dateFrom,
                    to: query.dateTo,
                },
            };
        }

        return await service.getPurchaseHistory(filter, pagination, sortBy, requestContext, request);
    }
}
