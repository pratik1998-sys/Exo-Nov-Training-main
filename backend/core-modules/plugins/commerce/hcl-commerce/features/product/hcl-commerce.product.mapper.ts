import { RequestContext } from "@context/request";
import { ProductResultSet, Product, ProductPrice, ProductAttribute, ProductAttributeValue } from "@feature-commerce/product";
import { Money, Facet, FacetValue } from "@feature-shared-models";
import { HCLCommerceBaseMapper } from "@plugin-hcl-commerce/common";

export class HCLCommerceProductMapper extends HCLCommerceBaseMapper {
    protected readonly priceTypes = {
        offer: 'Offer',
        list: 'Display',
    };

    mapProductResultSet(requestContext: RequestContext, dsProductResultSet: any): ProductResultSet {
        // const totalResults = dsProductResultSet.total || dsProductResultSet.recordSetTotal || 0;
        const products = dsProductResultSet.contents || dsProductResultSet.catalogEntryView || [];
        const facets = dsProductResultSet.facets || dsProductResultSet.facetView || [];

        //There's a HCL Bug!
        dsProductResultSet.recordSetCount = products.length;

        return {
            pagination: this.mapPagination(requestContext, dsProductResultSet),
            results: products.map((dsProduct) => this.mapProduct(requestContext, dsProduct)),
            facets: this.mapFacets(requestContext, facets),
        };
    }

    mapProduct(requestContext: RequestContext, dsProduct: any): Product {
        let product: Product = null;

        if (dsProduct) {
            product = {
                id: dsProduct.id ?? dsProduct.uniqueID,
                identifier: dsProduct.id ?? dsProduct.uniqueID,
                sku: dsProduct.id,
                name: dsProduct.name,
                isPurchasable: new Boolean(dsProduct.buyable).valueOf(),
                slug: dsProduct.partNumber,
                brand: {
                    id: dsProduct.manufacturer,
                    identifier: dsProduct.manufacturer,
                },
                description: dsProduct.shortDescription,
                longDescription: dsProduct.longDescription,
                thumbnail: {
                    url: dsProduct.thumbnail,
                },
                images: dsProduct.images?.map((dsImage) => {
                    return {
                        url: dsImage.fullImage,
                    };
                }),
                price: this.mapProductPrices(requestContext, dsProduct.price),
                attributes: this.mapProductAttributes(requestContext, dsProduct.attributes),
                relatedProducts: this.mapRelatedProducts(requestContext, dsProduct),
                type: dsProduct.type,
                parent: null,
                children: [],
                categories: [],
            };

            product.attributeList = Object.values(product.attributes);
        }

        return product;
    }

    mapProductPrices(requestContext: RequestContext, dsProductPrices: any) {
        const price: ProductPrice = {
            offer: {},
            list: {},
        };

        if (Array.isArray(dsProductPrices)) {
            dsProductPrices.forEach((dsProductPrice) => {
                if (this.priceTypes.offer == dsProductPrice.usage) {
                    price.offer = this.mapProductPrice(requestContext, dsProductPrice);
                } else if (this.priceTypes.list == dsProductPrice.usage) {
                    price.list = this.mapProductPrice(requestContext, dsProductPrice);
                }
            });
        } else {
            price.offer = this.mapProductPrice(requestContext, dsProductPrices.offer);
            price.list = this.mapProductPrice(requestContext, dsProductPrices.list);
        }

        return price;
    }

    protected mapRelatedProducts(requestContext: RequestContext, dsProduct: any): Product[] {
        const dsRelatedProducts = dsProduct.merchandisingAssociations?.filter((dsMerchandisingAssociation) => dsMerchandisingAssociation.associationType == 'RELATED-PRODUCTS') ?? [];

        const relatedProducts = dsRelatedProducts.map((dsRelatedProduct) => this.mapProduct(requestContext, dsRelatedProduct));

        return relatedProducts;
    }

    protected mapProductAttributes(requestContext: RequestContext, dsProductAttributes: any): Record<string, ProductAttribute> {
        const attributes: Record<string, ProductAttribute> = {};

        dsProductAttributes.forEach((dsProductAttribute) => {
            if (dsProductAttribute.storeDisplay && dsProductAttribute.displayable) {
                attributes[dsProductAttribute.identifier] = this.mapProductAttribute(requestContext, dsProductAttribute);
            }
        });

        return attributes;
    }

    protected mapProductAttribute(requestContext: RequestContext, dsProductAttribute: any): ProductAttribute {
        const attribute: ProductAttribute = {
            id: dsProductAttribute.identifier,
            identifier: dsProductAttribute.identifier,
            name: dsProductAttribute.name,
            isDefining: dsProductAttribute.usage === 'Defining',
            isComparable: dsProductAttribute.comparable,
            values: dsProductAttribute.values.map((dsProductAttributeValue) => this.mapProductAttributeValue(requestContext, dsProductAttributeValue)),
            value: null,
        };

        if (attribute.values.length == 1) {
            attribute.value = attribute.values[0];
        }

        return attribute;
    }

    protected mapProductAttributeValue(requestContext: RequestContext, dsProductAttributeValue: any): ProductAttributeValue {
        return {
            id: dsProductAttributeValue.identifier,
            identifier: dsProductAttributeValue.identifier,
            value: dsProductAttributeValue.value,
        };
    }

    mapProductPrice(requestContext: RequestContext, dsPrice: any): Money {
        return {
            currency: dsPrice.currency,
            value: dsPrice.value,
        };
    }

    mapFacets(requestContext: RequestContext, dsFacets: any[]): Facet[] {
        return dsFacets.map((dsFacet) => this.mapFacet(requestContext, dsFacet));
    }

    mapFacet(requestContext: RequestContext, dsFacet: any): Facet {
        return {
            id: dsFacet.name || dsFacet.id,
            label: dsFacet.displayName || dsFacet.label || dsFacet.name,
            type: dsFacet.facetType || 'text',
            isRange: dsFacet.facetType === 'range' || dsFacet.isRange || false,
            isMultiSelect: dsFacet.isMultiSelect !== false, // Default to true unless explicitly false
            values: this.mapFacetValues(requestContext, dsFacet.entry || dsFacet.values || []),
        };
    }

    mapFacetValues(requestContext: RequestContext, dsFacetValues: any[]): FacetValue[] {
        return dsFacetValues.map((dsFacetValue) => ({
            id: dsFacetValue.value || dsFacetValue.id,
            label: dsFacetValue.label || dsFacetValue.displayName || dsFacetValue.value,
            count: parseInt(dsFacetValue.count) || 0,
            isSelected: dsFacetValue.selected || false,
            range:
                dsFacetValue.range ?
                    {
                        from: dsFacetValue.range.from || dsFacetValue.range.min,
                        to: dsFacetValue.range.to || dsFacetValue.range.max,
                    }
                    : undefined,
        }));
    }
}
