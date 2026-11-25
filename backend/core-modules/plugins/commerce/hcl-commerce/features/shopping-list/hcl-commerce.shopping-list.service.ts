import { RequestContext } from "@context/request";
import { ItemFilterInput } from "@feature-commerce/common";
import {
    ShoppingList,
    ShoppingListErrors,
    ShoppingListInput,
    ShoppingListItemAddInput,
    ShoppingListItemDeleteInput,
    ShoppingListItemUpdateInput,
    ShoppingListResultSet,
    ShoppingListService,
} from "@feature-commerce/shopping-list";
import { PaginationInput, SortByInput } from "@feature/models";
import { HCLCommerceBaseServiceImpl, HCLCommerceConsumerConfiguration } from "@plugin-hcl-commerce/common";
import { StringUtility } from "@utilities";
import { HCLCommerceShoppingListDatasource } from "./hcl-commerce.shopping-list.datasource";
import { HCLCommerceShoppingListMapper } from "./hcl-commerce.shopping-list.mapper";
import {
    HCLCommerceWishlistCreateBody,
    HCLCommerceWishlistCreateItemBody,
    HCLCommerceWishlistGiftList,
    HCLCommerceWishlistLineItem,
    HCLCommerceWishlistListContainer,
    HCLCommerceWishlistQueryInput,
    HCLCommerceWishlistUpdateBody,
    HCLCommerceWishlistUpdateItemBody,
    HCLCommerceWishlistWishListUpdateResponse,
} from "./schema/hcl-commerce.shopping-list.schema";
import { Product, ProductFilterInput, ProductService } from "@feature-commerce/product";

export class HCLCommerceShoppingListServiceImpl extends HCLCommerceBaseServiceImpl implements ShoppingListService {
    protected readonly defaultShoppingListId: string = '@default';

