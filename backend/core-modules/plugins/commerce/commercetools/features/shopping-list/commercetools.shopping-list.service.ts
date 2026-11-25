import { RequestContext } from '@context/request';
import {
    ShoppingList,
    ShoppingListInput,
    ShoppingListItemAddInput,
    ShoppingListItemDeleteInput,
    ShoppingListItemUpdateInput,
    ShoppingListResultSet,
    ShoppingListService,
    ShoppingListErrors,
} from '@feature-commerce/shopping-list';
import { ItemFilterInput } from '@feature-commerce/common';
import { PaginationInput, Pagination, SortByInput } from '@feature/models';
import {
    CommercetoolsConsumerConfiguration,
    CommercetoolsEntityActionRequest,
    CommercetoolsEntityQueryParams,
    CommercetoolsQueryParams,
} from '@plugin-commercetools/common';
import { CommercetoolsQuote } from '@plugin-commercetools/features/quote';
import { CommercetoolsQuoteServiceImpl } from '@plugin-commercetools/features/quote';
import { StringUtility } from '@utilities';
import { CommercetoolsShoppingListDatasource } from './commercetools.shopping-list.datasource';
import { CommercetoolsShoppingListMapper } from './commercetools.shopping-list.mapper';
import {
    CommercetoolsShoppingList,
    CommercetoolsShoppingListLineItem,
    CommercetoolsShoppingListDraft,
    ShoppingListActions,
} from './schema/commercetools.shopping-list.schema';

