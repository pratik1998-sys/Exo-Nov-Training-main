/** @type {import('next').NextConfig} */
const nextConfig = {
  // Shopify serves product imagery from its CDN.
  images: { remotePatterns: [{ protocol: 'https', hostname: 'cdn.shopify.com' }] },
};

export default nextConfig;
