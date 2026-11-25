import { RequestContext } from "@context/request";
import { Category, CategoryFilterInput, CategoryResultSet } from "./category.model";
import { PaginationInput } from "@feature/models";
import { BaseFeatureService } from "@feature/service";


export abstract class CategoryService extends BaseFeatureService {
    abstract getCategory(
        id: string,
        identifier: string,
        slug: string,
        depth: number,
        categoryPagination: PaginationInput,
        productPagination: PaginationInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<Category>;
    // abstract getTopCategories(requestContext: RequestContext, context?: any): Promise<Category[]>;
    abstract getCategories(filter: CategoryFilterInput, pagination: PaginationInput, depth: number, requestContext: RequestContext, context?: any): Promise<CategoryResultSet>;
}
