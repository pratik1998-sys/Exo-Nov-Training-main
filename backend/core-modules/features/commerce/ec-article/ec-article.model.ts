import { InputType, ObjectType } from '@nestjs/graphql';
import { Field } from '@api-decorators';
import { Product } from '@feature-commerce/product';
import { Article, ArticleFilter, ArticleResultSet, ArticleResultSetQuery } from '@feature-article';

@InputType({ description: 'Commerce Article Filter' })
export class ECArticleFilter extends ArticleFilter { }

@ObjectType({ description: 'Commerce Article' })
export class ECArticle extends Article {
    @Field({ type: () => [Product], description: 'products associated with the article' })
    products?: Product[];
}

@ObjectType({ description: 'Commerce Article Result Set' })
export class ECArticleResultSet extends ArticleResultSet {
    @Field({ type: () => [ECArticle], description: 'articles' })
    results?: ECArticle[];
}

export class ECArticleResultSetQuery extends ArticleResultSetQuery { }