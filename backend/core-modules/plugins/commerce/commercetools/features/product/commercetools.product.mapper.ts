import { RequestContext } from "@context/request";
import { ProductResultSet, Product, ProductOption, ProductOptionValue, ProductAttribute, ProductAttributeValue } from "@feature-commerce/product";
import { FacetInput, Facet, FacetValue } from "@feature-shared-models";
import { CommercetoolsBaseMapper, CommercetoolsConsumerConfiguration, CommercetoolsMoney } from "@plugin-commercetools/common";
import { CommercetoolsCategoryRegistry } from "../category/commercetools.category.registry";
import { CommercetoolsCategoryMapper } from "../category/commercetools.category.mapper";
import { CommercetoolsAttribute, CommercetoolsProduct, CommercetoolsProductAttribute, CommercetoolsProductAttributeTypes, CommercetoolsProductResultSet, CommercetoolsProductVariant } from "./schema/commercetools.product.schema";
import { CommercetoolsProductTypeRegistry } from "./commercetools.product.type.registry";
import { StringUtility } from "@utilities";


export class CommercetoolsProductMapper extends CommercetoolsBaseMapper {
    mapProductResultSet(requestContext: RequestContext, dsProductResultSet: CommercetoolsProductResultSet, facetsInput: FacetInput[]): ProductResultSet {
        const productResultSet: ProductResultSet = super.mapResultSet(requestContext, dsProductResultSet);

        productResultSet.facets = this.mapFacets(requestContext, dsProductResultSet.facets, facetsInput);

        return productResultSet;
    }

    mapFacets(requestContext: RequestContext, dsFacets: any, facetsInput: FacetInput[]): Facet[] {
        const facets: Facet[] = [];

        const facetInputMap: Record<string, FacetInput> = {};

        const { productFilterByStoreAttributeId } = this.getPluginConsumerConfiguration<CommercetoolsConsumerConfiguration>(requestContext).configuration;

        facetsInput?.forEach((facetInput) => {
            facetInputMap[facetInput.id] = facetInput;
        });

        if (dsFacets) {
            const dsFacetList = Object.keys(dsFacets);

            dsFacetList.forEach((dsFacetId) => {
                const dsFacet = dsFacets[dsFacetId];

                if (dsFacet.total > 0 && (StringUtility.isStringEmpty(productFilterByStoreAttributeId) || (StringUtility.isStringNotEmpty(productFilterByStoreAttributeId) && dsFacetId != `variants.attributes.${productFilterByStoreAttributeId}`))) {
                    facets.push(this.mapFacet(requestContext, dsFacetId, dsFacet, facetInputMap[dsFacetId]));
                }
            });
        }

        return facets;
    }

    mapFacet(requestContext: RequestContext, dsFacetId: string, dsFacet: any, facetInput: FacetInput): Facet {
        const categoryRegistry = this.getRegistry<CommercetoolsCategoryRegistry>(requestContext, CommercetoolsCategoryRegistry);
        const productTypeRegistry = this.getRegistry<CommercetoolsProductTypeRegistry>(requestContext, CommercetoolsProductTypeRegistry);

        const categoryFacetId = 'categories.id';
        const booleanType = 'boolean';
        const trueValue = 'T';

        const isCategoryFacet = categoryFacetId == dsFacetId;

        const facet: Facet = {
            id: dsFacetId,
            isMultiSelect: true,
            isRange: false,
            values: [],
        };

        let facetableAttribute: CommercetoolsAttribute;

        if (isCategoryFacet) {
            facet.label = 'CATEGORY';
        } else {
            facetableAttribute = productTypeRegistry.getFacetableAttribute(dsFacetId);
            facet.label = this.resolveLocaleFieldValue(requestContext, facetableAttribute.label);
        }

        facet.values = dsFacet.terms.map((dsTerm) => {
            const value: FacetValue = {
                id: dsTerm.term,
                count: dsTerm.productCount,
                isSelected: facetInput?.values.includes(dsTerm.term) ? true : false,
            };

            if (isCategoryFacet) {
                value.label = this.resolveLocaleFieldValue(requestContext, categoryRegistry.getCategory(dsTerm.term).name);
            } else {
                if (booleanType == facetableAttribute.type.name) {
                    value.label = dsTerm.term == trueValue ? 'YES' : 'NO';
                } else {
                    value.label = dsTerm.term;
                }
            }

            return value;
        });

        return facet;
    }

