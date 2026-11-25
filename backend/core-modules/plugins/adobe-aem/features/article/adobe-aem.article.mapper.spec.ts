import { describe, it, expect, beforeEach } from 'vitest';
import { PluginMapperTestHarness } from '@plugin/testing';
import { AdobeAEMArticleMapper } from './adobe-aem.article.mapper';

describe('AdobeAEMArticleMapper', () => {
    let harness: PluginMapperTestHarness;

    beforeEach(async () => {
        harness = await PluginMapperTestHarness.create({
            pluginId: 'adobe-aem',
            featureId: 'article',
            consumerIds: ['site-1'],
        });
    });

    it('maps article nodes into an ArticleResultSet', () => {
        const mapper = harness.createMapper(AdobeAEMArticleMapper, {
            componentId: 'adobe-aem.article.mapper',
        });

        const dsResults = [
            {
                _path: '/content/dam/dxp/kaanapali/cf/buying_guides/buying_guide_01',
                name: "Matt's First Buying Guide",
                summary: { plaintext: 'Summary text' },
                description: { plaintext: 'Description text' },
                readTime: 0.0,
                colorTheme: null,
            },
        ];

        const requestContext = harness.requestContext();
        const mapped = mapper.mapArticles(
            requestContext,
            dsResults,
        );

        expect(mapped.pagination.resultCount).toBe(1);
        expect(mapped.results?.[0]).toMatchObject({
            id: 'buying_guide_01',
            name: "Matt's First Buying Guide",
            summary: 'Summary text',
            description: 'Description text',
            readTime: 0,
        });
    });
});
