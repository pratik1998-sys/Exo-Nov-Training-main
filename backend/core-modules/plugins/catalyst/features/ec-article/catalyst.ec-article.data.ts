import { CatalystArticleData, CatalystArticleRecord } from "../article/catalyst.article.data";

export type CatalystECArticleRecord = CatalystArticleRecord & {
    /** Product URL slugs referenced in the article and resolved by ECArticleService. */
    productSlugs: string[];
};

const productSlugsByArticleId: Record<string, string[]> = {
    'first-time-online-shopping': ['classic-cotton-tee', 'everyday-sneakers', 'canvas-tote-bag'],
    'capsule-wardrobe-basics': ['linen-button-down', 'slim-chino-pants', 'merino-crew-neck'],
    'gift-guide-under-50': ['scented-candle-set', 'leather-wallet', 'wireless-earbuds-lite'],
    'how-to-choose-the-right-size': ['fit-guide-tee', 'relaxed-denim-jacket', 'high-rise-leggings'],
    'sustainable-materials-101': ['organic-cotton-hoodie', 'recycled-poly-backpack', 'bamboo-sheets-set'],
    'seasonal-sale-shopping-tips': ['winter-puffer-jacket', 'summer-sandal-pack', 'clearance-accessory-bundle'],
};

export class CatalystECArticleData {
    static articles: CatalystECArticleRecord[] = CatalystArticleData.articles.map((article) => ({
        ...article,
        productSlugs: productSlugsByArticleId[article.id] ?? [],
    }));

    static getById(id: string): CatalystECArticleRecord | undefined {
        return this.articles.find((article) => article.id === id || article.identifier === id);
    }
}
