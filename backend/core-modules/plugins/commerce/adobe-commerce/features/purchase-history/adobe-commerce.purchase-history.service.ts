import { RequestContext } from "@context/request";
import { OrderService, OrderResultSet } from "@feature-commerce/order";
import { ProductFilterInput, ProductService } from "@feature-commerce/product";
import { PurchaseHistoryFilterInput, PurchaseHistoryItem, PurchaseHistoryResultSet, PurchaseHistoryService } from "@feature-commerce/purchase-history";
import { PaginationInput, SortByInput } from "@feature/models";
import { AdobeCommerceBaseServiceImpl } from "@plugin-adobe-commerce/common";

export class AdobeCommercePurchaseHistoryServiceImpl extends AdobeCommerceBaseServiceImpl implements PurchaseHistoryService {
    async getPurchaseHistory(
        filter: PurchaseHistoryFilterInput,
        pagination: PaginationInput,
        sortBy: SortByInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<PurchaseHistoryResultSet> {
        const methodname = `${AdobeCommercePurchaseHistoryServiceImpl.name}.getPurchaseHistory`;

        const orderService = this.getService<OrderService>(requestContext, OrderService);

        //TODO - Add filter, sort, pagination logic for orders here

        const orderSortBy: SortByInput = {
            identifier: 'createdOn',
            isAscending: false,
        };

        const orderPagination: PaginationInput = {
            page: 1,
            pageSize: 3,
        };

        const orderResultSet: OrderResultSet = await orderService.getOrders(false, null, orderPagination, orderSortBy, requestContext);

        const purchaseHistoryItems: PurchaseHistoryItem[] = [];

        const purchaseItemMap: Record<string, PurchaseHistoryItem> = {};

        const productFilter: ProductFilterInput = {
            product: {
                slugs: [],
            },
        };

        orderResultSet.results.forEach((order) => {
            order.items.results.map((orderItem) => {
                const purchaseHistoryItem: PurchaseHistoryItem = orderItem as PurchaseHistoryItem;

                if (!purchaseItemMap[purchaseHistoryItem.product.slug]) {
                    purchaseHistoryItem.purchasedOn = order.createdOn;

                    productFilter.product.slugs.push(purchaseHistoryItem.product.slug);

                    purchaseItemMap[purchaseHistoryItem.product.slug] = purchaseHistoryItem;
                }

                //purchaseHistoryItems.push(purchaseHistoryItem);
            });
        });

        const productService = this.getService<ProductService>(requestContext, ProductService);

        const productResultSet = await productService.getProducts(productFilter, { pageSize: productFilter.product.slugs.length }, null, requestContext, context, true);

        productResultSet.results.forEach((product) => {
            if (purchaseItemMap[product.slug]) {
                purchaseItemMap[product.slug].product = product;
            }
        });

        const purchaseItems = Object.values(purchaseItemMap);

        const purchaseHistoryResultSet: PurchaseHistoryResultSet = {
            pagination: {
                page: 1,
                pageSize: purchaseItems.length,
                pageCount: 1,
                hasMorePages: false,
                resultCount: purchaseItems.length,
            },
            results: purchaseItems,
        };

        return purchaseHistoryResultSet;
    }
}
