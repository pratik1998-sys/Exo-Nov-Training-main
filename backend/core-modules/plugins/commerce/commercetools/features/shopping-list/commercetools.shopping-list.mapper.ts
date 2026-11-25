import { RequestContext } from '@context/request';
import { ShoppingList, ShoppingListItem, ShoppingListItemResultSet, ShoppingListResultSet } from '@feature-commerce/shopping-list';
import { Pagination } from '@feature/models';
import { CommercetoolsEntity } from '@plugin-commercetools/common';
import { CommercetoolsQuoteLineItem, CommercetoolsQuoteMapper } from '@plugin-commercetools/features/quote';
import { CommercetoolsShoppingList, CommercetoolsShoppingListLineItem, CommercetoolsShoppingListResultSet } from './schema/commercetools.shopping-list.schema';

export class CommercetoolsShoppingListMapper extends CommercetoolsQuoteMapper {
    mapResultSetEntity(requestContext: RequestContext, dsEntity: CommercetoolsEntity): ShoppingList {
        return this.mapShoppingListSummary(requestContext, dsEntity as CommercetoolsShoppingList);
    }

    mapShoppingListResultSet(requestContext: RequestContext, dsResultSet: CommercetoolsShoppingListResultSet): ShoppingListResultSet {
        const total = dsResultSet.total ?? dsResultSet.count ?? 0;

        return {
            pagination: this.mapLimitOffsetPagination(
                requestContext,
                { limit: dsResultSet.limit ?? total, offset: dsResultSet.offset ?? 0 },
                total,
            ),
            results: dsResultSet.results?.map((r) => this.mapShoppingListSummary(requestContext, r)) ?? [],
        };
    }

    mapShoppingListSummary(requestContext: RequestContext, dsList: CommercetoolsShoppingList): ShoppingList {
        return {
            id: dsList.id,
            identifier: dsList.key,
            name: this.resolveLocaleFieldValue(requestContext, dsList.name),
            createdOn: dsList.createdAt,
            updatedOn: dsList.lastModifiedAt,
            items: {
                pagination: {
                    page: 1,
                    pageCount: 1,
                    pageSize: 0,
                    resultCount: 0,
                    hasMorePages: false,
                },
                results: [],
            },
        };
    }

    mapShoppingList(
        requestContext: RequestContext,
        dsList: CommercetoolsShoppingList
    ): ShoppingList {
        const items: ShoppingListItemResultSet = {
            pagination: {
                page: 1,
                pageSize: dsList?.lineItems.length ?? 0,
                pageCount: 1,
                resultCount: dsList?.lineItems.length ?? 0,
                hasMorePages: false,
            },
            results: dsList?.lineItems.map((line) => this.mapShoppingListLineItem(requestContext, line)),
        };

        return {
            id: dsList.id,
            identifier: dsList.key,
            name: this.resolveLocaleFieldValue(requestContext, dsList.name),
            createdOn: dsList.createdAt,
            updatedOn: dsList.lastModifiedAt,
            items,
        };
    }

    mapShoppingListLineItem(requestContext: RequestContext, dsLineItem: CommercetoolsShoppingListLineItem): ShoppingListItem {
        const quoteItem = super.mapLineItem(requestContext, dsLineItem as CommercetoolsQuoteLineItem);

        const item: ShoppingListItem = {
            id: quoteItem.id,
            identifier: quoteItem.identifier ?? dsLineItem.variant?.sku,
            quantity: quoteItem.quantity,
            notes: quoteItem.notes,
            status: quoteItem.status,
            rewards: undefined,
            pricing: undefined,
            product: quoteItem.product,
            options: quoteItem.options,
        };

        return item;
    }
}
