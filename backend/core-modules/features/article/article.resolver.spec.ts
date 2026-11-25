import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Article, ArticleResultSet } from './article.model';
import type { PaginationInput } from '@feature/models';
import { FeatureResolverTestHarness } from '@feature/testing';
import { ArticleResolver } from './article.resolver';
import { ArticleService } from './article.service';

describe('ArticleResolver', () => {
    let harness: FeatureResolverTestHarness;
    let resolver: ArticleResolver;

    let mockArticleService: {
        getArticles: ReturnType<typeof vi.fn>;
        getArticle: ReturnType<typeof vi.fn>;
    };

    function buildContext(overrides?: Partial<{ requestContext: unknown }>) {
        const requestContext = harness.requestContext(overrides as any);
        return { raw: { requestContext } };
    }

    beforeEach(async () => {
        harness = await FeatureResolverTestHarness.create({
            featureId: 'article',
            consumerIds: ['site-1'],
        });

        mockArticleService = {
            getArticles: vi.fn(),
            getArticle: vi.fn(),
        };

        resolver = harness.createResolver(ArticleResolver, {
            service: mockArticleService,
        });
    });

    describe('articles', () => {
        it('returns result set from service.getArticles', async () => {
            const filter = { type: 'buying-guide' };
            const pagination: PaginationInput = { page: 1, pageSize: 10 };
            const resultSet: ArticleResultSet = {
                results: [
                    {
                        id: '1',
                        name: 'Guide',
                        summary: 'Summary',
                        description: 'Description',
                        image: {} as any,
                        readTime: 5,
                        theme: 'blue',
                    } as Article,
                ],
                pagination: {
                    page: 1,
                    pageSize: 10,
                    resultCount: 1,
                    pageCount: 1,
                    hasMorePages: false,
                },
            };

            mockArticleService.getArticles.mockResolvedValue(resultSet);

            const context = buildContext();
            const result = await resolver.articles(filter, pagination, context);

            expect(mockArticleService.getArticles).toHaveBeenCalledWith(
                filter,
                pagination,
                expect.any(Object),
                context,
            );
            expect(result).toEqual(resultSet);
        });
    });

    describe('article', () => {
        it('returns article from service.getArticle', async () => {
            const article: Article = {
                id: '1',
                name: 'Guide',
                summary: 'Summary',
                description: 'Description',
                image: {} as any,
                readTime: 5,
                colorTheme: 'blue',
            } as Article;

            mockArticleService.getArticle.mockResolvedValue(article);

            const context = buildContext();
            const result = await resolver.article('1', context);

            expect(mockArticleService.getArticle).toHaveBeenCalledWith(
                '1',
                expect.any(Object),
                context,
            );
            expect(result).toEqual(article);
        });
    });
});
