import { ObjectType, InputType } from '@nestjs/graphql';
import { ProductResultSet } from '@feature-commerce/product/product.model';
import { Field, FieldType } from '@api-decorators';
import { Image } from '@feature-shared-models';
import { ResultSet } from '@feature/models';
import { ResultSetQuery } from '@feature/controller/models';
import { ResultSetQueryType } from '@feature/controller/types';

const { integer, id } = FieldType;

@InputType({ description: 'Category Filter' })
export class CategoryFilterInput {
    @Field({ type: () => [String], description: 'category ids' })
    ids?: string[];

    @Field({ type: () => [String], description: 'category slugs' })
    slugs?: string[];

    @Field({ type: () => [String], description: 'category identifiers' })
    identifiers?: string[];
}

@ObjectType({ description: 'Commerce Category' })
export class Category {
    @Field({ description: 'category id' }, id)
    id?: string;

    @Field({ description: 'slug used for SEO' })
    slug?: string;

    @Field({ description: 'alternative id' })
    identifier?: string;

    @Field({ description: 'category name' })
    name?: string;

    @Field({ description: 'category description' })
    description?: string;

    @Field({ type: () => Image, description: 'category thumbnail image' })
    thumbnail?: Image;

    @Field({ type: () => [Image], description: 'category images' })
    images?: Image[];

    @Field({ type: () => Category, description: 'parent category' })
    parent?: Category;

    @Field({ type: () => [Category], description: 'Children categories' })
    children?: Category[];

    @Field({ description: 'category type' })
    type?: string;

    @Field({ type: () => ProductResultSet, description: 'Products associated to category' })
    products?: ProductResultSet;
}

@ObjectType({ description: 'Commerce Category Result Set' })
export class CategoryResultSet extends ResultSet<Category> {
    @Field({ type: () => [Category], description: 'List of categories' })
    results?: Category[];
}

export class CategoryQuery {
    @Field({ description: 'Identifier type: id, slug, or identifier' })
    idType: string;

    @Field({ description: 'Identifier type: id, slug, or identifier' }, integer)
    depth: number;

    @Field({ description: 'Category Pagination page' }, integer)
    categoryPage: number;

    @Field({ description: 'Category Pagination page size' }, integer)
    categoryPageSize: number;

    @Field({ description: 'Product Pagination page' }, integer)
    productPage: number;

    @Field({ description: 'Product Paginationpage size' }, integer)
    productPageSize: number;
}

export class CategoryResultSetQuery extends ResultSetQuery {
    @Field({ type: () => [String], description: 'category identifiers' })
    ids?: string[];

    @Field({ type: () => [String], description: 'category slugs' })
    slugs?: string[];

    @Field({ type: () => [String], description: 'category identifiers' })
    identifiers?: string[];

    @Field({ description: 'Identifier type: id, slug, or identifier' }, integer)
    depth: number;
}

export interface CategoryResultSetQueryType extends ResultSetQueryType {
    filter: CategoryFilterInput;
    depth: number;
}