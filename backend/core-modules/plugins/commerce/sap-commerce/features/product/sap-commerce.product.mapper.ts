import { RequestContext } from "@context/request";
import { Category } from "@feature-commerce/category";
import { Entity } from "@feature-commerce/common";
import { ProductResultSet, Product, ProductInventory, ProductPrice } from "@feature-commerce/product";
import { FacetInput, Facet, Image } from "@feature-shared-models";
import { components, GetProduct, GetProducts, SAPCommerceBaseMapper, SAPCommerceDatasourceConfiguration } from "@plugin-sap-commerce/common";
import { SAPCommerceProductDatasource } from "./sap-commerce.product.datasource";

export class SAPCommerceProductMapper extends SAPCommerceBaseMapper {
    mapProductResultSet(requestContext: RequestContext, dsProductResultSet: GetProducts.Response._200, facetInput: FacetInput[]): ProductResultSet {
        return {
            pagination: this.mapPagination(requestContext, dsProductResultSet),
            results: dsProductResultSet?.products?.map((dsProduct) => this.mapProduct(requestContext, dsProduct)),
            facets: this.mapFacets(requestContext, dsProductResultSet.facets, dsProductResultSet.breadcrumbs, facetInput),
        };
    }

    mapProduct(requestContext: RequestContext, dsProduct: GetProduct.Response._200): Product {
        const dsConfiguration = this.getDatasource(requestContext, SAPCommerceProductDatasource).getDatasourceConfig<SAPCommerceDatasourceConfiguration>(requestContext);

        const { mediaHost } = dsConfiguration;

        const product: Product =
            dsProduct ?
                {
                    id: dsProduct.code,
                    identifier: dsProduct.code,
                    slug: dsProduct.code,
                    name: dsProduct.name,
                    description: dsProduct.summary,
                    longDescription: dsProduct.description,
                    isPurchasable: dsProduct.purchasable,
                    images: dsProduct.images?.map((dsImage) => this.mapImage(requestContext, dsImage, mediaHost)),
                    thumbnail: this.mapImage(
                        requestContext,
                        dsProduct.images?.find((dsImage) => dsImage.format == 'thumbnail'),
                        mediaHost,
                    ),
                    price: this.mapPrice(requestContext, dsProduct.price),
                    priceTiers: dsProduct.volumePrices?.map((dsPrice) => this.mapPrice(requestContext, dsPrice)),
                    manufacturer: this.mapManufacturer(requestContext, dsProduct),
                    categories: dsProduct.categories?.map((dsCategory) => this.mapCategory(requestContext, dsCategory)),
                    inventory: this.mapInventory(requestContext, dsProduct.stock),
                }
                : {};

        return product;
    }

    protected mapInventory(requestContext: RequestContext, dsStock: components['schemas']['Stock']): ProductInventory {
        return dsStock ?
            {
                value: dsStock.stockLevel,
                status: dsStock.stockLevelStatus == 'inStock' ? 'AVAILABLE' : 'UNAVAILABLE',
            }
            : null;
    }

    protected mapCategory(requestContext: RequestContext, dsCategory: components['schemas']['Category']): Category {
        return dsCategory ?
            {
                id: dsCategory.code,
                identifier: dsCategory.code,
                slug: dsCategory.code,
                name: dsCategory.name,
            }
            : null;
    }

    protected mapManufacturer(requestContext: RequestContext, dsProduct: GetProduct.Response._200): Entity {
        return dsProduct?.manufacturer || dsProduct?.manufacturerAID || dsProduct.manufacturerTypeDescription ?
            {
                id: dsProduct?.manufacturerAID,
                identifier: dsProduct?.manufacturerAID,
                name: dsProduct.manufacturer || dsProduct.manufacturerTypeDescription,
                description: dsProduct.manufacturerTypeDescription || dsProduct.manufacturer,
            }
            : null;
    }

    //TODO: How to determine between a list (msrp) price and the offer price (what is actually being charged)
    protected mapPrice(requestContext: RequestContext, dsPrice: components['schemas']['Price']): ProductPrice {
        let price: ProductPrice = null;

        if (dsPrice) {
            price = {
                list: this.mapMoney(requestContext, dsPrice.value, dsPrice.currencyIso),
                offer: this.mapMoney(requestContext, dsPrice.value, dsPrice.currencyIso),
            };

            if (dsPrice.hasOwnProperty('maxQuantity') || dsPrice.hasOwnProperty('minQuantity')) {
                price.quantity = {
                    minimum: dsPrice.minQuantity,
                    maximum: dsPrice.maxQuantity,
                };
            }
        }

        return price;
    }

    protected mapImage(requestContext: RequestContext, dsImage: components['schemas']['Image'], mediaHost: string): Image {
        return dsImage ?
            {
                url: `${mediaHost}${dsImage.url}`,
                altText: dsImage.altText,
            }
            : null;
    }

    protected mapFacets(requestContext: RequestContext, dsFacets: components['schemas']['Facet'][], dsBreadcrumbs: components['schemas']['Breadcrumb'][], facetInputList: FacetInput[]) {
        const facets = dsFacets.map((dsFacet) => this.mapFacet(requestContext, dsFacet));

        const facetMap: Record<string, Facet> = {};

        facets.forEach((facet) => {
            facetMap[facet.id] = facet;
        });

        const breadcrumbMap: Record<string, components['schemas']['Breadcrumb'][]> = {};

        dsBreadcrumbs.forEach((dsBreadcrumb) => {
            if (!breadcrumbMap[dsBreadcrumb.facetCode]) {
                breadcrumbMap[dsBreadcrumb.facetCode] = [];
            }

            breadcrumbMap[dsBreadcrumb.facetCode].push(dsBreadcrumb);
        });

        Object.keys(breadcrumbMap).forEach((breadcrumbId) => {
            const dsCrumbs = breadcrumbMap[breadcrumbId];

            let facet: Facet;

            let isExisting = false;

            dsCrumbs.forEach((dsCrumb, i) => {
                if (i == 0) {
                    if (facetMap[dsCrumb.facetCode]) {
                        isExisting = true;
                        facet = facetMap[dsCrumb.facetCode];
                    } else {
                        isExisting = false;
                        facet = {
                            id: dsCrumb.facetCode,
                            label: dsCrumb.facetName,
                            values: [],
                        };
                    }
                }

                facet.values.push({
                    id: dsCrumb.facetValueCode,
                    label: dsCrumb.facetValueName,
                    isSelected: true,
                });
            });

            if (!isExisting) {
                facets.push(facet);
            }
        });

        return facets;
    }

    protected mapFacet(requestContext: RequestContext, dsFacet: components['schemas']['Facet']) {
        const facetId = dsFacet.category ? dsFacet.name : `z${dsFacet.name}`;

        const facet: Facet = {
            id: facetId,
            label: dsFacet.name,
            isMultiSelect: dsFacet.multiSelect,
            values: dsFacet.values.map((dsFacetValue) => {
                return {
                    id: dsFacetValue.name,
                    label: dsFacetValue.name,
                    count: dsFacetValue.count,
                    isSelected: false,
                };
            }),
        };

        return facet;
    }
}
