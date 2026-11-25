export class ShopifyPage {
    handle?: string;
    id?: string;
    onlineStoreUrl?: string;
    title?: string;
    body?: string;
    bodySummary?: string;
    createdAt?: string;
    trackingParameters?: string;
    updatedAt?: string;

    static baseGQL = `
        handle
        id
        onlineStoreUrl
        title
    `;

    static composeGQL() {
        return `
            ${this.baseGQL}
            body
            bodySummary
            createdAt
            trackingParameters
            updatedAt
        `;
    }

    static composeMenuGQL() {
        return this.baseGQL;
    }
}
