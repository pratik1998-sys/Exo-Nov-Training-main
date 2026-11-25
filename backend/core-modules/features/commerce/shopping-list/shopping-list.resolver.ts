import { Context } from '@nestjs/graphql';
import { Args, Mutation, Query, Resolver } from '@api-decorators';
import {
    ShoppingList,
    ShoppingListItemAddInput,
    ShoppingListItemDeleteInput,
    ShoppingListItemUpdateInput,
    ShoppingListInput,
    ShoppingListResultSet,
} from './shopping-list.model';
import { ShoppingListApiConfiguration } from './shopping-list.api.configuration';
import { ShoppingListRequestParameters } from './shopping-list.parameters';
import { ShoppingListService } from './shopping-list.service';
import { ItemFilterInput } from '@feature-commerce/common';
import { PaginationInput, SortByInput } from '@feature/models';
import { BaseFeatureResolver } from '@feature/resolver';
import { ShoppingListModule } from './shopping-list.module';

const feature = ShoppingListModule.feature;

@Resolver((of) => ShoppingList, { feature })
export class ShoppingListResolver extends BaseFeatureResolver {
    @Query(() => ShoppingListResultSet, ShoppingListApiConfiguration.shoppingLists().queryOptions, feature)
    async shoppingLists(
        @Args({ parameter: ShoppingListRequestParameters.filter, type: () => ItemFilterInput, required: false })
        filter: ItemFilterInput,
        @Args({ parameter: ShoppingListRequestParameters.pagination, type: () => PaginationInput, required: false })
        pagination: PaginationInput,
        @Args({ parameter: ShoppingListRequestParameters.sortBy, type: () => SortByInput, required: false })
        sortBy: SortByInput,
        @Context()
        context: any,
    ): Promise<ShoppingListResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<ShoppingListService>(context, ShoppingListService);
        return await service.getShoppingLists(filter, pagination, sortBy, requestContext, context);
    }

    @Query(() => ShoppingList, ShoppingListApiConfiguration.shoppingList().queryOptions, feature)
    async shoppingList(
        @Args({ parameter: ShoppingListRequestParameters.id, required: false })
        id: string,
        @Context()
        context: any,
    ): Promise<ShoppingList> {
        const { requestContext, service } = this.getRequestContextAndService<ShoppingListService>(context, ShoppingListService);
        return await service.getShoppingList(id, requestContext, context);
    }

    @Mutation(() => ShoppingList, ShoppingListApiConfiguration.shoppingListCreate().mutationOptions, feature)
    async shoppingListCreate(
        @Args({ parameter: ShoppingListRequestParameters.shoppingList, type: () => ShoppingListInput, required: true })
        shoppingListCreateInput: ShoppingListInput,
        @Context()
        context: any,
    ): Promise<ShoppingList> {
        const { requestContext, service } = this.getRequestContextAndService<ShoppingListService>(context, ShoppingListService);
        return await service.createShoppingList(shoppingListCreateInput, requestContext, context);
    }

    @Mutation(() => ShoppingList, ShoppingListApiConfiguration.shoppingListUpdate().mutationOptions, feature)
    async shoppingListUpdate(
        @Args({ parameter: ShoppingListRequestParameters.id, required: false })
        id: string,
        @Args({ parameter: ShoppingListRequestParameters.shoppingList, type: () => ShoppingListInput, required: true })
        updateShoppingListInput: ShoppingListInput,
        @Context()
        context: any,
    ): Promise<ShoppingList> {
        const { requestContext, service } = this.getRequestContextAndService<ShoppingListService>(context, ShoppingListService);
        return await service.updateShoppingList(id, updateShoppingListInput, requestContext, context);
    }

    @Mutation(() => ShoppingList, ShoppingListApiConfiguration.shoppingListDelete().mutationOptions, feature)
    async shoppingListDelete(
        @Args({ parameter: ShoppingListRequestParameters.id, required: false })
        id: string,
        @Context()
        context: any,
    ): Promise<ShoppingList> {
        const { requestContext, service } = this.getRequestContextAndService<ShoppingListService>(context, ShoppingListService);
        return await service.deleteShoppingList(id, requestContext, context);
    }

    @Mutation(() => ShoppingList, ShoppingListApiConfiguration.shoppingListItemsAdd().mutationOptions, feature)
    async shoppingListItemsAdd(
        @Args({ parameter: ShoppingListRequestParameters.id, required: false })
        id: string,
        @Args({ parameter: ShoppingListRequestParameters.items, type: () => [ShoppingListItemAddInput], required: true })
        items: ShoppingListItemAddInput[],
        @Context()
        context: any,
    ): Promise<ShoppingList> {
        const { requestContext, service } = this.getRequestContextAndService<ShoppingListService>(context, ShoppingListService);
        return await service.addShoppingListItems(id, items, requestContext, context);
    }

    @Mutation(() => ShoppingList, ShoppingListApiConfiguration.shoppingListItemsUpdate().mutationOptions, feature)
    async shoppingListItemsUpdate(
        @Args({ parameter: ShoppingListRequestParameters.id, required: false })
        id: string,
        @Args({ parameter: ShoppingListRequestParameters.items, type: () => [ShoppingListItemUpdateInput], required: true })
        items: ShoppingListItemUpdateInput[],
        @Context()
        context: any,
    ): Promise<ShoppingList> {
        const { requestContext, service } = this.getRequestContextAndService<ShoppingListService>(context, ShoppingListService);
        return await service.updateShoppingListItems(id, items, requestContext, context);
    }

    @Mutation(() => ShoppingList, ShoppingListApiConfiguration.shoppingListItemsDelete().mutationOptions, feature)
    async shoppingListItemsDelete(
        @Args({ parameter: ShoppingListRequestParameters.id, required: false })
        id: string,
        @Args({ parameter: ShoppingListRequestParameters.items, type: () => [ShoppingListItemDeleteInput], required: true })
        items: ShoppingListItemDeleteInput[],
        @Context()
        context: any,
    ): Promise<ShoppingList> {
        const { requestContext, service } = this.getRequestContextAndService<ShoppingListService>(context, ShoppingListService);
        return await service.deleteShoppingListItems(id, items, requestContext, context);
    }
}
