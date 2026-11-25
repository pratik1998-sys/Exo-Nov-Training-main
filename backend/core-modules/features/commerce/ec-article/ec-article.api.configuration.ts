import { ApiConfiguration, ApiOperationDefinition, ApiOperationOptions } from '@api';
import { ECArticle } from './ec-article.model';
import { ECArticleRequestParameters } from './ec-article.parameters';

export interface ECArticleApiOperations {
    article: ApiOperationDefinition;
    articles: ApiOperationDefinition;
}
export class ECArticleApiConfiguration extends ApiConfiguration {
    static operations: ECArticleApiOperations = {
        article: {
            id: 'article',
            description: 'Get article by id',
            summary: 'Get article by id',
            isAuthRequired: false,
            queryOptions: {
                required: false,
            },
            restOptions: {
                isById: true,
                path: `article/:${ECArticleRequestParameters.id.id}`,
                apiOkResponseOptions: {
                    type: ECArticle,
                }
            },
        },
        articles: {
            id: 'articles',
            description: 'Get articles',
            summary: 'Get articles',
            isAuthRequired: false,
            restOptions: {
                path: 'article',
                apiOkResponseOptions: {
                    type: ECArticle,
                },
                tags: [],
            },
            mutationOptions: {
                required: false,
            },
        },
    };

    static article(): ApiOperationOptions {
        return this.composeOperationOptions(this.operations.article);
    }

    static articles(): ApiOperationOptions {
        return this.composeOperationOptions(this.operations.articles);
    }
}