    async getShoppingLists(
        filterInput: ItemFilterInput,
        paginationInput: PaginationInput,
        sortByInput: SortByInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<ShoppingListResultSet> {
        const query: HCLCommerceWishlistQueryInput = {};
        if (paginationInput) {
            const { limit, offset } = this.translateLimitOffsetPagination(requestContext, paginationInput, 20);
            query.pageSize = limit;
            query.pageNumber = limit > 0 ? Math.floor(Number(offset) / Number(limit)) + 1 : 1;
        }

        let dsResultSet: HCLCommerceWishlistListContainer;

        try {
            dsResultSet = await this.getDatasource<HCLCommerceShoppingListDatasource>(requestContext).findWishlistsSelf(requestContext, query);
        } catch (error) {
            this.logger.error(`${HCLCommerceShoppingListServiceImpl.name}.getShoppingLists — ${this.logger.formatJSON(error)}`, requestContext);
            throw ShoppingListErrors.getShoppingListsFailed();
        }

        return this.getMapper<HCLCommerceShoppingListMapper>(requestContext).mapShoppingListResultSet(requestContext, dsResultSet);
    }

    async getShoppingList(
        id: string | undefined,
        requestContext: RequestContext,
        context?: any,
    ): Promise<ShoppingList> {
        id = this.resolveId(id);

        const dsWishList: HCLCommerceWishlistGiftList = await this.executeGetShoppingList(requestContext, id);

        return await this.finalizeShoppingList(requestContext, dsWishList);
    }

    async createShoppingList(createInput: ShoppingListInput, requestContext: RequestContext, context?: any): Promise<ShoppingList> {
        const dsWishList: HCLCommerceWishlistGiftList = await this.executeCreateShoppingList(requestContext, createInput);

        return await this.finalizeShoppingList(requestContext, dsWishList);
    }

    async deleteShoppingList(id: string | undefined, requestContext: RequestContext, context?: any): Promise<ShoppingList> {
        const methodname = `${HCLCommerceShoppingListServiceImpl.name}.deleteShoppingList`;

        id = this.resolveId(id);

        let dsWishList: HCLCommerceWishlistGiftList = await this.executeGetShoppingList(requestContext, id);

        id = dsWishList.externalIdentifier;

        try {
            await this.getDatasource<HCLCommerceShoppingListDatasource>(requestContext).deleteWishlist(requestContext, id);
        } catch (error) {
            this.logger.error(`${methodname} - Error deleting shopping list [${id}] — ${this.logger.formatJSON(error)}`, requestContext);
            throw ShoppingListErrors.deleteShoppingListFailed();
        }

        return await this.finalizeShoppingList(requestContext, dsWishList);
    }

    async updateShoppingList(
        id: string | undefined,
        updateInput: ShoppingListInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<ShoppingList> {
        const methodname = `${HCLCommerceShoppingListServiceImpl.name}.updateShoppingList`;

        id = this.resolveId(id);

        const body: HCLCommerceWishlistUpdateBody = {};

        if (StringUtility.isStringNotEmpty(updateInput?.name)) {
            body.descriptionName = updateInput.name;
        }

        if (Object.keys(body).length === 0) {
            throw ShoppingListErrors.updateShoppingListFailed();
        }

        let dsWishList: HCLCommerceWishlistGiftList = await this.executeGetShoppingList(requestContext, id);

        id = dsWishList.externalIdentifier;

        const ds = this.getShoppingListDatasource(requestContext);

        try {
            await this.getDatasource<HCLCommerceShoppingListDatasource>(requestContext).updateWishlist(requestContext, id, body);
        } catch (error) {
            this.logger.error(`${methodname} Error updating shopping list [${id}] — ${this.logger.formatJSON(error)}`, requestContext);
            throw ShoppingListErrors.updateShoppingListFailed();
        }

        return await this.finalizeShoppingList(requestContext, dsWishList);
    }

    async addShoppingListItems(
        id: string | undefined,
        items: ShoppingListItemAddInput[],
        requestContext: RequestContext,
        context?: any,
    ): Promise<ShoppingList> {
        if (!items?.length || items.some((i) => StringUtility.isStringEmpty(i.identifier))) {
            throw ShoppingListErrors.addShoppingListItemsFailed();
        }

        id = this.resolveId(id);

        const isDefaultShoppingList = this.defaultShoppingListId === id;

        let dsWishList: HCLCommerceWishlistGiftList;

        try {
            dsWishList = await this.executeGetShoppingList(requestContext, id);
        } catch (error) {
            if (!isDefaultShoppingList) {
                this.logger.error(`${HCLCommerceShoppingListServiceImpl.name}.addShoppingListItems [${id}] — ${this.logger.formatJSON(error)}`, requestContext);

                throw ShoppingListErrors.addShoppingListItemsFailed();
            }
        }

        if (!dsWishList) {
            dsWishList = await this.executeCreateShoppingList(requestContext, {}, /*items*/);
        }

        const updateBody: HCLCommerceWishlistUpdateBody = {
            item: this.composeAddItemList(requestContext, items)
        };

        id = dsWishList.externalIdentifier;

        try {
            await this.getDatasource<HCLCommerceShoppingListDatasource>(requestContext).updateWishlist(requestContext, id, updateBody, { addItem: true });
        } catch (error) {
            this.logger.error(`${HCLCommerceShoppingListServiceImpl.name}.addShoppingListItems — ${error}`, requestContext);
            throw ShoppingListErrors.addShoppingListItemsFailed();
        }

        dsWishList = await this.executeGetShoppingList(requestContext, id);

        return await this.finalizeShoppingList(requestContext, dsWishList);
    }

    async updateShoppingListItems(
        id: string | undefined,
        items: ShoppingListItemUpdateInput[],
        requestContext: RequestContext,
        context?: any,
    ): Promise<ShoppingList> {
        const methodname = `${HCLCommerceShoppingListServiceImpl.name}.updateShoppingListItems`;

        if (!items?.length || items.some((i) => StringUtility.isStringEmpty(i.id))) {
            throw ShoppingListErrors.updateShoppingListItemsFailed();
        }

        id = this.resolveId(id);

        let dsWishList: any = await this.executeGetShoppingList(requestContext, id);

        id = dsWishList.externalIdentifier;

        const updateBody: HCLCommerceWishlistUpdateBody = {
            item: this.composeUpdateItemList(requestContext, items)
        };

        const ds = this.getShoppingListDatasource(requestContext);

        try {
            await ds.updateWishlist(requestContext, id, updateBody);
        } catch (error) {
            this.logger.error(`${methodname} [${id}] — ${error}`, requestContext);
            throw ShoppingListErrors.updateShoppingListItemsFailed();
        }

        dsWishList = await this.executeGetShoppingList(requestContext, id);

        return await this.finalizeShoppingList(requestContext, dsWishList);
    }

    async deleteShoppingListItems(
        id: string | undefined,
        items: ShoppingListItemDeleteInput[],
        requestContext: RequestContext,
        context?: any,
    ): Promise<ShoppingList> {
        if (!items?.length) {
            throw ShoppingListErrors.deleteShoppingListItemsFailed();
        }

        const itemsUpdated: ShoppingListItemUpdateInput[] = items.map((item) => {
            return {
                id: item.id,
                quantity: 0
            }
        });

        return await this.updateShoppingListItems(id, itemsUpdated, requestContext, context);
    }

    protected async executeGetShoppingList(requestContext: RequestContext, id: string | undefined): Promise<HCLCommerceWishlistGiftList> {
        const methodname = `${HCLCommerceShoppingListServiceImpl.name}.executeGetShoppingList`;

        let dsResultSet: HCLCommerceWishlistListContainer;

        const ds = this.getShoppingListDatasource(requestContext);

        try {
            dsResultSet = await ds.getWishlist(requestContext, id, {});
        } catch (error) {
            this.logger.error(`${HCLCommerceShoppingListServiceImpl.name}.getShoppingList [${id}] — ${this.logger.formatJSON(error)}`, requestContext);
            throw ShoppingListErrors.getShoppingListFailed();
        }

        let dsWishList: HCLCommerceWishlistGiftList;

        if (dsResultSet?.GiftList?.length > 0) {
            dsWishList = dsResultSet?.GiftList[0];
        } else {
            this.logger.error(`${HCLCommerceShoppingListServiceImpl.name}.getShoppingList [${id}] — Not found`, requestContext);
            throw ShoppingListErrors.getShoppingListFailed();
        }

        return dsWishList;
    }

    protected async executeCreateShoppingList(requestContext: RequestContext, createInput: ShoppingListInput, items?: ShoppingListItemAddInput[]): Promise<HCLCommerceWishlistGiftList> {
        const methodname = `${HCLCommerceShoppingListServiceImpl.name}.executeCreateShoppingList`;

        let dsWishList: HCLCommerceWishlistGiftList;

        const body: HCLCommerceWishlistCreateBody = {
            accessSpecifier: "Private",
            descriptionName: createInput?.name,
            item: items ? this.composeAddItemList(requestContext, items) : undefined,
        };

        const ds = this.getShoppingListDatasource(requestContext);

        try {
            dsWishList = await ds.createWishlist(requestContext, body);
        } catch (error) {
            this.logger.error(`${HCLCommerceShoppingListServiceImpl.name}.executeCreateShoppingList — ${this.logger.formatJSON(error)}`, requestContext);
            throw ShoppingListErrors.createShoppingListFailed();
        }

        return dsWishList;
    }

    protected composeAddItemList(requestContext: RequestContext, input: ShoppingListItemAddInput[]): any[] {
        const items = input.map((item) => {
            return {
                productId: item.identifier,
                quantityRequested: item.quantity != null ? `${item.quantity}` : '1',
                // location: 'online'
            } as HCLCommerceWishlistCreateItemBody | HCLCommerceWishlistUpdateItemBody;
        });

        return items;
    }

    protected composeUpdateItemList(requestContext: RequestContext, input: ShoppingListItemUpdateInput[]): any[] {
        const items = input.map((item) => {
            return {
                giftListItemID: item.id,
                quantityRequested: item.quantity != null ? `${item.quantity}` : '1',
            } as HCLCommerceWishlistCreateItemBody | HCLCommerceWishlistUpdateItemBody;
        });

        return items;
    }

    protected async finalizeShoppingList(requestContext: RequestContext, dsWishList: HCLCommerceWishlistGiftList): Promise<ShoppingList> {
        const productIdMap: Record<string, (HCLCommerceWishlistLineItem & { _product?: Product })[]> = {};

        dsWishList.item?.forEach((item) => {
            if (!productIdMap[item.productId]) {
                productIdMap[item.productId] = [];
            }

            productIdMap[item.productId].push(item)
        });

        const productIds = Object.keys(productIdMap);

        if (productIds.length > 0) {

            const productFilter: ProductFilterInput = {
                product: {
                    ids: productIds
                },
            };

            const productResultSet = await this.getService<ProductService>(requestContext, ProductService).getProducts(productFilter, null, null, requestContext, null, true);

            productResultSet.results?.forEach((product) => {
                productIdMap[product.identifier].forEach((item) => {
                    item._product = product;
                });
            });
        }


        return this.getShoppingListMapper(requestContext).mapShoppingList(requestContext, dsWishList);
    }

    protected resolveId(id: string | undefined): string {
        return StringUtility.isStringNotEmpty(id) ? id : this.defaultShoppingListId;
    }

    protected getShoppingListDatasource(requestContext: RequestContext): HCLCommerceShoppingListDatasource {
        return this.getDatasource<HCLCommerceShoppingListDatasource>(requestContext, HCLCommerceShoppingListDatasource);
    }

    protected getShoppingListMapper(requestContext: RequestContext): HCLCommerceShoppingListMapper {
        return this.getMapper<HCLCommerceShoppingListMapper>(requestContext, HCLCommerceShoppingListMapper);
    }
}
