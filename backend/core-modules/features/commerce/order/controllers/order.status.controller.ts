import { Query, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Get, Controller } from '@api-decorators';
import { OrderStatusResultSet, OrderStatusResultSetQuery } from '../order.model';
import { OrderApiConfiguration } from '../order.api.configuration';
import { OrderService } from '../order.service';
import { OrderModule } from '../order.module';
import { BaseFeatureController } from '@feature/controller';

const feature = OrderModule.feature;

@Controller({ tags: 'order-status', path: 'order-status', feature })
export class OrderStatusController extends BaseFeatureController {
    @Get(OrderApiConfiguration.orderStatuses().restOptions, feature)
    async orderStatuses(@Query() query: OrderStatusResultSetQuery, @Req() request: FastifyRequest): Promise<OrderStatusResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<OrderService>(request, OrderService);

        const q = this.processResultSetQuery(query);

        return await service.getOrderStatuses(q.pagination, requestContext, request);
    }
}
