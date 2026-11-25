import { Field, FieldType } from '@api-decorators';
import { ResultSetQuery } from '@feature/controller/models';
import { ResultSet } from '@feature/models';
import { Image } from '@feature-shared-models';
import { InputType, ObjectType } from '@nestjs/graphql';
import { Product } from '@feature-commerce/product';

const { id, integer } = FieldType;

@InputType({ description: 'Article Filter' })
export class ArticleFilter {
    @Field({ description: 'article type' })
    type?: string;
}

@ObjectType({ description: 'Article' })
export class Article {
    @Field({ description: 'article id' }, id)
    id?: string;

    @Field({ description: 'article identifier' })
    identifier?: string;

    @Field({ description: 'article name' })
    name?: string;

    @Field({ description: 'article summary' })
    summary?: string;

    @Field({ description: 'article description' })
    description?: string;

    @Field({ type: () => Image, description: 'article image', required: false })
    image?: Image;

    @Field({ description: 'article read time (minutes)' }, integer)
    readTime?: number;

    @Field({ description: 'article color theme' })
    theme?: string;

    @Field({ description: 'article type' })
    type?: string;

    @Field({ description: 'article created at' })
    createdAt?: string;
}

@ObjectType({ description: 'Article Result Set' })
export class ArticleResultSet extends ResultSet<Article> {
    @Field({ type: () => [Article], description: 'article results' })
    results?: Article[];
}

export class ArticleResultSetQuery extends ResultSetQuery {
    @Field({ description: 'article type' })
    type?: string;
}
