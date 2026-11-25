import { RequestContext } from "@context/request";
import { Order, OrderErrors, OrderFilterInput, OrderInput, OrderResultSet, OrderService, OrderStatus, OrderStatusResultSet } from "@feature-commerce/order";
import { PaginationInput, SortByInput } from "@feature/models";
import { CommercetoolsEntityQueryParams, CommercetoolsUtility, CommercetoolsState, CommercetoolsQueryParams } from "@plugin-commercetools/common";
import { CommercetoolsChangeOrderState, CommercetoolsOrder, CommercetoolsOrderResultSet, OrderActions } from "./schema/commercetools.order.schema";
import { CommercetoolsQuoteServiceImpl } from "@plugin-commercetools/features/quote";
import { CommercetoolsOrderDatasource } from "./commercetools.order.datasource";
import { CommercetoolsOrderMapper } from "./commercetools.order.mapper";
import { CommercetoolsOrderStateRegistry } from "./commercetools.order.state.registry";

export class CommercetoolsOrderServiceImpl extends CommercetoolsQuoteServiceImpl implements OrderService {
    async getOrder(id: string, requestContext: RequestContext, context?: any): Promise<Order> {
        const methodname = `${CommercetoolsOrderServiceImpl.name}.getOrder`;

        let dsOrder: CommercetoolsOrder = await this.fetchOrder(requestContext, id);

        return await this.finalizeAndMapOrder(requestContext, dsOrder);
    }

    protected async fetchOrder(requestContext: RequestContext, id: string, query?: CommercetoolsEntityQueryParams): Promise<CommercetoolsOrder> {
        const methodname = `${CommercetoolsOrderServiceImpl.name}.fetchOrder`;

        let dsOrder: CommercetoolsOrder;

        query = query ?? this.composeQuery_getOrder(requestContext);

        try {
            dsOrder = await this.getOrderDatasource(requestContext).getOrder(requestContext, id, null, query);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching order [${id}]: ${this.logger.formatJSON(error)}`);
            throw OrderErrors.getOrderFailed();
        }

        return dsOrder;
    }

    async getOrders(isDetailed: boolean, filter: OrderFilterInput, pagination: PaginationInput, sortBy: SortByInput, requestContext: RequestContext, context?: any): Promise<OrderResultSet> {
        const methodname = `${CommercetoolsOrderServiceImpl.name}.getOrders`;

        const query = this.composeQuery_getOrders(requestContext, isDetailed, filter, pagination, sortBy);

        let dsOrderResultSet: CommercetoolsOrderResultSet;

        try {
            dsOrderResultSet = await this.getOrderDatasource(requestContext).getOrders(requestContext, query);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching orders - ${this.logger.formatJSON(query)}: ${this.logger.formatJSON(error)}`);
            throw OrderErrors.getOrderFailed();
        }

        if (isDetailed) {
            const async = dsOrderResultSet?.results?.map((dsOrder) => this.finalizeOrder(requestContext, dsOrder));

            await Promise.all(async);
        }

