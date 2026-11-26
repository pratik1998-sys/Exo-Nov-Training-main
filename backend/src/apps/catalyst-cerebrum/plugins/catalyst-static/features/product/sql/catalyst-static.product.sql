-- Schema + seed data for the catalyst-static product plugin (CatalystStaticProductEntity).
-- Safe to re-run: table creation and inserts are idempotent.
CREATE TABLE IF NOT EXISTS public.product (
    id          SERIAL PRIMARY KEY,
    identifier  VARCHAR(64)   NOT NULL UNIQUE,
    slug        VARCHAR(255)  NOT NULL UNIQUE,
    sku         VARCHAR(64)   NOT NULL,
    name        VARCHAR(255)  NOT NULL,
    description VARCHAR(1024),
    price       NUMERIC(12,2) NOT NULL,
    list_price  NUMERIC(12,2),
    category    VARCHAR(128)
);

INSERT INTO public.product (identifier, slug, sku, name, description, price, list_price, category) VALUES ('p-001', 'classic-cotton-tee', 'TEE-001', 'Classic Cotton Tee', 'Soft everyday crew-neck tee.', '24.00', NULL, 'Apparel') ON CONFLICT (identifier) DO NOTHING;
INSERT INTO public.product (identifier, slug, sku, name, description, price, list_price, category) VALUES ('p-002', 'everyday-sneakers', 'SNK-002', 'Everyday Sneakers', 'Lightweight sneakers for all-day wear.', '69.00', '85.00', 'Footwear') ON CONFLICT (identifier) DO NOTHING;
INSERT INTO public.product (identifier, slug, sku, name, description, price, list_price, category) VALUES ('p-003', 'canvas-tote-bag', 'BAG-003', 'Canvas Tote Bag', 'Sturdy canvas tote with inner pocket.', '18.00', NULL, 'Accessories') ON CONFLICT (identifier) DO NOTHING;
INSERT INTO public.product (identifier, slug, sku, name, description, price, list_price, category) VALUES ('p-004', 'linen-button-down', 'SHT-004', 'Linen Button-Down', 'Breathable linen shirt for warm days.', '58.00', NULL, 'Apparel') ON CONFLICT (identifier) DO NOTHING;
INSERT INTO public.product (identifier, slug, sku, name, description, price, list_price, category) VALUES ('p-005', 'slim-chino-pants', 'PNT-005', 'Slim Chino Pants', 'Stretch cotton chinos with a slim fit.', '52.00', NULL, 'Apparel') ON CONFLICT (identifier) DO NOTHING;
INSERT INTO public.product (identifier, slug, sku, name, description, price, list_price, category) VALUES ('p-006', 'merino-crew-neck', 'KNT-006', 'Merino Crew Neck', 'Fine-gauge merino wool sweater.', '89.00', '110.00', 'Apparel') ON CONFLICT (identifier) DO NOTHING;
INSERT INTO public.product (identifier, slug, sku, name, description, price, list_price, category) VALUES ('p-007', 'scented-candle-set', 'CND-007', 'Scented Candle Set', 'Set of three soy wax candles.', '32.00', NULL, 'Home') ON CONFLICT (identifier) DO NOTHING;
INSERT INTO public.product (identifier, slug, sku, name, description, price, list_price, category) VALUES ('p-008', 'leather-wallet', 'WLT-008', 'Leather Wallet', 'Slim bifold wallet in full-grain leather.', '45.00', NULL, 'Accessories') ON CONFLICT (identifier) DO NOTHING;
INSERT INTO public.product (identifier, slug, sku, name, description, price, list_price, category) VALUES ('p-009', 'wireless-earbuds-lite', 'EAR-009', 'Wireless Earbuds Lite', 'Compact earbuds with 20h battery life.', '39.00', NULL, 'Electronics') ON CONFLICT (identifier) DO NOTHING;
INSERT INTO public.product (identifier, slug, sku, name, description, price, list_price, category) VALUES ('p-010', 'fit-guide-tee', 'TEE-010', 'Fit Guide Tee', 'Tee with printed size guide on the hem.', '22.00', NULL, 'Apparel') ON CONFLICT (identifier) DO NOTHING;
INSERT INTO public.product (identifier, slug, sku, name, description, price, list_price, category) VALUES ('p-011', 'relaxed-denim-jacket', 'JKT-011', 'Relaxed Denim Jacket', 'Classic denim jacket, relaxed cut.', '95.00', NULL, 'Apparel') ON CONFLICT (identifier) DO NOTHING;
INSERT INTO public.product (identifier, slug, sku, name, description, price, list_price, category) VALUES ('p-012', 'high-rise-leggings', 'LEG-012', 'High-Rise Leggings', 'Supportive high-rise leggings.', '48.00', NULL, 'Apparel') ON CONFLICT (identifier) DO NOTHING;
INSERT INTO public.product (identifier, slug, sku, name, description, price, list_price, category) VALUES ('p-013', 'organic-cotton-hoodie', 'HOD-013', 'Organic Cotton Hoodie', 'Midweight hoodie in organic cotton.', '72.00', NULL, 'Apparel') ON CONFLICT (identifier) DO NOTHING;
INSERT INTO public.product (identifier, slug, sku, name, description, price, list_price, category) VALUES ('p-014', 'recycled-poly-backpack', 'BPK-014', 'Recycled Poly Backpack', 'Daypack made from recycled bottles.', '64.00', NULL, 'Accessories') ON CONFLICT (identifier) DO NOTHING;
INSERT INTO public.product (identifier, slug, sku, name, description, price, list_price, category) VALUES ('p-015', 'bamboo-sheets-set', 'SHE-015', 'Bamboo Sheets Set', 'Silky, breathable bamboo bed sheets.', '120.00', '150.00', 'Home') ON CONFLICT (identifier) DO NOTHING;
INSERT INTO public.product (identifier, slug, sku, name, description, price, list_price, category) VALUES ('p-016', 'winter-puffer-jacket', 'JKT-016', 'Winter Puffer Jacket', 'Warm, water-resistant puffer.', '149.00', '199.00', 'Apparel') ON CONFLICT (identifier) DO NOTHING;
INSERT INTO public.product (identifier, slug, sku, name, description, price, list_price, category) VALUES ('p-017', 'summer-sandal-pack', 'SND-017', 'Summer Sandal Pack', 'Two pairs of easy summer sandals.', '34.00', NULL, 'Footwear') ON CONFLICT (identifier) DO NOTHING;
INSERT INTO public.product (identifier, slug, sku, name, description, price, list_price, category) VALUES ('p-018', 'clearance-accessory-bundle', 'BND-018', 'Clearance Accessory Bundle', 'Mixed accessories at a bundle price.', '15.00', '40.00', 'Accessories') ON CONFLICT (identifier) DO NOTHING;
-- INSERT INTO public.product (identifier, slug, sku, name, description, price, category) VALUES ('p-999','db-only-test-product','DBONLY-999','DB ONLY Test Product','Exists only in Postgres','1.23','Test');
-- DELETE FROM public.product WHERE identifier = 'p-999';