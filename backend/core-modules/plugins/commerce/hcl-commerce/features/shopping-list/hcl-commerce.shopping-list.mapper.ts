import { RequestContext } from "@context/request";
import { ShoppingList, ShoppingListItem, ShoppingListItemResultSet, ShoppingListResultSet } from "@feature-commerce/shopping-list";
import { HCLCommerceBaseMapper } from "@plugin-hcl-commerce/common";
import {
    HCLCommerceWishlistGiftList,
    HCLCommerceWishlistLineItem,
    HCLCommerceWishlistListContainer,
} from "./schema/hcl-commerce.shopping-list.schema";
import { Product } from "@feature-commerce/product";

export class HCLCommerceShoppingListMapper extends HCLCommerceBaseMapper {
    mapShoppingListResultSet(requestContext: RequestContext, dsResultSet: HCLCommerceWishlistListContainer): ShoppingListResultSet {
        return {
            pagination: this.mapPagination(requestContext, dsResultSet),
            results: dsResultSet?.GiftList?.map((wishList) => this.mapShoppingList(requestContext, wishList)) ?? [],
        };
    }

    mapShoppingList(requestContext: RequestContext, dsShoppingList: HCLCommerceWishlistGiftList): ShoppingList {
        const lineItems = dsShoppingList?.item ?? [];

        const items: ShoppingListItemResultSet = {
            pagination: {
                page: 1,
                pageSize: lineItems.length,
                pageCount: 1,
                resultCount: lineItems.length,
                hasMorePages: false,
            },
            results: lineItems.map((dsItem) => this.mapLineItem(requestContext, dsItem)),
        };

        return {
            id: dsShoppingList.uniqueID ?? dsShoppingList.externalIdentifier,
            identifier: dsShoppingList.externalIdentifier ?? dsShoppingList.uniqueID,
            name: dsShoppingList.descriptionName,
            createdOn: dsShoppingList.createdTime,
            updatedOn: dsShoppingList.lastUpdate,
            items,
        };
    }

    mapLineItem(requestContext: RequestContext, dsItem: HCLCommerceWishlistLineItem & { _product?: Product }): ShoppingListItem {
        const qty = dsItem.quantityRequested != null ? Number(dsItem.quantityRequested) : 1;

        const product: Product = dsItem._product ?? {
            id: dsItem.productId,
            identifier: dsItem.partNumber,
            slug: dsItem.partNumber,
        };

        return {
            id: dsItem.giftListItemID,
            identifier: product.sku ?? product.identifier,
            quantity: Number.isFinite(qty) ? qty : 1,
            product
        };
    }

}
