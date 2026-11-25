import type { FacetInput } from "@feature-shared-models";

/** Filter passed from {@link HCLCommerceProductServiceImpl} to product datasources (REST or GraphQL). */
export interface HCLCommerceProductFilter {
    categoryId?: string;
    searchTerm?: string;
    ids?: string[];
    partnumbers?: string[];
    limit?: number;
    offset?: number;
    /** Facet filters — only sent on ProductView `byCategory` / `bySearchTerm` (see `filterFacets` query param). */
    facets?: string[];
}
