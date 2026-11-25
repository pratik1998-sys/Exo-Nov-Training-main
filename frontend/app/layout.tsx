import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'EXO 2 — Storefront',
    description: 'Premium storefront over the EXO 2 BFF',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <div className="bubbles" aria-hidden="true">
                    <span /><span /><span /><span /><span /><span />
                </div>
                <header>
                    <div className="brand">
                        <strong>EXO 2</strong> Storefront
                    </div>
                    <nav>
                        <a href="/">Home</a>
                        <a href="/products">Products</a>
                    </nav>
                </header>

                <main>{children}</main>

                <footer>
                    One GraphQL endpoint · Shopify backend · EXO 2 BFF on :3100
                </footer>
            </body>
        </html>
    );
}
