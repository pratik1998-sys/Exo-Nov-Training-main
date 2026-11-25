import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Article, ArticleResultSet, ArticleResultSetQuery } from './article.model';
import { FeatureControllerTestHarness } from '@feature/testing';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

describe('ArticleController', () => {
    let harness: FeatureControllerTestHarness;
    let controller: ArticleController;

    let mockArticleService: {
        getArticles: ReturnType<typeof vi.fn>;
        getArticle: ReturnType<typeof vi.fn>;
    };

    function buildRequest(overrides?: Partial<{ requestContext: unknown }>) {
        const requestContext = harness.requestContext(overrides as any);
        return { raw: { requestContext } } as any;
    }

    beforeEach(async () => {
        harness = await FeatureControllerTestHarness.create({
            featureId: 'article',
            consumerIds: ['site-1'],
        });

        mockArticleService = {
            getArticles: vi.fn(),
            getArticle: vi.fn(),
        };

        controller = harness.createController(ArticleController, {
            service: mockArticleService,
        });
    });

    describe('articles', () => {
        it('returns result set from service.getArticles', async () => {
            const query: ArticleResultSetQuery = { page: 1, pageSize: 10 } as any;
            const resultSet: ArticleResultSet = {
                results: [
                    {
                        id: '1',
                        name: 'Guide',
                        summary: 'Summary',
                        description: 'Description',
                        image: {} as any,
                        readTime: 5,
                        colorTheme: 'blue',
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

            const request = buildRequest();
            const result = await controller.articles(request, query);

            expect(mockArticleService.getArticles).toHaveBeenCalledWith(
                expect.any(Object),
                expect.any(Object),
                expect.any(Object),
                request,
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

            const request = buildRequest();
            const result = await controller.article('1', request);

            expect(mockArticleService.getArticle).toHaveBeenCalledWith(
                '1',
                expect.any(Object),
                request,
            );
            expect(result).toEqual(article);
        });
    });
});
