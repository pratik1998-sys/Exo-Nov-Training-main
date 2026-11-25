import { RequestContext } from "@context/request";
import { ShopifyBaseDatasource } from "@plugin-shopify/common";


export class ShopifyProductDatasource extends ShopifyBaseDatasource {
  // Shared fragment to ensure both single and plural fetches get the same detailed data
  private readonly PRODUCT_FIELDS = `
  id
  title
  handle
  description
  descriptionHtml
  vendor
  productType
  availableForSale
  priceRange {
  minVariantPrice {
    amount
    currencyCode
  }
}
  collections(first: 10) {
  edges {
    node {
      id
      title
      handle
    }
  }
}

  feature: metafield(namespace: "custom", key: "feature") {
    namespace
    key
    type
    value
  }

  options {
    id
    name
    values
  }

  images(first: 50) {
    edges {
      node {
        id
        url
        altText
        width
        height
      }
    }
  }

  variants(first: 100) {
    edges {
      node {
        id
        title
        sku
        availableForSale
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        selectedOptions { name value }

        image {
          id
          url
          altText
        }
        metafields(
          identifiers: [
            { namespace: "custom", key: "surface" }
            { namespace: "custom", key: "core" }
            { namespace: "custom", key: "upa_a_certified" }
            { namespace: "custom", key: "usap_certified" }
            { namespace: "custom", key: "class" }
            { namespace: "custom", key: "spin" }
            { namespace: "custom", key: "average_weight" }
            { namespace: "custom", key: "paddle_length" }
            { namespace: "custom", key: "pip_width" }
            { namespace: "custom", key: "grip_circumference" }
            { namespace: "custom", key: "grip_length" }
            { namespace: "custom", key: "type" }
          ]
        ) {
          namespace
          key
          type
          value

          reference {
            ... on Metaobject {
              id
              type
              handle
              fields { key value }
            }
          }

          references(first: 10) {
            edges {
              node {
                ... on Metaobject {
                  id
                  type
                  handle
                  fields { key value }
                }
              }
            }
          }
        }
      }
    }
  }
`;

  async getProducts(requestContext: RequestContext, first: number, after?: string) {
    return this.executeGQL(
      requestContext,
      {
        id: 'products',
        method: 'post',
        query: {
          queryId: 'products',
          query: `
                        query ProductsWithPagination($first: Int!, $after: String) {
                          products(first: $first, after: $after) {
                            nodes {
                                ${this.PRODUCT_FIELDS}
                            }
                            pageInfo {
                              hasNextPage
                              endCursor
                            }
                          }
                        }
                    `,
        },
      },
      {
        first,
        after: after ?? null,
      },
    );
  }

  /**
   * Fetches a single product by handle (slug) or ID
   */
  async getProduct(requestContext: RequestContext, id?: string, handle?: string) {
    const queryId = id ? 'productById' : 'productByHandle';

    // Ensure ID is formatted as a Shopify GID if it's just a numeric string
    const finalId = id && !id.startsWith('gid://') ? `gid://shopify/Product/${id}` : id;

    const gqlQuery =
      id ?
        `query GetProductById($id: ID!) {
                 product(id: $id) {
                    ${this.PRODUCT_FIELDS}
                 }
               }`
        : `query GetProductByHandle($handle: String!) {
                 productByHandle(handle: $handle) {
                    ${this.PRODUCT_FIELDS}
                 }
               }`;

    return this.executeGQL(
      requestContext,
      {
        id: queryId,
        method: 'post',
        query: {
          queryId: queryId,
          query: gqlQuery,
        },
      },
      id ? { id: finalId } : { handle },
    );
  }

  async getCollectionProducts(requestContext: RequestContext, handle: string, first = 24, after?: string | null, sortKey: string = 'PRICE', reverse: boolean = false) {
    return this.executeGQL(
      requestContext,
      {
        id: 'collectionProducts',
        method: 'post',
        query: {
          queryId: 'collectionProducts',
          query: `
          query getCollectionProducts(
            $handle: String!,
            $first: Int!,
            $after: String,
            $sortKey: ProductCollectionSortKeys!,
            $reverse: Boolean!
          ) {
            collection(handle: $handle) {
              id
              title
              image {
                id
                url
                altText
                width
                height
              }
              products(
                first: $first,
                after: $after,
                sortKey: $sortKey,
                reverse: $reverse
              ) {
                pageInfo {
                  hasNextPage
                  endCursor
                }
                edges {
                      cursor
                      node {
                        ${this.PRODUCT_FIELDS}
                      }
                    }
              }
            }
          }
        `,
        },
      },
      {
        handle,
        first,
        after: after ?? null,
        sortKey,
        reverse,
      },
    );
  }
}
