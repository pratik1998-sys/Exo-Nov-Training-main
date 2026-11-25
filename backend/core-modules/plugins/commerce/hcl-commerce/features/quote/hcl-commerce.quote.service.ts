import { RequestContext } from "@context/request";
import { ProductFilterInput, ProductService } from "@feature-commerce/product";
import { HCLCommerceBaseServiceImpl } from "@plugin-hcl-commerce/common";

export class HCLCommerceQuoteServiceImpl extends HCLCommerceBaseServiceImpl {
    protected async addProductsToItems(dsQuote: any, requestContext: RequestContext, context: any) {
        const methodname = `${HCLCommerceQuoteServiceImpl.name}.addProductsToItems`;

        if (dsQuote) {
            const productOrderItemMap: Record<string, any> = {};

            dsQuote?.orderItem.forEach((dsOrderItem) => {
                if (!productOrderItemMap[dsOrderItem.partNumber]) {
                    productOrderItemMap[dsOrderItem.partNumber] = [];
                }

                productOrderItemMap[dsOrderItem.partNumber].push(dsOrderItem);
            });

            const productFilter: ProductFilterInput = {
                product: {
                    identifiers: Object.keys(productOrderItemMap).map((partNumber) => partNumber),
                },
            };

            const productService = this.getService<ProductService>(requestContext, ProductService);

            const products = await productService.getProducts(productFilter, null, null, requestContext, context, true);

            products.results?.forEach((product) => {
                productOrderItemMap[product.slug].forEach((dsOrderItem) => {
                    dsOrderItem.product = product;
                });
            });
        }
    }
}
