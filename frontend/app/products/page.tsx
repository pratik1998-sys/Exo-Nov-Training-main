import { gql } from '@/lib/gql';

export const dynamic = 'force-dynamic';

const QUERY = `
query Products {
  products(pagination: { pageSize: 24 }) {
    results {
      name
      slug
      description
      thumbnail { url altText }
      price {
        offer { value currency }
        list  { value currency }
      }
    }
  }
}`;

type Money = { value: string; currency: string } | null;

type Product = {
    name: string;
    slug: string;
    description: string | null;
    thumbnail: { url: string; altText: string | null } | null;
    price: { offer: Money; list: Money } | null;
};

function money(m: Money) {
    if (!m) return null;
    const n = Number(m.value);
    return `${m.currency} ${Number.isFinite(n) ? n.toFixed(2) : m.value}`;
}

export default async function ProductsPage() {
    const { data, error, endpoint } = await gql<{ products: { results: Product[] } }>(QUERY);
    const products = data?.products?.results ?? [];

    return (
        <>
            <h1>Products</h1>
            <p>Static catalogue served by the EXO BFF (<code>{endpoint}</code>) through the <code>product</code> feature.</p>

            {error && <pre style={{ color: '#dc2626', whiteSpace: 'pre-wrap' }}>{error}</pre>}

            {!error && products.length === 0 && <p className="muted">No products returned.</p>}

            <div className="product-grid">
                {products.map((p) => {
                    const offer = money(p.price?.offer ?? null);
                    const list = money(p.price?.list ?? null);

                    return (
                        <article className="product-card" key={p.slug}>
                            {p.thumbnail?.url && (
                                <div className="card-img-wrap">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={p.thumbnail.url} alt={p.thumbnail.altText ?? p.name} />
                                </div>
                            )}
                            <div className="card-body">
                                <div className="card-name">{p.name}</div>
                                <p className="muted" style={{ margin: 0 }}>{p.description}</p>
                                <div className="card-prices">
                                    {offer && <span className="card-price">{offer}</span>}
                                    {list && list !== offer && <span className="card-price-was">{list}</span>}
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </>
    );
}
