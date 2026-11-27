-- Schema for the catalyst-static cart feature (CatalystStaticCartEntity, CatalystStaticCartItemEntity).
-- Safe to re-run: table creation is idempotent. No seed data.
-- cart_item.product_identifier points at public.product.identifier but has no foreign key on purpose:
-- yarn migrate:db runs the sql files in path order, so cart/ runs before product/ on a fresh database.
CREATE TABLE IF NOT EXISTS public.cart (
    id         SERIAL PRIMARY KEY,
    identifier VARCHAR(64)  NOT NULL UNIQUE,
    created_on TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_on TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cart_item (
    id                 SERIAL PRIMARY KEY,
    cart_id            INTEGER     NOT NULL REFERENCES public.cart (id) ON DELETE CASCADE,
    product_identifier VARCHAR(64) NOT NULL,
    quantity           INTEGER     NOT NULL CHECK (quantity > 0),
    UNIQUE (cart_id, product_identifier)
);
