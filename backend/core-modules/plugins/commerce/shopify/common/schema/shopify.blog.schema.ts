export class ShopifyBlog {
    handle?: string;
    id?: string;
    onlineStoreUrl?: string;
    title?: string;

    static baseGQL = `
        handle
        id
        onlineStoreUrl
        title
    `;

    static composeGQL() {
        return `
            ${this.baseGQL}
        `;
    }

    static composeMenuGQL() {
        return this.baseGQL;
    }
}
