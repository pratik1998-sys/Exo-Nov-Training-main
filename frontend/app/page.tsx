import { gql } from '@/lib/gql';
import { AutoRefresh } from './auto-refresh';

export const dynamic = 'force-dynamic';

const QUERY = `query Health { health { status } }`;

export default async function HomePage() {
    const { data, error, endpoint } = await gql<{ health: { status: string } }>(QUERY);
    const up = !error && data?.health?.status === 'UP';

    return (
        <>
            <section className="hero">
                <h1>EXO 2 <span className="accent">Feature Console</span></h1>
                <p>
                    A deliberately thin client. Its only job is to make the BFF visible — that one endpoint
                    serves several capabilities, each backed by a different provider, and the client cannot
                    tell which is which.
                </p>
            </section>

            <AutoRefresh />
            <div
                className="down"
                role="status"
                style={{
                    background: up ? '#f0fdf8' : '#fef2f2',
                    border: `1px solid ${up ? '#34d3aa' : '#ef4444'}`,
                    borderLeft: `4px solid ${up ? '#34d3aa' : '#ef4444'}`,
                }}
            >
                <h3 style={{ color: up ? '#0f9d78' : '#dc2626' }}>
                    ● Backend {up ? 'is running' : 'is not running'}
                </h3>
                <p className="muted" style={{ margin: 0 }}>
                    <code>{endpoint}</code>
                    {!up && <> — start it with <code>cd backend &amp;&amp; yarn start catalyst-cerebrum</code></>}
                </p>
                {!up && error && (
                    <pre style={{ color: '#dc2626', whiteSpace: 'pre-wrap' }}>{error}</pre>
                )}
                <p className="muted" style={{ margin: 0 }}>Status re-checks automatically every 5 seconds.</p>
            </div>

            <h2>What to notice</h2>
            <ul>
                <li>
                    There is one endpoint in this entire app —{' '}
                    <code>lib/gql.ts</code> is about forty lines and is the whole client surface.
                </li>
                <li>
                    Nothing here names Shopify. The client asks for <code>products</code>, not for a
                    Shopify product. Swapping the provider is a change in{' '}
                    <code>configuration.yaml</code>, and this app would not notice.
                </li>
            </ul>
        </>
    );
}
