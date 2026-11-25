import { ObjectType, InputType, registerEnumType } from '@nestjs/graphql';
import { Field, FieldType } from '@api-decorators';
import { Attachment, EntityFilterInput, Facet, FacetInput, Image, Money } from '@feature-shared-models';
import { Entity, Offer } from '@feature-commerce/common';
import { Category } from '@feature-commerce/category';
import { PaginationInput, ResultSet, SortByInput } from '@feature/models';
import { SearchableSortableResultSetQuery } from '@feature/controller/models';
import { ResultSetQueryType } from '@feature/controller/types';

const { integer, id, json } = FieldType;

export enum ProductType {
    BUNDLE = 'BUNDLE',
    CONFIGURABLE = 'CONFIGURABLE',
    SIMPLE = 'SIMPLE',
}
registerEnumType(ProductType, { name: 'ProductType' });

@ObjectType({ description: ' Product Inventory' })
export class ProductInventory {
    @Field({ description: 'inventory value' }, integer)
    value: number;

    @Field({ description: 'inventory status' })
    status: string;
}

@ObjectType({ description: 'Product Attribute Value' })
export class ProductAttributeValue {
    @Field({ description: 'attribute value id' })
    id: string;

    @Field({ description: 'attribute value identifier' })
    identifier?: string;

    @Field({ description: 'attribute value' })
    value: string;
}

@ObjectType({ description: 'Product attribute' })
export class ProductAttribute {
    @Field({ description: 'attribute id' })
    id: string;

    @Field({ description: 'attribute identifier' })
    identifier?: string;

    @Field({ description: 'attribute name' })
    name?: string;

    @Field({ type: () => Boolean, description: 'Does this attribute resolve a sku' })
    isDefining?: boolean;

    @Field({ type: () => Boolean, description: 'Can this attribute be used to compare products' })
    isComparable?: boolean;

    @Field({ type: () => [ProductAttributeValue], description: 'attribute values - if multiple values, use values' })
    values: ProductAttributeValue[];

    @Field({ type: () => ProductAttributeValue, description: 'attribute value - if single value, use value' })
    value: ProductAttributeValue;
}

@ObjectType({ description: 'Product Price' })
export class ProductQuantityRange {
    @Field({ description: 'minimum quantity' }, integer)
    minimum?: number;

    @Field({ description: 'maximum quantity' }, integer)
    maximum?: number;
}

@ObjectType({ description: 'Product Price' })
export class ProductPrice {
    @Field({ description: 'price identifier' })
    identifier?: string;

    @Field({ type: () => ProductQuantityRange, description: 'price quantity range' })
    quantity?: ProductQuantityRange;

    @Field({ type: () => Money, description: 'The list price for a product. Ex: MSRP' })
    list?: Money;

    @Field({ type: () => Money, description: 'The offered price for a product' })
    offer?: Money;
}

@ObjectType({ description: ' Product Quantity Rules' })
export class ProductQuantity {
    @Field({ description: 'minimum quantity' }, integer)
    minimum: number;

    @Field({ description: 'maximum quantity' }, integer)
    maximum: number;

    @Field({ description: 'quantity steps' }, integer)
    step: number;
}

@ObjectType({ description: ' Product Option Value' })
export class ProductOptionValue {
    @Field({ description: 'option id' }, id)
    id?: string;

    @Field({ description: 'identifier' })
    identifier?: string;

    @Field({ description: 'description' })
    description?: string;

    @Field({ type: () => [String], description: 'sku list' })
    skus?: string[];

    @Field({ type: () => Boolean, description: 'is default' })
    isDefault?: boolean;
}

@ObjectType({ description: ' Product Option' })
export class ProductOption {
    @Field({ description: 'option id' }, id)
    id?: string;

    @Field({ description: 'identifier' })
    identifier?: string;

    @Field({ description: 'description' })
    description?: string;

    @Field({ description: 'option type' })
    type?: string;

    @Field({ type: () => [ProductOptionValue], description: 'option values' })
    values: ProductOptionValue[];
}

@ObjectType({ description: ' Product' })
export class Product {
    @Field({ description: 'product id' }, id)
    id?: string;

    @Field({ description: 'identifier' })
    identifier?: string;

    @Field({ description: 'slug used for SEO' })
    slug?: string;

    @Field({ description: 'default sku of the product' })
    sku?: string;

    @Field({ description: 'name of the product' })
    name?: string;

    @Field({ description: 'short description of the product' })
    description?: string;

    @Field({ description: 'long description of the product' })
    longDescription?: string;

    @Field({ type: () => Entity, description: 'product manufacturer' })
    manufacturer?: Entity;

