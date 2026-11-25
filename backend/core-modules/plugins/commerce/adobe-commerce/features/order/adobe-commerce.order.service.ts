import { RequestContext } from "@context/request";
import { Order, OrderErrors, OrderFilterInput, OrderInput, OrderItem, OrderResultSet, OrderService, OrderStatus, OrderStatusResultSet } from "@feature-commerce/order";
import { ProductService, ProductFilterInput } from "@feature-commerce/product";
import { PaginationInput, SortByInput } from "@feature/models";
import { AdobeCommerceBaseServiceImpl } from "@plugin-adobe-commerce/common";
import { AdobeCommerceOrderDatasource } from "./adobe-commerce.order.datasource";
import { AdobeCommerceOrderMapper } from "./adobe-commerce.order.mapper";
import { AdobeCommerceCustomerOrder, AdobeCommerceCustomerOrderFilterInput, AdobeCommerceCustomerOrderResultSet, AdobeCommerceCustomerOrderSortInput, ScopeTypeEnum } from "./schema/adobe-commerce.order.schema";
import { StringUtility } from "@utilities";

const fieldMapping = {
    createdOn: 'CREATED_AT',
    identifier: 'NUMBER',
};

export class AdobeCommerceOrderServiceImpl extends AdobeCommerceBaseServiceImpl implements OrderService {
    async updateOrder(id: string, orderInput: OrderInput, requestContext: RequestContext, context?: any): Promise<Order> {
        throw new Error('Method not implemented.');
    }
    /*
    async getCustomerOrderHistory(input: CustomerOrderHistoryInput, requestContext: RequestContext, context?: any): Promise<CustomerOrderHistoryOutput[]> {
        const methodname = `${AdobeCommerceCustomerServiceImpl.name}.getCustomerOrderHistory`;

        let dsOrderHistory: CustomerOrderHistoryOutput[];

        try {
            dsOrderHistory = await this.getDatasource<AdobeCommerceCustomerDatasource>().getCustomerOrderHistory(requestContext, input);


        } catch (error) {
            this.logger.info(`${methodname} - Error retrieving order history for customer ${input.pageSize}: ${error}`);
            throw CustomerError.getCustomerOrderHistoryFailed();
        }

        return this.getMapper<AdobeCommerceCustomerMapper>().mapCustomerOrderHistory(requestContext, dsOrderHistory);

    }
    */

    async getOrders(isDetailed: boolean, filterInput: OrderFilterInput, pagination: PaginationInput, sortBy: SortByInput, requestContext: RequestContext, context?: any): Promise<OrderResultSet> {
        const methodname = `${AdobeCommerceOrderServiceImpl.name}.getOrders`;

        let dsOrderResultSet: AdobeCommerceCustomerOrderResultSet;

        const token = this.getPluginToken(requestContext);

        if (!token?.isRegistered) {
            if (filterInput?.identifiers?.length > 0 && StringUtility.isStringNotEmpty(filterInput?.email) && StringUtility.isStringNotEmpty(filterInput?.postalCode)) {
                this.logger.info(`${methodname} - Fetching a guest cart with filter input`);

                try {
                    const dsOrder: AdobeCommerceCustomerOrder = await this.getDatasource<AdobeCommerceOrderDatasource>(requestContext).getGuestOrder(
                        filterInput.identifiers[0],
                        filterInput.email,
                        filterInput.postalCode,
                        requestContext,
                    );

                    if (dsOrder) {
                        dsOrderResultSet = {
                            page_info: {
                                current_page: 1,
                                page_size: 1,
                                total_pages: 1,
                            },
                            total_count: 1,
                            items: [dsOrder],
                        };
                    }
                } catch (error) {
                    this.logger.info(`${methodname} - Error retrieving guest order: ${error}`);
                    throw OrderErrors.guestOrderSearchFailed();
                }
            } else {
                throw OrderErrors.invalidGuestOrderSearch();
            }
        } else {
            const filter: AdobeCommerceCustomerOrderFilterInput = this.composeOrdersFilter(requestContext, filterInput);
            const sort: AdobeCommerceCustomerOrderSortInput = this.composeOrdersSort(requestContext, sortBy);

            pagination = this.validatePagination(pagination, requestContext);

            try {
                dsOrderResultSet = await this.getDatasource<AdobeCommerceOrderDatasource>(requestContext).getCustomerOrders(
                    filter,
                    pagination?.pageSize,
                    pagination?.page,
                    sort,
                    ScopeTypeEnum.WEBSITE,
                    requestContext,
                );
            } catch (error) {
                this.logger.info(`${methodname} - Error retrieving customer orders: ${error}`);
                throw OrderErrors.getOrdersFailed();
            }
        }

        const orderResultSet: OrderResultSet = this.getMapper<AdobeCommerceOrderMapper>(requestContext).mapCustomerOrderResultSet(requestContext, dsOrderResultSet);

        if (isDetailed) {
            this.logger.info(`${methodname} - Fetching detailed product information for orders`, requestContext);

            const async = [];

            orderResultSet.results.forEach((order) => {
                async.push(this.fetchProductsForOrderItems(order, requestContext, context));
            });

            /*
            for await (const order of orderResultSet.results) {
                await this.fetchProductsForOrderItems(order, requestContext, context);
            }
            */

            await Promise.all(async);
        }

        return orderResultSet;
    }

