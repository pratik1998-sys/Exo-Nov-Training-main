import { Param, Query, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Controller, Get } from '@api-decorators';
import { Order, OrderFilterInput, OrderResultSet, OrderResultSetQuery } from '../order.model';
import { OrderApiConfiguration } from '../order.api.configuration';
import { OrderRequestParameters } from '../order.parameters';
import { OrderService } from '../order.service';
import { OrderModule } from '../order.module';
import { BaseFeatureController } from '@feature/controller';

const feature = OrderModule.feature;

@Controller({ tags: 'order', path: 'order', feature })
export class OrderController extends BaseFeatureController {
    @Get(OrderApiConfiguration.orders().restOptions, feature)
    async orders(@Query() query: OrderResultSetQuery, @Req() request: FastifyRequest): Promise<OrderResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<OrderService>(request, OrderService);

        const { pagination, sortBy } = this.processResultSetQuery(query);

        let isDetailed = false;

        let filter: OrderFilterInput = null;

        if (query) {
            isDetailed = query.isDetailed;
            filter = {
                identifiers: query.identifiers,
                statuses: query.statuses,
                date: {
                    from: query.dateFrom,
                    to: query.dateTo,
                },
                email: query.email,
                postalCode: query.postalCode,
            };
        }

        return await service.getOrders(isDetailed, filter, pagination, sortBy, requestContext, request);
    }

    @Get(OrderApiConfiguration.order().restOptions, feature)
    async order(@Param(OrderRequestParameters.id.id) id: string, @Req() request: FastifyRequest): Promise<Order> {
        const { requestContext, service } = this.getRequestContextAndService<OrderService>(request, OrderService);

        return await service.getOrder(id, requestContext, request);
    }
}
