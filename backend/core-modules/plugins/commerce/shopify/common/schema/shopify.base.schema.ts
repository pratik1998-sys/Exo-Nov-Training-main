export class ShopifyImage {
    altText?: string;
    height?: number;
    id?: string;
    originalSrc?: string;
    src?: string;
    width?: string;

    static gql = `
        altText
        height
        id
        originalSrc
        src
        width
    `;
}

export class ShopifyMediaImage {
    alt?: string;
    id?: string;
    image?: ShopifyImage;
    mediaContentType?: string;
    previewImage?: ShopifyImage;

    protected static readonly imageClass = ShopifyImage;

    static composeGQL() {
        return `
            alt
            id
            image {
                ${this.imageClass.gql}
            }
            mediaContentType
            previewImage {
                ${this.imageClass.gql}
            }
        `;
    }
}

export class ShopifySEO {
    description?: string;
    title?: string;

    static gql = `
        description
        title
    `;
}

export class ShopifyPageInfo {
    endCursor?: string;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    startCursor?: string;

    static gql = `
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
    `;
}

export interface ShopifyResultSetInput {
    first?: number;
    after?: number;
}

export class ShopifyResultSet {
    totalCount?: number;
    pageInfo?: ShopifyPageInfo;
    edges?: { cursor?: string; node?: any }[];

    static composeResultSetSchema(nodeSchema: string, hasTotalCount: boolean) {
        let query = `
            pageInfo {
                ${ShopifyPageInfo.gql}
            }
            edges {
                cursor
                node {
                    ${nodeSchema}
                }
            }
        `;

        if (hasTotalCount) {
            query = `
                ${query}
                totalCount
            `;
        }

        return query;
    }
}
