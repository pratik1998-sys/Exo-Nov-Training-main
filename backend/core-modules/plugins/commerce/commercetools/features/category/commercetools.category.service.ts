import { RequestContext } from "@context/request";
import { Category, CategoryErrors, CategoryFilterInput, CategoryResultSet, CategoryService } from "@feature-commerce/category";
import { PaginationInput } from "@feature/models";
import { CommercetoolsBaseServiceImpl, CommercetoolsConsumerConfiguration, CommercetoolsQueryParams } from "@plugin-commercetools/common";
import { CommercetoolsCategory, CommercetoolsCategoryResultSet } from "./schema/commercetools.category.schema";
import { CommercetoolsCategoryMapper } from "./commercetools.category.mapper";
import { CommercetoolsCategoryDatasource } from "./commercetools.category.datasource";
import { StringUtility } from "@utilities";


export class CommercetoolsCategoryServiceImpl extends CommercetoolsBaseServiceImpl implements CategoryService {
    // async getTopCategories(requestContext: RequestContext, context?: any): Promise<Category[]> {
    //     const methodname = `${CommercetoolsCategoryServiceImpl.name}.getTopCategories`;

    //     const dsCategoryResultSet = await this.executeGetTopCategories(requestContext);

    //     const categoryResultSet: CategoryResultSet = this.getCategoryMapper(requestContext).mapResultSet(requestContext, dsCategoryResultSet);

    //     return categoryResultSet.results;
    // }

    async getCategories(filter: CategoryFilterInput, pagination: PaginationInput, depth: number, requestContext: RequestContext, context?: any): Promise<CategoryResultSet> {
        const methodname = `${CommercetoolsCategoryServiceImpl.name}.getTopCategories`;

        let dsCategoryResultSet;

        filter = filter ?? {};

        filter.slugs = filter.slugs ?? [];
        filter.identifiers = filter.identifiers ?? [];
        filter.ids = filter.ids ?? [];

        const { configuration } = this.getPluginConsumerConfiguration<CommercetoolsConsumerConfiguration>(requestContext);

        const isRootCategory = StringUtility.isStringNotEmpty(configuration.rootCategory) && (filter.slugs.length == 0 && filter.identifiers.length == 0 && filter.ids.length == 0);

        if (isRootCategory) {
            filter.identifiers.push(configuration.rootCategory);
        }

        const query = this.composeQuery_categories(requestContext, filter, pagination);

        if (!query?.where || query?.where?.length == 0) {
            dsCategoryResultSet = await this.executeGetTopCategories(requestContext);
        } else {
            dsCategoryResultSet = await this.executeGetCategories(requestContext, query);
        }

        if (dsCategoryResultSet.results.length > 0) {
            await this.getChildCategories(requestContext, dsCategoryResultSet.results, depth ?? 0, 0);
        }

        if (isRootCategory) {
            const dsRootCategory = dsCategoryResultSet.results.find(dsCategory => dsCategory.key == configuration.rootCategory);

            dsCategoryResultSet.results = dsRootCategory?.children ?? [];
            dsCategoryResultSet.total = dsCategoryResultSet.results.length;
            dsCategoryResultSet.offset = 0;
            dsCategoryResultSet.limit = dsCategoryResultSet.results.length;
        }

        return this.getCategoryMapper(requestContext).mapResultSet(requestContext, dsCategoryResultSet);
    }

