export type CatalystStaticProductRecord = {
    id: string;
    slug: string;
    sku: string;
    name: string;
    description: string;
    /** Price as a string to avoid rounding issues (matches the Money model). */
    price: string;
    listPrice?: string;
    category: string;
};

/**
 * Static product catalogue served by the Catalyst plugin (no commerce integration).
 * Slugs match the productSlugs referenced by CatalystECArticleData.
 */
export class CatalystStaticProductData {
    static currency = "USD";

    static products: CatalystStaticProductRecord[] = [
        { id: "p-001", slug: "classic-cotton-tee", sku: "TEE-001", name: "Classic Cotton Tee", description: "Soft everyday crew-neck tee.", price: "24.00", category: "Apparel" },
        { id: "p-002", slug: "everyday-sneakers", sku: "SNK-002", name: "Everyday Sneakers", description: "Lightweight sneakers for all-day wear.", price: "69.00", listPrice: "85.00", category: "Footwear" },
        { id: "p-003", slug: "canvas-tote-bag", sku: "BAG-003", name: "Canvas Tote Bag", description: "Sturdy canvas tote with inner pocket.", price: "18.00", category: "Accessories" },
        { id: "p-004", slug: "linen-button-down", sku: "SHT-004", name: "Linen Button-Down", description: "Breathable linen shirt for warm days.", price: "58.00", category: "Apparel" },
        { id: "p-005", slug: "slim-chino-pants", sku: "PNT-005", name: "Slim Chino Pants", description: "Stretch cotton chinos with a slim fit.", price: "52.00", category: "Apparel" },
        { id: "p-006", slug: "merino-crew-neck", sku: "KNT-006", name: "Merino Crew Neck", description: "Fine-gauge merino wool sweater.", price: "89.00", listPrice: "110.00", category: "Apparel" },
        { id: "p-007", slug: "scented-candle-set", sku: "CND-007", name: "Scented Candle Set", description: "Set of three soy wax candles.", price: "32.00", category: "Home" },
        { id: "p-008", slug: "leather-wallet", sku: "WLT-008", name: "Leather Wallet", description: "Slim bifold wallet in full-grain leather.", price: "45.00", category: "Accessories" },
        { id: "p-009", slug: "wireless-earbuds-lite", sku: "EAR-009", name: "Wireless Earbuds Lite", description: "Compact earbuds with 20h battery life.", price: "39.00", category: "Electronics" },
        { id: "p-010", slug: "fit-guide-tee", sku: "TEE-010", name: "Fit Guide Tee", description: "Tee with printed size guide on the hem.", price: "22.00", category: "Apparel" },
        { id: "p-011", slug: "relaxed-denim-jacket", sku: "JKT-011", name: "Relaxed Denim Jacket", description: "Classic denim jacket, relaxed cut.", price: "95.00", category: "Apparel" },
        { id: "p-012", slug: "high-rise-leggings", sku: "LEG-012", name: "High-Rise Leggings", description: "Supportive high-rise leggings.", price: "48.00", category: "Apparel" },
        { id: "p-013", slug: "organic-cotton-hoodie", sku: "HOD-013", name: "Organic Cotton Hoodie", description: "Midweight hoodie in organic cotton.", price: "72.00", category: "Apparel" },
        { id: "p-014", slug: "recycled-poly-backpack", sku: "BPK-014", name: "Recycled Poly Backpack", description: "Daypack made from recycled bottles.", price: "64.00", category: "Accessories" },
        { id: "p-015", slug: "bamboo-sheets-set", sku: "SHE-015", name: "Bamboo Sheets Set", description: "Silky, breathable bamboo bed sheets.", price: "120.00", listPrice: "150.00", category: "Home" },
        { id: "p-016", slug: "winter-puffer-jacket", sku: "JKT-016", name: "Winter Puffer Jacket", description: "Warm, water-resistant puffer.", price: "149.00", listPrice: "199.00", category: "Apparel" },
        { id: "p-017", slug: "summer-sandal-pack", sku: "SND-017", name: "Summer Sandal Pack", description: "Two pairs of easy summer sandals.", price: "34.00", category: "Footwear" },
        { id: "p-018", slug: "clearance-accessory-bundle", sku: "BND-018", name: "Clearance Accessory Bundle", description: "Mixed accessories at a bundle price.", price: "15.00", listPrice: "40.00", category: "Accessories" },
    ];
}
