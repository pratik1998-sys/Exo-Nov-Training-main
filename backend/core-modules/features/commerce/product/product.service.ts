import { RequestContext } from "@context/request";
import { Product, ProductFilterInput, ProductResultSet } from "./product.model";
import { PaginationInput, SortByInput } from "@feature/models";
import { BaseFeatureService } from "@feature/service";

export abstract class ProductService extends BaseFeatureService {
    abstract getProduct(id: string, identifier: string, slug: string, requestContext: RequestContext, context?: any): Promise<Product>;
    abstract getProducts(
        filter: ProductFilterInput,
        pagination: PaginationInput,
        sortBy: SortByInput,
        requestContext: RequestContext,
        context?: any,
        disableMaxPagination?: boolean,
    ): Promise<ProductResultSet>;
}
