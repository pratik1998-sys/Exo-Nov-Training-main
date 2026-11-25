export class ShopifyArticle {
    handle?: string;
    id?: string;
    onlineStoreUrl?: string;
    title?: string;
    content?: string;
    contentHtml?: string;
    excerpt?: string;
    excerptHtml?: string;
    publishedAt?: string;
    tags?: string[];
    trackingParameters?: string;

    static baseGQL = `
        handle
        id
        onlineStoreUrl
        title
    `;

    static composeGQL() {
        return `
            ${this.baseGQL}
            content
            contentHtml
            excerpt
            excerptHtml
            publishedAt
            tags
            trackingParameters
        `;
    }

    static composeMenuGQL() {
        return this.baseGQL;
    }
}
