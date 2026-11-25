import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PluginServiceTestHarness } from '@plugin/testing';
import { AdobeAEMArticleServiceImpl } from './adobe-aem.article.service';
import type { PaginationInput } from '@feature/models';
import type { RequestContext } from '@context/request';

describe('AdobeAEMArticleServiceImpl', () => {
    let harness: PluginServiceTestHarness;

    beforeEach(async () => {
        harness = await PluginServiceTestHarness.create({
            pluginId: 'adobe-aem',
            featureId: 'article',
            consumerIds: ['site-1'],
            consumerConfiguration: {
                graphqlPath_Commons: '/graphql/execute.json/commons',
            },
        });
    });

    it('getArticles delegates to datasource + mapper', async () => {
        const mockDatasource = {
            getArticles: vi.fn().mockResolvedValue({
                data: {
                    buyingGuideList: {
                        items: [
                            { _path: '/content/dam/x/cf/buying_guides/buying_guide_01', name: 'Guide 01' },
                        ],
                    },
                },
            }),
            getArticleByPath: vi.fn(),
        };

        const mockMapper = {
            mapArticles: vi.fn().mockReturnValue({
                pagination: {
                    page: 1,
                    pageSize: 1,
                    pageCount: 1,
                    resultCount: 1,
                    hasMorePages: false,
                },
                results: [
                    { id: 'article_01', name: 'Guide 01' },
                ],
            }),
            mapArticle: vi.fn(),
        };

        const service = harness.createService(AdobeAEMArticleServiceImpl, {
            componentId: 'adobe-aem.article.service',
            datasource: mockDatasource,
            mapper: mockMapper,
            buildAppCFPath: () => '/content/dam/dxp/kaanapali/cf',
        });

        const requestContext: RequestContext = harness.requestContext();
        const pagination: PaginationInput = { page: 1, pageSize: 10 } as any;

        const result = await service.getArticles(
            {},
            pagination,
            requestContext,
        );

        expect(mockDatasource.getArticles).toHaveBeenCalledWith(
            requestContext,
            undefined,
        );
        expect(mockMapper.mapArticles).toHaveBeenCalledWith(
            requestContext,
            expect.any(Array),
        );
        expect(result).toEqual(mockMapper.mapArticles.mock.results[0].value);
    });

    it('getArticle delegates to datasource + mapper', async () => {
        const mockDatasource = {
            getArticles: vi.fn(),
            getArticleByPath: vi.fn().mockResolvedValue({
                data: {
                    buyingGuideByPath: {
                        item: {
                            _path: '/content/dam/x/cf/buying_guides/buying_guide_01',
                            name: 'Guide 01',
                        },
                    },
                },
            }),
        };

        const mockMapper = {
            mapArticles: vi.fn(),
            mapArticle: vi.fn().mockReturnValue({
                id: 'article_01',
                name: 'Guide 01',
            }),
        };

        const service = harness.createService(AdobeAEMArticleServiceImpl, {
            componentId: 'adobe-aem.article.service',
            datasource: mockDatasource,
            mapper: mockMapper,
            buildAppCFPath: () => '/content/dam/dxp/kaanapali/cf',
        });

        const requestContext: RequestContext = harness.requestContext();
        const result = await service.getArticle(
            'article_01',
            requestContext,
        );

        expect(mockDatasource.getArticleByPath).toHaveBeenCalledWith(
            requestContext,
            'article_01',
        );
        expect(mockMapper.mapArticle).toHaveBeenCalledWith(
            requestContext,
            expect.any(Object),
        );
        expect(result).toEqual(mockMapper.mapArticle.mock.results[0].value);
    });
});
