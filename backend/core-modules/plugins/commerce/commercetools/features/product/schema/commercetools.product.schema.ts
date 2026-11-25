import { CommercetoolsEntity, CommercetoolsImage, CommercetoolsLocaleField, CommercetoolsLocaleFieldList, CommercetoolsMoney, CommercetoolsReferenceField, CommercetoolsResultSet } from "@plugin-commercetools/common";
import { CommercetoolsCategory } from "@plugin-commercetools/features/category";

export interface CommercetoolsCategoryReference extends CommercetoolsReferenceField {
    obj: CommercetoolsCategory;
}

export interface CommercetoolsProductAttributeEnum {
    key: string;
    value: string;
}

export interface CommercetoolsProductAttribute {
    name: string;
    //value: boolean | string | string[] | number | number[] | CommercetoolsReferenceField | CommercetoolsReferenceField[] | CommercetoolsMoney | CommercetoolsMoney[] | CommercetoolsProductAttributeEnum | CommercetoolsProductAttributeEnum[];
    value: any;
}

export interface CommercetoolsProductPrice {
    id: string;
    value: CommercetoolsMoney;
}

export interface CommercetoolsProductVariant extends CommercetoolsEntity {
    key: string;
    sku: string;
    attributes: CommercetoolsProductAttribute[];
    assets: any[];
    images: CommercetoolsImage[];
    prices: CommercetoolsProductPrice[];
    isMatchingVariant: boolean;
    _name: string;
    _description: string;
    _slug: string;
}

export interface CommercetoolsProduct extends CommercetoolsEntity {
    productType: CommercetoolsReferenceField;
    name: CommercetoolsLocaleField;
    description: CommercetoolsLocaleField;
    categories: CommercetoolsCategoryReference[];
    _categories: CommercetoolsCategory[];
    categoryOrderHints: any;
    slug: CommercetoolsLocaleField;
    metaTitle: CommercetoolsLocaleField;
    metaDescription: CommercetoolsLocaleField;
    variants: CommercetoolsProductVariant[];
    masterVariant: CommercetoolsProductVariant;
    searchKeywords: CommercetoolsLocaleFieldList;
    attributes: CommercetoolsProductAttribute[];
    hasStagedChanges: boolean;
    published: boolean;
    key: string;
    priceMode: string;
}

export interface CommercetoolsAttribute {
    type: {
        name: string;
        elementType: {
            name: string;
        };
    };
    name: string;
    label: CommercetoolsLocaleField;
    isRequired: boolean;
    level: string;
    attributeContstraint: string;
    inputTip: CommercetoolsLocaleField;
    inputHint: string;
    isSearchable: boolean;
    _facetId: string;
}

export interface CommercetoolsProductType extends CommercetoolsEntity {
    key: string;
    name: string;
    description: string;
    attributes: CommercetoolsAttribute[];
    _attributeMap: Record<string, CommercetoolsAttribute>;
}

export interface CommercetoolsProductResultSet extends CommercetoolsResultSet {
    results: CommercetoolsProduct[];
    facets: any;
}

export interface CommercetoolsProductTypeResultSet extends CommercetoolsResultSet {
    results: CommercetoolsProductType[];
}

export const CommercetoolsProductAttributeTypes = {
    text: 'text',
    boolean: 'boolean',
    number: 'number',
    money: 'money',
    date: 'date',
    enum: 'enum',
    reference: 'reference',
    set: 'set',
    ltext: 'ltext',
};