export class CommercetoolsShoppingListServiceImpl extends CommercetoolsQuoteServiceImpl implements ShoppingListService {
    async getShoppingLists(
        filterInput: ItemFilterInput,
        paginationInput: PaginationInput,
        sortByInput: SortByInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<ShoppingListResultSet> {
        const customerId = requestContext.user?.id;
        if (!customerId) {
            return {
                pagination: {
                    page: 1,
                    pageSize: 0,
                    pageCount: 1,
                    resultCount: 0,
                    hasMorePages: false,
                },
                results: [],
            };
        }

        paginationInput = this.validatePagination(paginationInput ?? {}, requestContext);

        const { limit, offset } = this.translateLimitOffsetPagination(requestContext, paginationInput, 20);

        const query: CommercetoolsQueryParams = {
            where: [`customer(id="${customerId}")`],
            limit,
            offset,
            sort: ['lastModifiedAt desc'],
            withTotal: true,
        };

        let rs;

        try {
            rs = await this.getShoppingListDatasource(requestContext).queryShoppingLists(requestContext, query);
        } catch (error) {
            throw ShoppingListErrors.getShoppingListsFailed();
        }

        return this.getMapper<CommercetoolsShoppingListMapper>(requestContext, CommercetoolsShoppingListMapper).mapShoppingListResultSet(requestContext, rs);
    }

    async getShoppingList(
        id: string | undefined,
        requestContext: RequestContext,
        context?: any,
    ): Promise<ShoppingList> {
        const dsList = await this.fetchShoppingList(requestContext, id);

        await this.finalizeShoppingList(requestContext, dsList);

        return this.getShoppingListMapper(requestContext).mapShoppingList(requestContext, dsList);
    }

    async createShoppingList(createInput: ShoppingListInput, requestContext: RequestContext, context?: any): Promise<ShoppingList> {
        const dsList = await this.executeCreateShoppingList(requestContext, createInput);

        return this.getShoppingListMapper(requestContext).mapShoppingList(requestContext, dsList);
    }

    protected async fetchShoppingList(requestContext: RequestContext, id: string): Promise<CommercetoolsShoppingList> {
        let dsList: CommercetoolsShoppingList;

        const { configuration } = this.getPluginConsumerConfiguration<CommercetoolsConsumerConfiguration>(requestContext);

        const { shoppingListName } = configuration;

        try {
            if (StringUtility.isStringNotEmpty(shoppingListName)) {
                dsList = await this.executeShoppingListByName(requestContext, shoppingListName);
            } else if (StringUtility.isStringNotEmpty(id)) {
                dsList = await this.getShoppingListDatasource(requestContext).getShoppingList(
                    requestContext,
                    id,
                    null,
                    this.composeQuery_getShoppingList(requestContext),
                );
            }
        } catch (error) {
            throw ShoppingListErrors.getShoppingListFailed();
        }

        return dsList;
    }

    protected async executeCreateShoppingList(requestContext: RequestContext, createInput: ShoppingListInput): Promise<CommercetoolsShoppingList> {
        const customerId = requestContext.user?.id;

        if (!customerId) {
            throw ShoppingListErrors.createShoppingListFailed();
        }

        const body = this.composeShoppingListCreateBody(requestContext, createInput);

        let dsList: CommercetoolsShoppingList;

        try {
            dsList = await this.getShoppingListDatasource(requestContext).createShoppingList(requestContext, body, this.composeQuery_getShoppingList(requestContext));
        } catch (error) {
            throw ShoppingListErrors.createShoppingListFailed();
        }

        await this.finalizeShoppingList(requestContext, dsList);

        return dsList;
    }

    async deleteShoppingList(id: string | undefined, requestContext: RequestContext, context?: any): Promise<ShoppingList> {
        let dsList: CommercetoolsShoppingList;

        id = await this.resolveShoppingListId(requestContext, id);

        const query = this.composeQuery_getShoppingList(requestContext);

        try {
            dsList = await this.getShoppingListDatasource(requestContext).deleteShoppingList(requestContext, id, null, query);
        } catch (error) {
            throw ShoppingListErrors.deleteShoppingListFailed();
        }

        return this.getShoppingListMapper(requestContext).mapShoppingList(requestContext, dsList);
    }

    async updateShoppingList(
        id: string | undefined,
        updateInput: ShoppingListInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<ShoppingList> {
        let dsList = await this.fetchShoppingList(requestContext, id);

        const body = this.composeEntityAction(dsList.version) as CommercetoolsEntityActionRequest;

        if (StringUtility.isStringNotEmpty(updateInput?.name)) {
            const lang = this.getLanguage(requestContext);
            body.actions.push({
                action: ShoppingListActions.changeName,
                name: { [lang]: updateInput.name },
            });
        }

        if (body.actions.length === 0) {
            throw ShoppingListErrors.updateShoppingListFailed();
        }

        try {
            dsList = await this.getShoppingListDatasource(requestContext).updateShoppingList(
                requestContext,
                dsList.id,
                null,
                body,
                this.composeQuery_updateShoppingList(requestContext, dsList),
            );
        } catch (error) {
            throw ShoppingListErrors.updateShoppingListFailed();
        }

        await this.finalizeShoppingList(requestContext, dsList);

        return this.getShoppingListMapper(requestContext).mapShoppingList(requestContext, dsList);

    }

    async addShoppingListItems(
        id: string | undefined,
        items: ShoppingListItemAddInput[],
        requestContext: RequestContext,
        context?: any,
    ): Promise<ShoppingList> {
        const methodname = `${CommercetoolsShoppingListServiceImpl.name}.addShoppingListItems`;

        if (!items || items.length == 0) {
            throw ShoppingListErrors.addShoppingListItemsFailed();
        }

        let dsList: CommercetoolsShoppingList = await this.fetchShoppingList(requestContext, id);

        if (!dsList) {
            dsList = await this.executeCreateShoppingList(requestContext, {});
        }

        await this.validateShoppingListItemsAdd(dsList, items);

        const body = this.composeBody_addShoppingListLineItems(dsList, items);

        try {
            dsList = await this.getShoppingListDatasource(requestContext).updateShoppingList(
                requestContext,
                dsList.id,
                null,
                body,
                this.composeQuery_updateShoppingList(requestContext, dsList),
            );
        } catch (error) {
            throw ShoppingListErrors.addShoppingListItemsFailed();
        }

        await this.finalizeShoppingList(requestContext, dsList);

        return this.getShoppingListMapper(requestContext).mapShoppingList(requestContext, dsList);
    }

    protected async validateShoppingListItemsAdd(dsList: CommercetoolsShoppingList, items: ShoppingListItemAddInput[]): Promise<void> {
        const inputSkus = items.map((item) => item.identifier);

        const existingItems = dsList.lineItems?.filter((lineItem) => inputSkus.includes(lineItem.variant?.sku));

        if (existingItems?.length) {
            throw ShoppingListErrors.shoppingListItemExists();
        }
    }

    async updateShoppingListItems(
        id: string | undefined,
        items: ShoppingListItemUpdateInput[],
        requestContext: RequestContext,
        context?: any,
    ): Promise<ShoppingList> {
        let dsList = await this.fetchShoppingList(requestContext, id);

        const body = this.composeBody_updateShoppingListLineItems(dsList, items);

        try {
            dsList = await this.getShoppingListDatasource(requestContext).updateShoppingList(
                requestContext,
                dsList.id,
                null,
                body,
                this.composeQuery_updateShoppingList(requestContext, dsList),
            );
        } catch (error) {
            throw ShoppingListErrors.updateShoppingListItemsFailed();
        }

        await this.finalizeShoppingList(requestContext, dsList);

        return this.getShoppingListMapper(requestContext).mapShoppingList(requestContext, dsList);
    }

    async deleteShoppingListItems(
        id: string | undefined,
        items: ShoppingListItemDeleteInput[],
        requestContext: RequestContext,
        context?: any,
    ): Promise<ShoppingList> {
        let dsList = await this.fetchShoppingList(requestContext, id);

        const body = this.composeBody_removeShoppingListLineItems(dsList, items);

        try {
            dsList = await this.getShoppingListDatasource(requestContext).updateShoppingList(
                requestContext,
                dsList.id,
                null,
                body,
                this.composeQuery_updateShoppingList(requestContext, dsList),
            );
        } catch (error) {
            throw ShoppingListErrors.deleteShoppingListItemsFailed();
        }

        await this.finalizeShoppingList(requestContext, dsList);

        return this.getShoppingListMapper(requestContext).mapShoppingList(requestContext, dsList);
    }

    protected async finalizeShoppingList(requestContext: RequestContext, dsList: CommercetoolsShoppingList): Promise<void> {
        await this.finalizeQuote(requestContext, dsList as unknown as CommercetoolsQuote);
    }

    protected composeShoppingListCreateBody(requestContext: RequestContext, input: ShoppingListInput): CommercetoolsShoppingListDraft {
        const { configuration } = this.getPluginConsumerConfiguration<CommercetoolsConsumerConfiguration>(requestContext);
        let { shoppingListName } = configuration;

        const lang = this.getLanguage(requestContext);

        const customerId = requestContext.user?.id;


        if (shoppingListName && StringUtility.isStringNotEmpty(input.name)) {
            throw ShoppingListErrors.createShoppingListFailed();
        }

        input.name = shoppingListName ?? input.name;

        return {
            name: StringUtility.isStringNotEmpty(input?.name) ? { [lang]: input.name } : { [lang]: 'Shopping list' },
            customer: {
                typeId: 'customer',
                id: customerId
            },
            store: StringUtility.isStringNotEmpty(configuration?.storeId) ? { typeId: 'store', key: configuration.storeId } : undefined,
        };
    }

    protected composeQuery_getShoppingList(requestContext: RequestContext): CommercetoolsQueryParams {
        return {
            expand: ['lineItems[*].variant', 'lineItems[*].productType'],
        };
    }

    protected composeQuery_updateShoppingList(requestContext: RequestContext, dsList: CommercetoolsShoppingList): CommercetoolsEntityQueryParams {
        return this.composeQuery_getShoppingList(requestContext);
    }

    protected composeBody_addShoppingListLineItems(dsList: CommercetoolsShoppingList, items: ShoppingListItemAddInput[]): CommercetoolsEntityActionRequest {
        const body = this.composeEntityAction(dsList.version) as CommercetoolsEntityActionRequest;
        body.actions = items.map((item) => ({
            action: ShoppingListActions.addLineItem,
            sku: item.identifier,
            quantity: item.quantity ?? 1,
        }));
        return body;
    }

    protected composeBody_updateShoppingListLineItems(dsList: CommercetoolsShoppingList, items: ShoppingListItemUpdateInput[]): CommercetoolsEntityActionRequest {
        const body = this.composeEntityAction(dsList.version) as CommercetoolsEntityActionRequest;

        for (const item of items) {
            const dsLine = dsList.lineItems?.find((l) => l.id === item.id);
            if (!dsLine) {
                throw ShoppingListErrors.updateShoppingListItemsFailed();
            }
            if (item.quantity !== undefined) {
                body.actions.push({
                    action: ShoppingListActions.changeLineItemQuantity,
                    lineItemId: item.id,
                    quantity: item.quantity,
                });
            }
        }

        return body;
    }

    protected composeBody_removeShoppingListLineItems(dsList: CommercetoolsShoppingList, items: ShoppingListItemDeleteInput[]): CommercetoolsEntityActionRequest {
        const body = this.composeEntityAction(dsList.version) as CommercetoolsEntityActionRequest;
        body.actions = items.map((item) => ({
            action: ShoppingListActions.removeLineItem,
            lineItemId: item.id,
        }));
        return body;
    }

    protected async resolveShoppingListId(requestContext: RequestContext, id?: string): Promise<string> {
        const { configuration } = this.getPluginConsumerConfiguration<CommercetoolsConsumerConfiguration>(requestContext);

        const { shoppingListName } = configuration;

        if (StringUtility.isStringNotEmpty(shoppingListName)) {
            const dsList = await this.executeShoppingListByName(requestContext, shoppingListName);

            id = dsList.id;
        }

        return id;
    }

    protected async executeShoppingListByName(requestContext: RequestContext, name: string): Promise<CommercetoolsShoppingList> {
        const query = this.composeQuery_getShoppingList(requestContext);

        query.where = [`customer(id="${requestContext.user?.id}")`, `name(${requestContext.language}="${name}")`];

        const rs = await this.getShoppingListDatasource(requestContext).queryShoppingLists(
            requestContext,
            this.composeQuery_getShoppingList(requestContext),
        );

        return rs.results?.[0];
    }

    protected applyLineItemFilter(lineItems: CommercetoolsShoppingListLineItem[], filterInput: ItemFilterInput): CommercetoolsShoppingListLineItem[] {
        if (!lineItems?.length) {
            return [];
        }
        const itemFilter = filterInput?.item;
        if (!itemFilter) {
            return [...lineItems];
        }

        let next = [...lineItems];
        if (itemFilter.ids?.length) {
            const idSet = new Set(itemFilter.ids);
            next = next.filter((l) => l.id && idSet.has(l.id));
        }
        if (itemFilter.identifiers?.length) {
            const idSet = new Set(itemFilter.identifiers);
            next = next.filter((l) => (l.key && idSet.has(l.key)) || (l.variant?.sku && idSet.has(l.variant.sku)));
        }
        return next;
    }

    protected getShoppingListDatasource(requestContext: RequestContext) {
        return this.getDatasource<CommercetoolsShoppingListDatasource>(requestContext, CommercetoolsShoppingListDatasource);
    }

    protected getShoppingListMapper(requestContext: RequestContext) {
        return this.getMapper<CommercetoolsShoppingListMapper>(requestContext, CommercetoolsShoppingListMapper);
    }
}
