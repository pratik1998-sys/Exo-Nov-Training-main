import { Body, Param, Query, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Get, Post, Controller } from '@api-decorators';
import { Product, ProductResultSet, ProductResultSetQuery, ProductResultSetQueryType, ProductsGetInput } from './product.model';
import { ProductApiConfiguration } from './product.api.configuration';
import { ProductModule } from './product.module';
import { ProductRequestParameters } from './product.parameters';
import { ProductService } from './product.service';
import { BaseFeatureController } from '@feature/controller';
import { FacetInput, FacetRangeInput } from '@feature-shared-models';
import { StringUtility } from '@utilities';

const feature = ProductModule.feature;

@Controller({ tags: 'product', path: 'product', feature })
export class ProductController extends BaseFeatureController {
    @Post(ProductApiConfiguration.productsPost().restOptions, feature)
    async getProductsPost(@Body() input: ProductsGetInput, @Req() request: FastifyRequest): Promise<ProductResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<ProductService>(request, ProductService);

        const { filter, pagination, sortBy } = input;

        return await service.getProducts(filter, pagination, sortBy, requestContext, request);
    }

    @Get(ProductApiConfiguration.products().restOptions, feature)
    async getProducts(@Query() query: ProductResultSetQuery, @Req() request: FastifyRequest): Promise<ProductResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<ProductService>(request, ProductService);

        const { filter, pagination, sortBy } = this.processResultSetQuery(query);

        return await service.getProducts(filter, pagination, sortBy, requestContext, request);
    }

    @Get(ProductApiConfiguration.product().restOptions, feature)
    async getProduct(
        @Param(ProductRequestParameters.identifier.id) identifierValue: string,
        @Query(ProductRequestParameters.idType.id) idType: string,
        @Req() request: FastifyRequest,
    ): Promise<Product> {
        const { requestContext, service } = this.getRequestContextAndService<ProductService>(request, ProductService);

        let id, identifier, slug;

        slug = identifierValue;

        if (StringUtility.isStringNotEmpty(idType)) {
            idType = idType.toLowerCase();

            if ('id' == idType) {
                id = identifierValue;
            } else if ('slug' == idType) {
                slug = identifierValue;
            } else if ('identifier' == idType) {
                identifier = identifierValue;
            }
        }

        return await service.getProduct(id, identifier, slug, requestContext, request);
    }

    protected processResultSetQuery(query: ProductResultSetQuery): ProductResultSetQueryType {
        const methodname = `${ProductController.name}.processResultSetQuery`;

        const q = super.processResultSetQuery(query) as ProductResultSetQueryType;

        q.filter = {
            term: query.term,
            category: {
                identifiers: [],
                ids: [],
                slugs: [],
            },
            product: {
                identifiers: [],
                ids: [],
                slugs: [],
            },
            facets: [],
        };

        this.addItemIdentifierToResultSetQuery(query.productIdentifiers, q.filter.product.identifiers);
        this.addItemIdentifierToResultSetQuery(query.productIds, q.filter.product.ids);
        this.addItemIdentifierToResultSetQuery(query.productSlugs, q.filter.product.slugs);

        this.addItemIdentifierToResultSetQuery(query.categoryIdentifiers, q.filter.category.identifiers);
        this.addItemIdentifierToResultSetQuery(query.categoryIds, q.filter.category.ids);
        this.addItemIdentifierToResultSetQuery(query.categorySlugs, q.filter.category.slugs);

        if (query.facets) {
            const rangeKey = 'range_';

            query.facets.forEach((facetStr) => {
                const arr = facetStr.split(':');

                let isValidFacetInput = false;

                if (arr.length > 1) {
                    const facet: FacetInput = {
                        id: arr[0],
                    };

                    const vals = arr[1].split(',');

                    if (vals.length > 0) {
                        isValidFacetInput = true;

                        if (vals[0].startsWith(rangeKey)) {
                            const ranges: FacetRangeInput[] = [];

                            vals.forEach((val) => {
                                const valArr = val.replace(rangeKey, '').split('-');

                                if (valArr.length > 1) {
                                    const range: FacetRangeInput = {
                                        from: valArr[0],
                                        to: valArr[1],
                                    };

                                    ranges.push(range);
                                }
                            });

                            facet.ranges = ranges;
                        } else {
                            facet.values = vals;
                        }
                    }

                    q.filter.facets.push(facet);
                }

                if (!isValidFacetInput) {
                    this.logger.info(`${methodname} - Invalid facet input: ${facetStr}`);
                }
            });
        }

        return q;
    }
}
