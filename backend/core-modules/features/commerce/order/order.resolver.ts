import { Context } from '@nestjs/graphql';
import { Args, Query, Resolver } from '@api-decorators';
import { Order, OrderFilterInput, OrderResultSet, OrderStatusResultSet } from './order.model';
import { OrderApiConfiguration } from './order.api.configuration';
import { OrderRequestParameters } from './order.parameters';
import { OrderService } from './order.service';
import { OrderModule } from './order.module';
import { BaseFeatureResolver } from '@feature/resolver';
import { PaginationInput, SortByInput } from '@feature/models';

const feature = OrderModule.feature;

@Resolver((of) => Order, { feature })
export class OrderResolver extends BaseFeatureResolver {
    @Query(() => Order, OrderApiConfiguration.order().queryOptions, feature)
    async order(
        @Args({ parameter: OrderRequestParameters.id, required: true })
        id: string,
        @Context()
        context,
    ): Promise<Order> {
        const { requestContext, service } = this.getRequestContextAndService<OrderService>(context, OrderService);

        return await service.getOrder(id, requestContext, context);
    }

    @Query(() => OrderResultSet, OrderApiConfiguration.orders().queryOptions, feature)
    async orders(
        @Args({ parameter: OrderRequestParameters.isDetailed, type: () => Boolean, required: false })
        isDetailed: boolean,
        @Args({ parameter: OrderRequestParameters.filter, type: () => OrderFilterInput, required: false })
        filter: OrderFilterInput,
        @Args({ parameter: OrderRequestParameters.pagination, type: () => PaginationInput, required: false })
        pagination: PaginationInput,
        @Args({ parameter: OrderRequestParameters.sortBy, type: () => SortByInput, required: false })
        sortBy: SortByInput,
        @Context()
        context,
    ): Promise<OrderResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<OrderService>(context, OrderService);

        return await service.getOrders(isDetailed, filter, pagination, sortBy, requestContext, context);
    }

    // @Mutation(() => Order, { nullable: true })
    // async orderSubmit(
    //     @Args({ parameter: OrderRequestParameters.id, type: SortByInput, required: false })
    //     id: string,
    //     @Context() context,
    // ): Promise<Order> {
    //     const { requestContext, service } = this.getRequestContextAndService<OrderService>(context, OrderService);

    //     return await service.submitOrder(id, requestContext, context);
    // }

    @Query(() => OrderStatusResultSet, OrderApiConfiguration.orderStatuses().queryOptions, feature)
    async orderStatuses(
        @Args({ parameter: OrderRequestParameters.pagination, type: () => PaginationInput, required: false })
        pagination: PaginationInput,
        @Context()
        context,
    ): Promise<OrderStatusResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<OrderService>(context, OrderService);

        return await service.getOrderStatuses(pagination, requestContext, context);
    }
}
