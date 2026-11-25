import { RequestContext } from '@context/request';
import { Article, ArticleResultSet } from '@feature-article';
import { BaseMapper } from '@plugin/mapper';

const pickText = (value: any): string | undefined => {
    if (!value) return undefined;
    return value.html ?? value.markdown ?? value.json ?? value.plaintext ?? undefined;
};

const getLastPathSegment = (fullPath: string | undefined): string | undefined => {
    if (!fullPath) return undefined;
    const parts = fullPath.split('/').filter(Boolean);
    return parts.length > 0 ? parts[parts.length - 1] : fullPath;
};

export class AdobeAEMArticleMapper extends BaseMapper {
    mapArticles(
        requestContext: RequestContext,
        dsResults: any[],
    ): ArticleResultSet {
        const resultSet: ArticleResultSet = {
            pagination: {
                page: 1,
                pageSize: dsResults.length,
                pageCount: 1,
                resultCount: dsResults.length,
                hasMorePages: false,
            },
            results: dsResults.map((node: any) =>
                this.mapArticle(requestContext, node),
            ),
        };

        return resultSet;
    }

    mapArticle(requestContext: RequestContext, dsNode: any): Article {
        const fullPath: string | undefined = dsNode?._path;

        let createdAt = null;

        if (dsNode?._metadata?._calendarMetadata?.length > 0) {
            createdAt = dsNode?._metadata?._calendarMetadata[0]?.find(metadata => metadata.name === 'jcr:created')?.value;
        }

        return {
            id: getLastPathSegment(fullPath),
            name: dsNode?.name,
            summary: pickText(dsNode?.summary),
            description: pickText(dsNode?.description),
            image: {
                url: dsNode?.image?._path,
            },
            readTime:
                dsNode?.readTime === null || dsNode?.readTime === undefined
                    ? undefined
                    : Math.round(Number(dsNode.readTime)),
            theme: dsNode?.colorTheme ?? undefined,
            type: dsNode?.type ?? undefined,
            createdAt
        };
    }
}