    @Field({ type: () => Entity, description: 'product brand' })
    brand?: Entity;

    @Field({ type: () => Image, description: 'thumbnail image of the product' })
    thumbnail?: Image;

    @Field({ type: () => [Image], description: 'product images' })
    images?: Image[];

    @Field({ type: () => ProductPrice, description: 'price of the product' })
    price?: ProductPrice;

    @Field({ type: () => [ProductPrice], description: 'price of the product' })
    priceTiers?: ProductPrice[];

    @Field({ description: 'type of the product' })
    type?: string;

    @Field({ type: () => Product, description: 'parent of the product' })
    parent?: Product;

    @Field({ type: () => [Product], description: 'children of the product' })
    children?: Product[];

    @Field({ type: () => [Category], description: 'parent categories of the product' })
    categories?: Category[];

    @Field({ type: () => [ProductAttribute], description: 'list of product attributes' }, json)
    attributes?: Record<string, ProductAttribute>;

    @Field({ type: () => [ProductAttribute], description: 'list of product attributes' })
    attributeList?: ProductAttribute[];

    @Field({ type: () => [Attachment], description: 'attachments on the product' })
    attachments?: Attachment[];

    @Field({ type: () => [Product], description: 'related products of the product' })
    relatedProducts?: Product[];

    @Field({ type: () => [Product], description: 'cross sell products of the product' })
    crossSellProducts?: Product[];

    @Field({ type: () => [Product], description: 'up sell products of the product' })
    upSellProducts?: Product[];

    @Field({ type: () => [ProductOffer], description: 'offers associated to product' })
    offers?: ProductOffer[];

    @Field({ type: () => ProductQuantity, description: 'product quantity rules' })
    quantity?: ProductQuantity;

    @Field({ type: () => [ProductOption], description: 'product options' })
    options?: ProductOption[];

    @Field({ type: () => Boolean, description: 'can be purchased' })
    isPurchasable?: boolean;

    @Field({ type: () => ProductInventory, description: 'product inventory' })
    inventory?: ProductInventory;
}

@ObjectType({ description: 'Product Offer' })
export class ProductOffer extends Offer {
    @Field({ type: () => [Product], description: 'Benefit products of an offer associated to a product' })
    products: Product[];
}

@InputType({ description: 'Product Filter' })
export class ProductFilterInput {
    @Field({ description: 'term to filter by' })
    term?: string;

    // /**
    //  * @todo remove in favor of category
    //  */
    // @Field({ type: [EntityFilterInput], description: 'categories to filter by'})
    // categories?: EntityFilterInput[];

    // /**
    //  * @todo remove in favor of product
    //  */
    // @Field({ type: [EntityFilterInput], description: 'products to filter by'})
    // products?: EntityFilterInput[];

    @Field({ type: () => EntityFilterInput, description: 'categories to filter by' })
    category?: EntityFilterInput;

    @Field({ type: () => EntityFilterInput, description: 'products to filter by' })
    product?: EntityFilterInput;

    @Field({ type: () => EntityFilterInput, description: 'skus to filter by' })
    sku?: EntityFilterInput;

    @Field({ type: () => [FacetInput], description: 'facets to filter by' })
    facets?: FacetInput[];
}

@ObjectType({ description: 'Commerce Product Result Set' })
export class ProductResultSet extends ResultSet<Product> {
    @Field({ type: () => [Product], description: 'List of products' })
    results?: Product[];

    @Field({ type: () => [Facet], description: 'Facets to filter on' })
    facets?: Facet[];
}

export class ProductsGetInput {
    @Field({ type: () => PaginationInput, description: 'Products filter' })
    filter: ProductFilterInput;

    @Field({ type: () => PaginationInput, description: 'Products pagination' })
    pagination: PaginationInput;

    @Field({ type: () => PaginationInput, description: 'Products sort' })
    sortBy: SortByInput;
}

export class ProductResultSetQuery extends SearchableSortableResultSetQuery {
    @Field({ description: 'product ids - comma delimited' })
    productIds?: string;

    @Field({ description: 'product slugs - comma delimited' })
    productSlugs?: string;

    @Field({ description: 'product identifiers - comma delimited' })
    productIdentifiers?: string;

    @Field({ description: 'category ids - comma delimited' })
    categoryIds?: string;

    @Field({ description: 'category slugs - comma delimited' })
    categorySlugs?: string;

    @Field({ description: 'category identifiers - comma delimited' })
    categoryIdentifiers?: string;

    @Field({ type: () => [String], description: 'Applied facets in format $facetId:$facetValue,$facetValue2' })
    facets?: string[];
}

export interface ProductResultSetQueryType extends ResultSetQueryType {
    filter?: ProductFilterInput;
}
