import { RequestContext } from "@context/request";
import { Product, ProductType } from "@feature-commerce/product";
import { ShopifyBaseMapper } from "@plugin-shopify/common";

/**
 * Maps a Shopify Storefront API product node onto the core EXO `Product` model.
 *
 * Only fields that exist on the core model are mapped. Brand / manufacturer are
 * intentionally NOT mapped yet - that is the next exercise.
 */
export class ShopifyProductMapper extends ShopifyBaseMapper {
    mapProduct(requestContext: RequestContext, node: any): Product {
        if (!node) return null;

        const imageEdges = node.images?.edges ?? [];
        const variantEdges = node.variants?.edges ?? [];

        const toImage = (image: any) => ({ url: image.url, altText: image.altText });

        return {
            id: node.id,
            identifier: node.handle,
            slug: node.handle,
            name: node.title,
            description: node.descriptionHtml,
            type: ProductType.SIMPLE,

            categories:
                node.collections?.edges?.map((edge) => ({
                    id: edge.node.id,
                    name: edge.node.title,
                    identifier: edge.node.handle,
                })) ?? [],

            thumbnail: imageEdges[0] ? toImage(imageEdges[0].node) : null,
            images: imageEdges.map((edge) => toImage(edge.node)),

            price: {
                offer: {
                    value: node.priceRange?.minVariantPrice?.amount ?? "0.00",
                    currency: node.priceRange?.minVariantPrice?.currencyCode,
                },
            },

            options:
                node.options?.map((opt) => ({
                    id: opt.id,
                    identifier: opt.name,
                    description: opt.name,
                    values: opt.values.map((val: string) => ({ identifier: val, description: val })),
                })) ?? [],

            // The Storefront API does not expose stock quantity, only availability.
            inventory: {
                value: 0,
                status: variantEdges[0]?.node?.availableForSale ? "IN_STOCK" : "OUT_OF_STOCK",
            },

            // Shopify variants are exposed as `children`. A cart line is added with a
            // variant's `identifier` (its Shopify id), so the frontend needs these.
            children: variantEdges.map((edge) => ({
                id: edge.node.id,
                identifier: edge.node.id,
                sku: edge.node.sku,
                name: edge.node.title,
                type: ProductType.SIMPLE,
                isPurchasable: edge.node.availableForSale,
                price: {
                    offer: { value: edge.node.price?.amount, currency: edge.node.price?.currencyCode },
                    list: edge.node.compareAtPrice
                        ? { value: edge.node.compareAtPrice.amount, currency: edge.node.compareAtPrice.currencyCode }
                        : { value: edge.node.price?.amount, currency: edge.node.price?.currencyCode },
                },
            })),

            isPurchasable: variantEdges.some((edge) => edge.node.availableForSale),
        } as Product;
    }
}