    async getOrder(id: string, requestContext: RequestContext, context?: any): Promise<Order> {
        const methodname = `${AdobeCommerceOrderServiceImpl.name}.getOrder`;

        let dsOrder: AdobeCommerceCustomerOrder;

        try {
            dsOrder = await this.getDatasource<AdobeCommerceOrderDatasource>(requestContext).getCustomerOrder(id, requestContext);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching order ${id}: ${error}`);
            throw OrderErrors.getOrderFailed();
        }

        const order = this.getMapper<AdobeCommerceOrderMapper>(requestContext).mapCustomerOrder(requestContext, dsOrder);

        await this.fetchProductsForOrderItems(order, requestContext, context);

        return order;
    }

    protected composeOrdersFilter(requestContext: RequestContext, filterInput: OrderFilterInput): AdobeCommerceCustomerOrderFilterInput {
        let filter: AdobeCommerceCustomerOrderFilterInput = {};

        if (filterInput) {
            filter = {
                number: filterInput.identifiers?.length > 0 ? { in: filterInput.identifiers } : undefined,
                status: filterInput.statuses?.length > 0 ? { in: filterInput.statuses } : undefined,
                dateFrom: StringUtility.isStringNotEmpty(filterInput.date?.from) ? { gte: filterInput.date?.from } : undefined,
                dateTo: StringUtility.isStringNotEmpty(filterInput.date?.to) ? { lte: filterInput.date?.to } : undefined,
            };
        }

        return filter;
    }

    protected composeOrdersSort(requestContext: RequestContext, sortBy: SortByInput): AdobeCommerceCustomerOrderSortInput {
        const sort: AdobeCommerceCustomerOrderSortInput =
            sortBy ?
                {
                    sort_field: fieldMapping[sortBy.identifier],
                    sort_direction: sortBy.isAscending ? 'ASC' : 'DESC',
                }
                : {
                    sort_field: fieldMapping.createdOn,
                    sort_direction: 'DESC',
                };

        return sort;
    }

    protected async fetchProductsForOrderItems(order: Order, requestContext: RequestContext, context?: any) {
        const methodname = `${AdobeCommerceOrderServiceImpl.name}.fetchProductsForOrderItems`;

        this.logger.info(`${methodname} - Fetching product information for order ${order.identifier}`, requestContext);

        const orderItemProductMap: Record<string, OrderItem[]> = {};

        order.items.results.forEach((item) => {
            if (!orderItemProductMap[item.product.slug]) {
                orderItemProductMap[item.product.slug] = [];
            }

            orderItemProductMap[item.product.slug].push(item);
        });

        const productService = this.getService<ProductService>(requestContext, ProductService);

        const productFilter: ProductFilterInput = {
            product: {
                slugs: Object.keys(orderItemProductMap).map((slug) => slug),
            },
        };

        const productResultSet = await productService.getProducts(productFilter, { pageSize: productFilter.product.slugs.length + 20 }, null, requestContext, context);

        productResultSet.results.forEach((product) => {
            if (orderItemProductMap[product.slug]) {
                orderItemProductMap[product.slug].forEach((orderItem) => {
                    orderItem.product = product;
                });
            }
        });
    }

    /**
     * @todo - Add Adobe Commerce logic to get order statuses
     *
     * @param requestContext
     * @param context
     * @returns
     */
    async getOrderStatuses(pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<OrderStatusResultSet> {
        const orderStatuses: OrderStatus[] = [
            {
                id: 'Pending',
                identifier: 'Pending',
                description: 'Pending',
            },
            {
                id: 'Processing',
                identifier: 'Processing',
                description: 'Processing',
            },
            {
                id: 'Complete',
                identifier: 'Complete',
                description: 'Complete',
            },
        ];

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
}
