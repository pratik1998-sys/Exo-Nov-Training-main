import { BaseFeatureService } from '@feature/service';
import { RequestContext } from '@context/request';
import {
    ShoppingList,
    ShoppingListItemAddInput,
    ShoppingListItemDeleteInput,
    ShoppingListItemUpdateInput,
    ShoppingListInput,
    ShoppingListResultSet,
} from './shopping-list.model';
import { ItemFilterInput } from '@feature-commerce/common';
import { PaginationInput, SortByInput } from '@feature/models';

export abstract class ShoppingListService extends BaseFeatureService {
    abstract getShoppingLists(
        filterInput: ItemFilterInput,
        paginationInput: PaginationInput,
        sortByInput: SortByInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<ShoppingListResultSet>;

    abstract getShoppingList(
        id: string | undefined,
        requestContext: RequestContext,
        context?: any,
    ): Promise<ShoppingList>;

    abstract createShoppingList(
        createInput: ShoppingListInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<ShoppingList>;

    abstract deleteShoppingList(id: string | undefined, requestContext: RequestContext, context?: any): Promise<ShoppingList>;

    abstract updateShoppingList(
        id: string | undefined,
        updateInput: ShoppingListInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<ShoppingList>;

    abstract addShoppingListItems(
        id: string | undefined,
        items: ShoppingListItemAddInput[],
        requestContext: RequestContext,
        context?: any,
    ): Promise<ShoppingList>;

    abstract updateShoppingListItems(
        id: string | undefined,
        items: ShoppingListItemUpdateInput[],
        requestContext: RequestContext,
        context?: any,
    ): Promise<ShoppingList>;

    abstract deleteShoppingListItems(
        id: string | undefined,
        items: ShoppingListItemDeleteInput[],
        requestContext: RequestContext,
        context?: any,
    ): Promise<ShoppingList>;
}