    mapResultSetEntity(requestContext: RequestContext, dsProduct: CommercetoolsProduct): Product {
        return this.mapProduct(requestContext, dsProduct);
    }

    mapProduct(requestContext: RequestContext, dsProduct: CommercetoolsProduct): Product {
        const categoryMapper = this.getCategoryMapper(requestContext);

        const dsAttributeDefinitionMap: Record<string, CommercetoolsAttribute> = this.getProductTypeRegistry(requestContext).getProductTypeAttributes(dsProduct.productType.id);

        const product: Product = {
            id: dsProduct.id,
            identifier: dsProduct.key,
            isPurchasable: true,
            sku: dsProduct.masterVariant?.sku,
            slug: this.resolveLocaleFieldValue(requestContext, dsProduct.slug),
            name: this.resolveLocaleFieldValue(requestContext, dsProduct.name),
            description: this.resolveLocaleFieldValue(requestContext, dsProduct.description),
            longDescription: this.resolveLocaleFieldValue(requestContext, dsProduct.description),
            type: dsProduct.productType.typeId,
            categories: dsProduct._categories?.map((dsCategory) => categoryMapper.mapCategory(requestContext, dsCategory)),
            children: [],
            attributes: this.mapAttributes(requestContext, dsProduct.attributes, dsAttributeDefinitionMap),
        };

        product.attributeList = Object.values(product.attributes);
        product.children = this.mapVariants(requestContext, dsProduct.masterVariant, dsProduct.variants, dsAttributeDefinitionMap);

        this.setVariantFieldsOnProduct(requestContext, product);
        this.setProductFieldsOnVariants(requestContext, product);

        this.mapOptions(requestContext, product);

        return product;
    }

    protected mapOptions(requestContext, product: Product) {
        product.options = [];

        const productOptionMap: Record<string, { productOption: ProductOption; productOptionValues: Record<string, ProductOptionValue> }> = {};

        product.children?.forEach((sku, i) => {
            sku.attributeList.forEach((attribute) => {
                if (attribute.isDefining) {
                    if (!productOptionMap[attribute.identifier]) {
                        productOptionMap[attribute.identifier] = {
                            productOption: {
                                id: attribute.identifier,
                                identifier: attribute.identifier,
                                description: attribute.name,
                                type: 'ATTRIBUTE',
                                values: [],
                            },
                            productOptionValues: {},
                        };
                    }

                    attribute.values.forEach((attributeValue) => {
                        if (!productOptionMap[attribute.identifier].productOptionValues[attributeValue.identifier]) {
                            productOptionMap[attribute.identifier].productOptionValues[attributeValue.identifier] = {
                                id: attributeValue.identifier,
                                identifier: attributeValue.identifier,
                                description: attributeValue.value,
                                isDefault: i == 0,
                                skus: [],
                            };
                        }

                        productOptionMap[attribute.identifier].productOptionValues[attributeValue.identifier].skus.push(sku.identifier);
                    });
                }
            });
        });

        Object.values(productOptionMap).forEach((obj) => {
            obj.productOption.values = Object.values(obj.productOptionValues);

            product.options.push(obj.productOption);
        });
    }

    protected mapAttributes(requestContext: RequestContext, dsAttributes: CommercetoolsProductAttribute[], dsAttributeDefinitionMap: Record<string, CommercetoolsAttribute>): Record<string, ProductAttribute> {
        const attributes: Record<string, ProductAttribute> = {};

        dsAttributes.forEach((dsAttribute) => {
            const attribute = this.mapAttribute(requestContext, dsAttribute, dsAttributeDefinitionMap);

            if (attribute) {
                attributes[attribute.identifier] = attribute;
            }
        });

        return attributes;
    }