    async getCategory(
        id: string,
        identifier: string,
        slug: string,
        depth: number,
        categoryPagination: PaginationInput,
        productPagination: PaginationInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<Category> {
        const methodname = `${CommercetoolsCategoryServiceImpl.name}.getCategory`;

        let dsCategory: CommercetoolsCategory;

        const query = this.composeQuery_category(requestContext, slug);

        if (StringUtility.isStringNotEmpty(id)) {
            dsCategory = await this.getCategoryDatasource(requestContext).getCategoryById(requestContext, id, query);
        } else if (StringUtility.isStringNotEmpty(identifier)) {
            dsCategory = await this.getCategoryDatasource(requestContext).getCategoryByKey(requestContext, identifier, query);
        } else if (StringUtility.isStringNotEmpty(slug)) {
            const dsCategoryResultSet = await this.executeGetCategories(requestContext, query);

            dsCategory = dsCategoryResultSet.results.length > 0 ? dsCategoryResultSet.results[0] : null;
        } else {
            throw CategoryErrors.invalidCategoryRequest();
        }

        if (dsCategory && depth) {
            await this.getChildCategories(requestContext, [dsCategory], depth ?? 0, 0);
        }

        return this.getCategoryMapper(requestContext).mapCategory(requestContext, dsCategory);
    }

    protected async getChildCategories(requestContext: RequestContext, dsCategories: CommercetoolsCategory[], depth: number, currentDepth: number = 0) {
        const methodname = `${CommercetoolsCategoryServiceImpl.name}.getChildCategories`;

        if (currentDepth < depth) {
            const async = [];

            const categoryIds = dsCategories.map((dsCategory) => `"${dsCategory.id}"`);

            const categoryMap: Record<string, CommercetoolsCategory> = {};

            dsCategories.forEach((dsCategory) => {
                dsCategory.children = [];

                categoryMap[dsCategory.id] = dsCategory;
            });

            const query = this.composeQuery_childrenCategories(requestContext, categoryIds);

            const dsChildCategoryResultSet = await this.executeGetCategories(requestContext, query);

            if (dsChildCategoryResultSet.results.length > 0) {
                dsChildCategoryResultSet.results.forEach((dsChildCategory) => {
                    categoryMap[dsChildCategory.parent.id].children.push(dsChildCategory);
                });

                currentDepth += 1;

                await this.getChildCategories(requestContext, dsChildCategoryResultSet.results, depth, currentDepth);
            }
        }
    }

    protected async executeGetTopCategories(requestContext: RequestContext) {
        const query = this.composeQuery_topCategories(requestContext);

        return await this.executeGetCategories(requestContext, query);
    }

    protected async executeGetCategories(requestContext: RequestContext, query: CommercetoolsQueryParams): Promise<CommercetoolsCategoryResultSet> {
        const methodname = `${CommercetoolsCategoryServiceImpl.name}.executeGetCategories`;

        let dsCategoryResultSet: CommercetoolsCategoryResultSet;

        try {
            dsCategoryResultSet = await this.getCategoryDatasource(requestContext).getCategories(requestContext, query);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching categories - ${this.logger.formatJSON(query)}: ${error}`, requestContext);
            throw CategoryErrors.categoryGetFailed();
        }

        return dsCategoryResultSet;
    }

    protected composeQuery_topCategories(requestContext: RequestContext): CommercetoolsQueryParams {
        const query: CommercetoolsQueryParams = {
            where: ['parent is not defined'],
        };

        return query;
    }

    protected composeQuery_categories(requestContext: RequestContext, filter: CategoryFilterInput, pagination: PaginationInput): CommercetoolsQueryParams {
        const queryOrParts: string[] = [];

        if (filter?.ids?.length > 0) {
            queryOrParts.push(`id in ${this.composeQueryListValues(requestContext, filter.ids, true)}`);
        }

        if (filter?.identifiers?.length > 0) {
            queryOrParts.push(`key in ${this.composeQueryListValues(requestContext, filter.identifiers, true)}`);
        }

        if (filter?.slugs?.length > 0) {
            queryOrParts.push(`slug(${this.getLanguage(requestContext)} in ${this.composeQueryListValues(requestContext, filter.slugs, true)})`);
        }

        const query: CommercetoolsQueryParams = {};

        if (queryOrParts.length > 0) {
            query.where = [queryOrParts.join(' or ')];
        }

        const { limit, offset } = this.translateLimitOffsetPagination(requestContext, pagination);

        query.limit = limit;
        query.offset = offset;


        const { configuration } = this.getPluginConsumerConfiguration<CommercetoolsConsumerConfiguration>(requestContext);

        if (StringUtility.isStringNotEmpty(configuration.categoryImageField)) {
            query.expand = [`custom.fields.${configuration.categoryImageField}`]
        }

        return query;
    }

    protected composeQuery_category(requestContext: RequestContext, slug: string): CommercetoolsQueryParams {
        const { configuration } = this.getPluginConsumerConfiguration<CommercetoolsConsumerConfiguration>(requestContext);

        const query: CommercetoolsQueryParams = {
            expand: ['parent'],
        };

        if (StringUtility.isStringNotEmpty(configuration.categoryImageField)) {
            query.expand.push(`custom.fields.${configuration.categoryImageField}`);
        }

        if (StringUtility.isStringNotEmpty(slug)) {
            query.where = [`slug(en="${slug}")`];
        }

        return query;
    }

    protected composeQuery_childrenCategories(requestContext: RequestContext, categoryIds: string[]): CommercetoolsQueryParams {
        const query: CommercetoolsQueryParams = {
            where: [`parent(id in (${categoryIds.join(',')}))`],
        };

        return query;
    }

    protected getCategoryDatasource(requestContext: RequestContext) {
        return this.getDatasource<CommercetoolsCategoryDatasource>(requestContext, CommercetoolsCategoryDatasource);
    }

    protected getCategoryMapper(requestContext: RequestContext) {
        return this.getMapper<CommercetoolsCategoryMapper>(requestContext, CommercetoolsCategoryMapper);
    }
}
