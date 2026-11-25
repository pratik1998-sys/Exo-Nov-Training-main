import { RequestContext } from "@context/request";
import { AdobeCommerceBaseMapper } from "@plugin-adobe-commerce/common";
import { AdobeCommerceAggregation, AdobeCommerceConfigurableProduct, AdobeCommercePriceRange, AdobeCommerceProduct, AdobeCommerceProductImage, AdobeCommerceProductResult } from "./schema/adobe-commerce.product.schema";
import { AdobeCommerceConsumerConfiguration } from "@plugin-adobe-commerce/common";
import { Product, ProductAttribute, ProductFilterInput, ProductOption, ProductPrice, ProductResultSet, ProductType } from "@feature-commerce/product";
import { Facet, FacetValue, Image } from "@feature-shared-models";

export class AdobeCommerceProductMapper extends AdobeCommerceBaseMapper {
    mapProductResultSet(requestContext: RequestContext, dsProductResultSet: AdobeCommerceProductResult, filterInput: ProductFilterInput): ProductResultSet {
        const filterMap: Record<string, string[]> = {};

        filterMap['category_uid'] = filterInput.category?.ids;

        filterInput.facets?.forEach((facet) => {
            filterMap[facet.id] = facet.values;
        });

        const resultSet: ProductResultSet = {
            pagination: this.mapPagination(requestContext, dsProductResultSet.page_info, dsProductResultSet.total_count),
            results: dsProductResultSet.items.map((dsProduct) => this.mapProduct(requestContext, dsProduct)),
            facets: dsProductResultSet.aggregations ? dsProductResultSet.aggregations.map((dsAggregation) => this.mapFacet(requestContext, dsAggregation, filterMap)) : [],
        };

        return resultSet;
    }

    mapProduct(requestContext: RequestContext, dsProduct: AdobeCommerceProduct): Product {
        let product: Product = {};

        if (dsProduct) {
            product = {
                id: dsProduct.uid,
                identifier: dsProduct.sku,
                slug: dsProduct.url_key,
                name: dsProduct.name,
                description: dsProduct.short_description?.html,
                longDescription: dsProduct.description?.html,
                thumbnail: this.mapImage(requestContext, dsProduct.thumbnail),
                images: [this.mapImage(requestContext, dsProduct.image)],
                price: this.mapPrice(requestContext, dsProduct.price_range),
                crossSellProducts: dsProduct.crosssell_products?.map((dsCrosssellProduct) => this.mapProduct(requestContext, dsCrosssellProduct)),
                relatedProducts: dsProduct.related_products?.map((dsRelatedProduct) => this.mapProduct(requestContext, dsRelatedProduct)),
                attributes: this.mapAttributes(requestContext, dsProduct),
                type: this.mapProductType(requestContext, dsProduct),
                options: this.mapProductOptions(requestContext, dsProduct),
                isPurchasable: true,
            };

            product.attributeList = Object.values(product.attributes);
        }

        return product;
    }

    protected mapProductOptions(requestContext: RequestContext, dsProduct: AdobeCommerceProduct) {
        let options: ProductOption[] = [];

        if (dsProduct.type_id == 'configurable') {
            const dsConfigProduct = dsProduct as AdobeCommerceConfigurableProduct;

            options = dsConfigProduct.configurable_options?.map((dsOption) => {
                const option: ProductOption = {
                    id: dsOption.uid,
                    identifier: dsOption.attribute_code,
                    description: dsOption.label,
                    values: dsOption.values.map((value, i) => {
                        return {
                            id: value.uid,
                            identifier: value.uid,
                            description: value.label,
                            isDefault: i == 0,
                        };
                    }),
                };

                return option;
            });
        }

        return options;
    }

    protected mapProductType(requestContext: RequestContext, dsProduct: AdobeCommerceProduct): ProductType {
        const { type_id } = dsProduct;

        let type = ProductType.SIMPLE;

        if (type_id == 'configurable') {
            type = ProductType.CONFIGURABLE;
        } else if (type_id == 'bundle') {
            type = ProductType.BUNDLE;
        }

        return type;
    }

    protected mapImage(requestContext: RequestContext, dsImage: AdobeCommerceProductImage): Image {
        return dsImage ?
            {
                url: dsImage.url,
                altText: dsImage.label,
            }
            : {};
    }

    protected mapPrice(requestContext: RequestContext, dsPriceRange: AdobeCommercePriceRange): ProductPrice {
        return dsPriceRange?.minimum_price ?
            {
                list: {
                    value: `${dsPriceRange.minimum_price.regular_price.value}`,
                    currency: dsPriceRange.minimum_price.regular_price.currency,
                },
                offer: {
                    value: `${dsPriceRange.minimum_price.final_price.value}`,
                    currency: dsPriceRange.minimum_price.final_price.currency,
                },
            }
            : {
                list: {},
                offer: {},
            };
    }

    protected mapFacet(requestContext: RequestContext, dsAggregation: AdobeCommerceAggregation, filterMap: Record<string, string[]>): Facet {
        const { configuration } = this.getPluginConsumerConfiguration<AdobeCommerceConsumerConfiguration>(requestContext);

        const isRange = configuration.productRangeFacets && configuration.productRangeFacets.includes(dsAggregation.attribute_code);

        let facet: Facet = {};

        if (dsAggregation) {
            facet = {
                id: dsAggregation.attribute_code,
                label: dsAggregation.label,
                isMultiSelect: true,
                isRange: isRange,
                values: [],
            };

            dsAggregation.options.forEach((dsOption) => {
                const value: FacetValue = {
                    id: dsOption.value,
                    label: dsOption.label,
                    count: dsOption.count,
                    isSelected: filterMap[dsAggregation.attribute_code] && filterMap[dsAggregation.attribute_code].includes(dsOption.value) ? true : false,
                };

                if (isRange) {
                    const rangeArr = dsOption.value.split('_');

                    value.range = {
                        from: rangeArr[0],
                    };

                    if (rangeArr.length > 1) {
                        value.range.to = rangeArr[1];
                    }
                }

                facet.values.push(value);
            });
        }

        return facet;
    }

    protected mapAttributes(requestContext: RequestContext, dsProduct: AdobeCommerceProduct): Record<string, ProductAttribute> {
        const attributes: Record<string, ProductAttribute> = {};

        const { configuration } = this.getPluginConsumerConfiguration<AdobeCommerceConsumerConfiguration>(requestContext);

        if (configuration.productAttributes) {
            configuration.productAttributes.forEach((attribute: string) => {
                if (dsProduct[attribute]) {
                    attributes[attribute] = {
                        id: attribute,
                        values: [
                            {
                                id: dsProduct[attribute],
                                value: dsProduct[attribute],
                            },
                        ],
                        value: null,
                    };

                    if (attributes[attribute].values.length == 1) {
                        attributes[attribute].value = attributes[attribute].values[0];
                    }
                }
            });
        }

        return attributes;
    }
}
