/**
 * Wishlist (shopping list) request/response types from the HCL Commerce Transaction REST OpenAPI
 * (**wishlist** tag / `WishlistHandler` schemas in the order-capture transaction bundle).
 *
 * @see https://help.hcl-software.com/commerce/9.1.0/restapi/code91/order-capture_transaction.html
 * @see https://help.hcl-software.com/commerce/9.1.0/restapi/refs/restview_openapi3.html
 */
import type { components } from "../../order/schema/hcl-commerce.order.schema";

/** `wishlist-wishlist` — GET @self style list container */
export type HCLCommerceWishlistListContainer = components["schemas"]["wishlist-wishlist"];

/** `wishlist-wishlist_item` — single wish list / gift list */
export type HCLCommerceWishlistGiftList = components["schemas"]["wishlist-wishlist_item"];

/** `wishlist-wishlist_item.item` — line in a wish list */
export type HCLCommerceWishlistLineItem = components["schemas"]["wishlist-wishlist_item.item"];

/** POST create body */
export type HCLCommerceWishlistCreateBody = components["schemas"]["com.ibm.commerce.rest.wishlist.handler.WishlistHandler.CreateBodyParameterDescription"];

export type HCLCommerceWishlistCreateItemBody =
    components["schemas"]["com.ibm.commerce.rest.wishlist.handler.WishlistHandler.CreateBodyParameterDescription.WishlistItemBodyDescription"];

/** PUT update body (metadata and/or line operations) */
export type HCLCommerceWishlistUpdateBody = components["schemas"]["com.ibm.commerce.rest.wishlist.handler.WishlistHandler.UpdateBodyParameterDescription"];

export type HCLCommerceWishlistUpdateItemBody =
    components["schemas"]["com.ibm.commerce.rest.wishlist.handler.WishlistHandler.UpdateBodyParameterDescription.WishlistItemBodyDescription"];

/** POST create response */
export type HCLCommerceWishlistWishListResponse = components["schemas"]["com.ibm.commerce.rest.wishlist.handler.WishlistHandler.WishListResponse"];

/** PUT update response */
export type HCLCommerceWishlistWishListUpdateResponse = components["schemas"]["com.ibm.commerce.rest.wishlist.handler.WishlistHandler.WishListUpdateResponse"];

export type HCLCommerceWishlistDeleteResponse = components["schemas"]["com.ibm.commerce.rest.wishlist.handler.WishlistHandler.DeleteWishListResponse"];

/** Common GET query parameters (aligned with storefront REST patterns in the same spec). */
export interface HCLCommerceWishlistQueryInput {
    responseFormat?: "xml" | "json";
    pageNumber?: number;
    pageSize?: number;
    currency?: string;
    /** Guest access when viewing a shared list */
    guestAccessKey?: string;
    addItem?: boolean;
}

export interface HCLCommerceWishlistUpdateQueryInput {
    addItem?: boolean;
}