        return this.getOrderMapper(requestContext).mapResultSet(requestContext, dsOrderResultSet);
    }

    async updateOrder(id: string, orderInput: OrderInput, requestContext: RequestContext, context?: any): Promise<Order> {
        const methodname = `${CommercetoolsOrderServiceImpl.name}.updateOrder`;

        let dsOrder: CommercetoolsOrder;

        const query = this.composeQuery_getOrder(requestContext);

        const idVersion = CommercetoolsUtility.resolveIdAndVersionFromId(requestContext, id);

        if (!idVersion.version) {
            dsOrder = await this.fetchOrder(requestContext, id, query);

            idVersion.version = dsOrder.version;
        }

        const body = this.composeEntityAction(idVersion.version);

        if (orderInput.status) {
            body.actions.push(this.composeAction_updateStatus(requestContext, orderInput.status));
        }

        try {
            dsOrder = await this.getDatasource<CommercetoolsOrderDatasource>(requestContext, CommercetoolsOrderDatasource).updateOrder(requestContext, dsOrder.id, body, query);
        } catch (error) {
            this.logger.info(`${methodname} - Error updating order [${idVersion.id}] - ${this.logger.formatJSON(body)}: ${this.logger.formatJSON(error)}`);
            throw OrderErrors.updateOrderFailed();
        }

        return await this.finalizeAndMapOrder(requestContext, dsOrder);
    }

    protected composeAction_updateStatus(requestContext: RequestContext, status: string) {
        const action: CommercetoolsChangeOrderState = {
            action: OrderActions.changeOrderState,
            orderState: status,
        };

        return action;
    }

    async getOrderStatuses(pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<OrderStatusResultSet> {
        const methodname = `${CommercetoolsOrderServiceImpl.name}.getOrderStatuses`;

        const dsOrderStates: CommercetoolsState[] = this.getRegistry<CommercetoolsOrderStateRegistry>(requestContext, CommercetoolsOrderStateRegistry).getStates();

        const orderStatuses: OrderStatus[] = this.getOrderMapper(requestContext).mapOrderStatuses(requestContext, dsOrderStates);

        return {
            pagination: {
                pageSize: orderStatuses.length,
                pageCount: 1,
                resultCount: orderStatuses.length,
                hasMorePages: false,
                page: 1,
            },
            results: orderStatuses,
        };
    }

    protected composeQuery_getOrder(requestContext: RequestContext) {
        return this.composeQuery_getQuote(requestContext);
    }

    protected composeQuery_getOrders(requestContext: RequestContext, isDetailed: boolean, filter: OrderFilterInput, pagination: PaginationInput, sortBy: SortByInput) {
        const { limit, offset } = this.translateLimitOffsetPagination(requestContext, pagination);

        const query: CommercetoolsQueryParams = {
            expand: [],
            where: [],
            limit,
            offset,
            withTotal: true,
        };

        this.composeQueryExpand_getOrders(requestContext, isDetailed, query);
        this.composeQueryWhere_getOrders(requestContext, query);
        this.composeQueryFilter_getOrders(requestContext, filter, query);

        this.composeQuerySortBy_getOrders(requestContext, query, sortBy);

        return query;
    }

    //TODO - Calculate sort params
    protected composeQuerySortBy_getOrders(requestContext, query: CommercetoolsQueryParams, sortBy: SortByInput) {
        const sort = `createdAt desc`;

        query.sort = [sort];
    }

    protected composeQueryExpand_getOrders(requestContext: RequestContext, isDetailed: boolean, query: CommercetoolsQueryParams) {
        if (isDetailed) {
            query.expand = this.composeQuery_getQuote(requestContext).expand;
        }
    }

    protected composeQueryWhere_getOrders(requestContext: RequestContext, query: CommercetoolsQueryParams) {
        query.where.push(`customerId = "${requestContext.user?.id}"`);
    }

    protected composeQueryFilter_getOrders(requestContext: RequestContext, filter: OrderFilterInput, query: CommercetoolsQueryParams) {
        if (filter?.identifiers) {
            // query.where.push(`id in ${this.composeQueryListValues(requestContext, filter.identifiers, true)}`);
            query.where.push(`orderNumber in ${this.composeQueryListValues(requestContext, filter.identifiers, true)}`);
        }

        if (filter?.statuses) {
            query.where.push(`orderState in ${this.composeQueryListValues(requestContext, filter.statuses, true)}`);
        }
    }

    protected async finalizeOrder(requestContext: RequestContext, dsOrder: CommercetoolsOrder) {
        await super.finalizeQuote(requestContext, dsOrder);
    }

    protected async finalizeAndMapOrder(requestContext: RequestContext, dsOrder: CommercetoolsOrder): Promise<Order> {
        await this.finalizeOrder(requestContext, dsOrder);

        return this.getOrderMapper(requestContext).mapOrder(requestContext, dsOrder);
    }

    protected getOrderDatasource(requestContext: RequestContext) {
        return this.getDatasource<CommercetoolsOrderDatasource>(requestContext, CommercetoolsOrderDatasource);
    }

    protected getOrderMapper(requestContext: RequestContext) {
        return this.getMapper<CommercetoolsOrderMapper>(requestContext, CommercetoolsOrderMapper);
    }
}
