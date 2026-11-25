import { ShopifyCategoryDatasource } from './shopify.category.datasource';
import { ShopifyCategoryUtility } from './shopify.category.util';
import { ShopifyCategoryMapper } from './shopify.category.mapper';
import { Category } from '@feature-commerce/category';
import { BaseRegistry } from '@registry';
import { ShopifyConsumerConfiguration } from '@plugin-shopify/common';
import { PluginConfiguration } from '@configuration/types';
import { StringUtility } from '@utilities';
import { ShopifyMenuItem } from '@plugin-shopify/common/schema/shopify.menu.schema';


interface CategoryType {
    consumerIds: string[];
    categoryIdMap: Record<string, Category>;
    categorySlugMap: Record<string, Category>;
    topCategoryList: Category[];
}

export class ShopifyCategoryRegistry extends BaseRegistry {
    private data: Record<string, any> = {};

    private consumerCategoriesById: Record<string, Record<string, Category>> = {};
    private consumerCategoriesBySlug: Record<string, Record<string, Category>> = {};
    private consumerTopCategories: Record<string, Category[]> = {};

    protected async load() {
        const methodname = `${ShopifyCategoryRegistry.name}.load`;

        const categoryResults: CategoryType[] = await this.fetchData();

        categoryResults.forEach((categoryResult) => {
            const { consumerIds, categoryIdMap, categorySlugMap, topCategoryList } = categoryResult;

            consumerIds.forEach((consumerId) => {
                this.consumerCategoriesById[consumerId] = categoryIdMap;
                this.consumerCategoriesBySlug[consumerId] = categorySlugMap;
                this.consumerTopCategories[consumerId] = topCategoryList;
            });
        });

        this.data = this.consumerCategoriesBySlug;

        this.logger.info(`${methodname} - Loaded registry [${this.registryId}]`);
    }

    protected async fetchData(): Promise<CategoryType[]> {
        const methodname = `${ShopifyCategoryRegistry.name}.fetchData`;

        const categoryResults: CategoryType[] = [];

        const consumerConfigurations: ShopifyConsumerConfiguration[] = Object.values(
            this.getPluginConfiguration<PluginConfiguration>().configuredConsumers as Record<string, ShopifyConsumerConfiguration>,
        );

        const rootCategoryConsumerMap: Record<string, ShopifyConsumerConfiguration[]> = {};

        consumerConfigurations.forEach((consumerConfiguration) => {
            const { configuration, id } = consumerConfiguration;

            const rootCategory = configuration?.menus?.rootCategory;

            const { id: rootCategoryId, depth } = rootCategory;

            if (StringUtility.isStringNotEmpty(rootCategoryId)) {
                if (!rootCategoryConsumerMap[rootCategoryId]) {
                    rootCategoryConsumerMap[rootCategoryId] = [];
                }

                rootCategoryConsumerMap[rootCategoryId].push(consumerConfiguration);
            } else {
                this.logger.info(`${methodname} - WARNING: Consumer [${id}] has no configured rootCategory`);
            }
        });

        const async = Object.keys(rootCategoryConsumerMap).map((rootCategoryToken) => this.fetchCategoryHierarchy(rootCategoryToken, rootCategoryConsumerMap[rootCategoryToken]));

        const results = await Promise.all(async);

        results.forEach((result) => {
            result.forEach((categoryResult) => categoryResults.push(categoryResult));
        });

        return categoryResults;
    }

