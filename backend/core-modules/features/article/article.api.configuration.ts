import { ApiConfiguration, ApiOperationDefinition, ApiOperationOptions } from '@api';
import { Article, ArticleResultSet } from './article.model';
import { ArticleRequestParameters } from './article.parameters';

export interface ArticleApiOperations {
    articles: ApiOperationDefinition;
    article: ApiOperationDefinition;
}

export class ArticleApiConfiguration extends ApiConfiguration {
    static operations: ArticleApiOperations = {
        articles: {
            id: 'articles',
            description: 'Get article result set',
            summary: 'Get article result set',
            isAuthRequired: false,
            restOptions: {
                apiOkResponseOptions: {
                    type: ArticleResultSet,
                },
                tags: [],
            },
            queryOptions: {
                required: false,
            },
        },
        article: {
            id: 'article',
            description: 'Get article by id',
            summary: 'Get article by id',
            isAuthRequired: false,
            restOptions: {
                isById: true,
                path: `:${ArticleRequestParameters.id.id}`,
                apiOkResponseOptions: {
                    type: Article,
                },
                tags: [],
            },
            queryOptions: {
                required: false,
            },
        },
    };

    static articles(): ApiOperationOptions {
        return this.composeOperationOptions(ArticleApiConfiguration.operations.articles);
    }

    static article(): ApiOperationOptions {
        return this.composeOperationOptions(ArticleApiConfiguration.operations.article);
    }
}
