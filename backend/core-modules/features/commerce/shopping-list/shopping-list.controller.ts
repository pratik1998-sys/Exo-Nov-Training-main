import { Body, Param, Query, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Controller, Delete, Get, Post, Put } from '@api-decorators';
import {
    ShoppingList,
    ShoppingListInput,
    ShoppingListItemAddInput,
    ShoppingListItemsAddInputBody,
    ShoppingListItemsDeleteInputBody,
    ShoppingListItemsUpdateInputBody,
    ShoppingListItemUpdateInput,
    ShoppingListResultSet,
} from './shopping-list.model';
import { ShoppingListRequestParameters } from './shopping-list.parameters';
import { ShoppingListModule } from './shopping-list.module';
import { ShoppingListApiConfiguration } from './shopping-list.api.configuration';
import { ShoppingListService } from './shopping-list.service';
import { RequestContext } from '@context/request';
import { QuoteController, QuoteResultSetQuery } from '@feature-commerce/quote';

const feature = ShoppingListModule.feature;

@Controller({ tags: 'shopping-list', path: 'shopping-list', feature })
export class ShoppingListController extends QuoteController {
    @Get(ShoppingListApiConfiguration.shoppingLists().restOptions, feature)
    async shoppingLists(
        @Query() query: QuoteResultSetQuery,
        @Req() request: FastifyRequest,
    ): Promise<ShoppingListResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<ShoppingListService>(request, ShoppingListService);

        const q = this.processResultSetQuery(query);

        return await service.getShoppingLists(q.filter, q.pagination, q.sortBy, requestContext, request);
    }

    @Get(ShoppingListApiConfiguration.shoppingList().restOptions, feature)
    async shoppingList(
        @Param(ShoppingListRequestParameters.id.id) id: string,
        @Req() request: FastifyRequest,
    ): Promise<ShoppingList> {
        const { requestContext, service, listId } = this.resolveShoppingListContext(request, id);

        return await service.getShoppingList(listId, requestContext, request);
    }

    @Post(ShoppingListApiConfiguration.shoppingListCreate().restOptions, feature)
    async shoppingListCreate(
        @Body() body: ShoppingListInput,
        @Query() query: QuoteResultSetQuery,
        @Req() request: FastifyRequest,
    ): Promise<ShoppingList> {
        const { requestContext, service } = this.getRequestContextAndService<ShoppingListService>(request, ShoppingListService);

        return await service.createShoppingList(body, requestContext, request);
    }

    @Put(ShoppingListApiConfiguration.shoppingListUpdate().restOptions, feature)
    async shoppingListUpdate(
        @Param(ShoppingListRequestParameters.id.id) id: string,
        @Body() body: ShoppingListInput,
        @Req() request: FastifyRequest,
    ): Promise<ShoppingList> {
        const { requestContext, service, listId } = this.resolveShoppingListContext(request, id);
        return await service.updateShoppingList(listId, body, requestContext, request);
    }

    @Delete(ShoppingListApiConfiguration.shoppingListDelete().restOptions, feature)
    async shoppingListDelete(@Param(ShoppingListRequestParameters.id.id) id: string, @Req() request: FastifyRequest): Promise<ShoppingList> {
        const { requestContext, service, listId } = this.resolveShoppingListContext(request, id);
        return await service.deleteShoppingList(listId, requestContext, request);
    }

    @Post(ShoppingListApiConfiguration.shoppingListItemAdd().restOptions, feature)
    async shoppingListItemAdd(
        @Param(ShoppingListRequestParameters.id.id) id: string,
        @Body() body: ShoppingListItemAddInput,
        @Req() request: FastifyRequest,
    ): Promise<ShoppingList> {
        const { requestContext, service, listId } = this.resolveShoppingListContext(request, id);

        return await service.addShoppingListItems(listId, [body], requestContext, request);
    }

    @Post(ShoppingListApiConfiguration.shoppingListItemsAdd().restOptions, feature)
    async shoppingListItemsAdd(
        @Param(ShoppingListRequestParameters.id.id) id: string,
        @Body() body: ShoppingListItemsAddInputBody,
        @Req() request: FastifyRequest,
    ): Promise<ShoppingList> {
        const { requestContext, service, listId } = this.resolveShoppingListContext(request, id);

        return await service.addShoppingListItems(listId, body.items, requestContext, request);
    }

    @Put(ShoppingListApiConfiguration.shoppingListItemUpdate().restOptions, feature)
    async shoppingListItemUpdate(
        @Param(ShoppingListRequestParameters.id.id) id: string,
        @Param(ShoppingListRequestParameters.itemId.id) itemId: string,
        @Body() body: ShoppingListItemUpdateInput,
        @Req() request: FastifyRequest,
    ): Promise<ShoppingList> {
        const { requestContext, service, listId } = this.resolveShoppingListContext(request, id);
        body.id = itemId;
        return await service.updateShoppingListItems(listId, [body], requestContext, request);
    }

    @Put(ShoppingListApiConfiguration.shoppingListItemsUpdate().restOptions, feature)
    async shoppingListItemsUpdate(
        @Param(ShoppingListRequestParameters.id.id) id: string,
        @Body() body: ShoppingListItemsUpdateInputBody,
        @Req() request: FastifyRequest,
    ): Promise<ShoppingList> {
        const { requestContext, service, listId } = this.resolveShoppingListContext(request, id);
        return await service.updateShoppingListItems(listId, body.items, requestContext, request);
    }

    @Delete(ShoppingListApiConfiguration.shoppingListItemDelete().restOptions, feature)
    async shoppingListItemDelete(
        @Param(ShoppingListRequestParameters.id.id) id: string,
        @Param(ShoppingListRequestParameters.itemId.id) itemId: string,
        @Req() request: FastifyRequest,
    ): Promise<ShoppingList> {
        const { requestContext, service, listId } = this.resolveShoppingListContext(request, id);
        return await service.deleteShoppingListItems(listId, [{ id: itemId }], requestContext, request);
    }

    @Put(ShoppingListApiConfiguration.shoppingListItemsDelete().restOptions, feature)
    async shoppingListItemsDelete(
        @Param(ShoppingListRequestParameters.id.id) id: string,
        @Body() body: ShoppingListItemsDeleteInputBody,
        @Req() request: FastifyRequest,
    ): Promise<ShoppingList> {
        const { requestContext, service, listId } = this.resolveShoppingListContext(request, id);
        return await service.deleteShoppingListItems(listId, body.items, requestContext, request);
    }

    protected resolveShoppingListContext(
        request: FastifyRequest,
        id: string,
    ): { listId: string | undefined; service: ShoppingListService; requestContext: RequestContext } {
        const { requestContext, service } = this.getRequestContextAndService<ShoppingListService>(request, ShoppingListService);

        const listId = this.resolveShoppingListId(id);

        return { listId, service, requestContext };
    }

    protected resolveShoppingListId(id: string): string | undefined {
        if (id && id.toLowerCase() !== 'current') {
            return id;
        }
        return undefined;
    }
}