    protected mapAttribute(requestContext: RequestContext, dsAttribute: CommercetoolsProductAttribute, dsAttributeDefinitionMap: Record<string, CommercetoolsAttribute>): ProductAttribute {
        const methodname = `${CommercetoolsProductMapper.name}.mapAttribute`;

        const dsAttributeDefinition = dsAttributeDefinitionMap[dsAttribute.name];

        let attribute: ProductAttribute = null;

        if (dsAttributeDefinition) {
            let attributeType = dsAttributeDefinition.type.name;

            const { text, boolean, number, money, date, enum: enm, reference, set, ltext } = CommercetoolsProductAttributeTypes;

            if (attributeType == set) {
                attributeType = dsAttributeDefinition.type.elementType.name;
            }

            if (CommercetoolsProductAttributeTypes[attributeType]) {
                attribute = {
                    id: dsAttribute.name,
                    identifier: dsAttribute.name,
                    name: this.resolveLocaleFieldValue(requestContext, dsAttributeDefinition.label),
                    isDefining: dsAttributeDefinition['attributeConstraint'] == 'CombinationUnique' || dsAttributeDefinition['attributeConstraint'] == 'Unique',
                    values: [],
                    value: null,
                };

                let { value: dsValues } = dsAttribute;

                dsValues = !Array.isArray(dsValues) ? [dsValues] : dsValues;

                dsValues.forEach((dsValue: any) => {
                    let dsValueId;

                    if (attributeType == ltext) {
                        dsValue = this.resolveLocaleFieldValue(requestContext, dsValue);
                    }
                    if (attributeType == boolean) {
                        dsValue = new Boolean(dsValue).toString();
                    } else if (attributeType == money) {
                        dsValue = this.mapMoney(requestContext, dsValue).value;
                    } else if (attributeType == reference) {
                        dsValue = dsValue.id;
                    } else if (attributeType == enm) {
                        dsValueId = dsValue.key;
                        dsValue = dsValue.label;
                    }

                    dsValueId = dsValueId ?? dsValue;

                    const attributeValue: ProductAttributeValue = {
                        id: dsValueId,
                        identifier: dsValueId,
                        value: dsValue,
                    };

                    attribute.values.push(attributeValue);
                });

                if (attribute.values.length == 1) {
                    attribute.value = attribute.values[0];
                }
            } else {
                this.logger.info(`${methodname} - Unknown attribute type [${attributeType}]`, requestContext);
            }
        }

        return attribute;
    }

    protected mapVariants(
        requestContext: RequestContext,
        dsMasterVariant: CommercetoolsProductVariant,
        dsVariants: CommercetoolsProductVariant[] = [],
        dsAttributeDefinitionMap: Record<string, CommercetoolsAttribute>,
    ) {
        if (dsMasterVariant) {
            dsVariants.unshift(dsMasterVariant);
        }

        return dsVariants.map((dsVariant) => this.mapVariant(requestContext, dsVariant, dsAttributeDefinitionMap));
    }

    //TODO - Harden pricing (embedded / standalone with list / offer)
    mapVariant(requestContext: RequestContext, dsVariant: CommercetoolsProductVariant, dsAttributeDefinitionMap: Record<string, CommercetoolsAttribute>): Product {
        const dsPrice: CommercetoolsMoney = dsVariant.prices.length > 0 ? dsVariant.prices[0].value : null;

        const variant: Product =
            dsVariant ?
                {
                    id: dsVariant.id,
                    identifier: dsVariant.sku,
                    images: this.mapImages(requestContext, dsVariant.images),
                    attributes: this.mapAttributes(requestContext, dsVariant.attributes, dsAttributeDefinitionMap),
                    price: {
                        list: this.mapMoney(requestContext, dsPrice),
                        offer: this.mapMoney(requestContext, dsPrice),
                    },
                }
                : {};

        variant.thumbnail = variant.images.length > 0 ? variant.images[0] : {};

        variant.attributeList = Object.values(variant.attributes);

        return variant;
    }

    setVariantFieldsOnProduct(requestContext: RequestContext, product: Product, variant?: Product) {
        variant = (variant ?? product.children?.length > 0) ? product.children[0] : {};

        product.images = variant.images;
        product.thumbnail = variant.thumbnail;
        product.price = variant.price;

        product.attributes = {
            ...product.attributes,
            ...variant.attributes
        }

        product.attributeList = Object.values(product.attributes);
    }

    protected setProductFieldsOnVariants(requestContext: RequestContext, product: Product) {
        product.children.forEach((variant) => {
            variant.name = product.name;
            variant.description = product.description;
            variant.longDescription = product.description;
            variant.isPurchasable = product.isPurchasable;
            variant.slug = `${product.slug}:${variant.id}`;
        });
    }

    protected getProductTypeRegistry(requestContext: RequestContext) {
        return this.getRegistry<CommercetoolsProductTypeRegistry>(requestContext, CommercetoolsProductTypeRegistry);
    }

    protected getCategoryMapper(requestContext: RequestContext) {
        return this.getMapper<CommercetoolsCategoryMapper>(requestContext, CommercetoolsCategoryMapper);
    }
}
