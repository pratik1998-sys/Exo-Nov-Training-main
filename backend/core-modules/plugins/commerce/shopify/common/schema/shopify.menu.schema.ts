import { ShopifyCollection } from '../../features/category/shopify.category.schema';
import { ShopifyPage } from './shopify.page.schema';
import { ShopifyBlog } from './shopify.blog.schema';
import { ShopifyArticle } from './shopify.article.schema';
import { GraphqlDatasourceQuery } from '@plugin-datasource-graphql';

export class ShopifyMenuItem {
    id?: string;
    items?: ShopifyMenuItem[];
    resource?: ShopifyCollection | ShopifyArticle | ShopifyBlog | ShopifyPage;
    resourceId?: string;
    tags?: string[];
    title?: string;
    type?: string;
    url?: string;

    protected static readonly collectionClass = ShopifyCollection;
    protected static readonly pageClass = ShopifyPage;
    protected static readonly blogClass = ShopifyBlog;
    protected static readonly articleClass = ShopifyArticle;

    static composeGQL(depth: number, currentDepth: number = 0) {
        let query = ` 
            id   
            resourceId
            tags
            title
            type
            url
            resource {
                ... on Collection {
                    ${this.collectionClass.composeMenuGQL()}
                }
                ... on Page {
                    ${this.pageClass.composeMenuGQL()}
                }
                ... on Blog {
                    ${this.blogClass.composeMenuGQL()}
                }
                ... on Article {
                    ${this.articleClass.composeMenuGQL()}
                }
            }
        `;

        if (currentDepth < depth) {
            query = `
                ${query}
                items {
                    ${this.composeGQL(depth, (currentDepth += 1))}
                }
            `;
        }

        return query;
    }
}

export class ShopifyMenu {
    handle?: string;
    id?: string;
    items?: ShopifyMenuItem[];
    itemsCount?: number;
    title?: string;

    protected static readonly menuItemClass = ShopifyMenuItem;

    static composeGQL(depth: number) {
        return `
            handle
            id
            items {
                ${this.menuItemClass.composeGQL(depth)}
            }
            itemsCount
            title
        `;
    }
}

export interface ShopifyMenuInput {
    handle: string;
}

export class ShopifyMenuQuery {
    protected static readonly menuClass = ShopifyMenu;

    static getMenu = (depth: number): GraphqlDatasourceQuery => {
        return {
            queryId: 'menu',
            query: `query Menu($handle: String!) {
                menu(handle: $handle) {
                    ${this.menuClass.composeGQL(depth)}
                }
            }`,
        };
    };
}