    protected async fetchCategoryHierarchy(rootCategoryToken: string, consumerConfigurations: ShopifyConsumerConfiguration[]) {
        let menuHandleTokens = ShopifyCategoryUtility.getRootCategoryMenuPath(rootCategoryToken);

        let results: CategoryType[] = [];

        if (menuHandleTokens.length > 0) {
            /* Commented out logic for defaulting a consumer group to a single consumer execution
            const menuHandle = menuHandleTokens[0];

            const consumerConfiguration = consumerConfigurations[0];

            const { id: consumerId } = consumerConfiguration;

            const menuDepth = consumerConfiguration.configuration.categoryHierarchyMenuDepth ?? 5;

            const ds = this.getDatasource<ShopifyCategoryDatasource>(consumerId, ShopifyCategoryDatasource);

            const menu = await ds.getMenu({ consumer: consumerId }, menuHandle, menuDepth, false);
            */

            const async = consumerConfigurations.map((consumerConfiguration) => this.fetchConsumerCategoryHierarchy(menuHandleTokens, consumerConfiguration));

            results = await Promise.all(async);
        }

        return results;
    }

    protected async fetchConsumerCategoryHierarchy(menuHandleTokens: string[], consumerConfiguration: ShopifyConsumerConfiguration): Promise<CategoryType> {
        const categoryIdMap: Record<string, Category> = {};
        const categorySlugMap: Record<string, Category> = {};
        const topCategoryList: Category[] = [];

        const { id: consumerId, configuration } = consumerConfiguration;

        const menuHandle = menuHandleTokens?.length > 0 ? menuHandleTokens[0] : null;

        if (menuHandle) {
            const menuDepth = consumerConfiguration.configuration.menus.rootCategory.depth ?? 5;

            const ds = this.getDatasource<ShopifyCategoryDatasource>(consumerId, ShopifyCategoryDatasource);

            const menu = await ds.getMenu({ consumer: consumerId }, menuHandle, menuDepth, false);

            const topCategoryNodes: ShopifyMenuItem[] = menuHandleTokens.length > 1 ? this.findCategoryRootMenuItem(menu, menuHandleTokens.slice(1)) : menu.items;

            const mapper = this.getMapper<ShopifyCategoryMapper>(consumerId, ShopifyCategoryMapper);

            this.processCategoryNodes(consumerId, mapper, null, topCategoryNodes, topCategoryList, categoryIdMap, categorySlugMap);
        }

        return { consumerIds: [consumerId], categoryIdMap, categorySlugMap, topCategoryList };
    }

    protected findCategoryRootMenuItem(node: ShopifyMenuItem, nodePath: string[]) {
        const nodeId = nodePath[0];

        node = node.items.find((obj) => obj.title == nodeId);

        let nodeItems: ShopifyMenuItem[] = node?.items;

        if (nodePath.length > 1) {
            nodeItems = this.findCategoryRootMenuItem(node, nodePath.slice(1));
        }

        return nodeItems;
    }

    protected processCategoryNodes(
        consumerId: string,
        mapper: ShopifyCategoryMapper,
        parentCategory: Category,
        menuItems: ShopifyMenuItem[],
        topCategoryList: Category[],
        categoryIdMap: Record<string, Category>,
        categorySlugMap: Record<string, Category>,
    ): Category[] {
        menuItems.forEach((menuItem) => {
            if (menuItem.type == 'COLLECTION') {
                const category: Category = mapper.mapCategory(null, menuItem.resource);

                categoryIdMap[category.id] = category;
                categorySlugMap[category.slug] = category;

                if (parentCategory) {
                    category.parent = parentCategory;

                    parentCategory.children.push(category);
                } else {
                    topCategoryList.push(category);
                }

                if (menuItem.items?.length > 0) {
                    this.processCategoryNodes(consumerId, mapper, category, menuItem.items, topCategoryList, categoryIdMap, categorySlugMap);
                }
            }
        });

        return null;
    }

    getRegistryData() {
        return this.data;
    }

    getCategoryById(consumerId: string, id: string) {
        return this.consumerCategoriesById[consumerId]?.[id] ?? null;
    }

    getCategoryBySlug(consumerId: string, slug: string) {
        return this.consumerCategoriesBySlug[consumerId]?.[slug] ?? null;
    }

    getTopCategories(consumerId: string) {
        return this.consumerTopCategories[consumerId] ?? [];
    }
}
