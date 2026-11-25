export type CatalystArticleRecord = {
    id: string;
    identifier: string;
    name: string;
    summary: string;
    description: string;
    image?: { url?: string; altText?: string };
    readTime?: number;
    theme?: string;
    type?: string;
    createdAt?: string;
};

export class CatalystArticleData {
    static articles: CatalystArticleRecord[] = [
        {
            id: 'first-time-online-shopping',
            identifier: 'first-time-online-shopping',
            name: 'First-Time Online Shopping: What to Know Before You Buy',
            summary: 'A quick primer on sizing, returns, and how to compare products before adding to cart.',
            description:
                'Shopping online is convenient, but a few habits make the experience smoother. Start by checking size guides and customer reviews, then confirm the return window before you checkout.\n\n' +
                'For your first order, stick to versatile staples — a well-reviewed tee, comfortable everyday shoes, and a reusable bag — so you can test fit and service without a big commitment.',
            image: {
                url: '/images/guides/first-time-shopping.jpg',
                altText: 'Person browsing products on a laptop at home',
            },
            readTime: 5,
            theme: 'blue',
            type: 'guide',
            createdAt: '2025-01-15T10:00:00.000Z',
        },
        {
            id: 'capsule-wardrobe-basics',
            identifier: 'capsule-wardrobe-basics',
            name: 'Building a Capsule Wardrobe',
            summary: 'Mix and match fewer, better pieces to simplify daily dressing without sacrificing style.',
            description:
                'A capsule wardrobe is a small set of interchangeable items in a cohesive palette. Anchor it with neutral tops, one reliable pair of trousers, and a layering piece that works across seasons.\n\n' +
                'Quality beats quantity: choose fabrics that hold their shape and colors that pair with what you already own. Three well-chosen items can create a dozen outfits.',
            image: {
                url: '/images/guides/capsule-wardrobe.jpg',
                altText: 'Minimal closet with coordinated neutral clothing',
            },
            readTime: 7,
            theme: 'sand',
            type: 'guide',
            createdAt: '2025-02-03T10:00:00.000Z',
        },
        {
            id: 'gift-guide-under-50',
            identifier: 'gift-guide-under-50',
            name: 'Gift Guide: Thoughtful Picks Under $50',
            summary: 'Affordable gifts that still feel personal — from home comforts to everyday carry.',
            description:
                'Great gifts do not need a high price tag. Look for items people use daily but rarely buy for themselves: a candle set for the home, a slim wallet upgrade, or compact earbuds for commuting.\n\n' +
                'When in doubt, prioritize usefulness and presentation. Items that arrive gift-ready save time and make a strong first impression.',
            image: {
                url: '/images/guides/gift-guide-under-50.jpg',
                altText: 'Wrapped gift boxes beside small lifestyle products',
            },
            readTime: 6,
            theme: 'rose',
            type: 'buying-guide',
            createdAt: '2025-02-20T10:00:00.000Z',
        },
        {
            id: 'how-to-choose-the-right-size',
            identifier: 'how-to-choose-the-right-size',
            name: 'How to Choose the Right Size Online',
            summary: 'Use measurements, fit notes, and brand-specific guides to reduce returns.',
            description:
                'Sizing varies by brand and cut, so never assume your usual label will fit everywhere. Compare your body measurements to the size chart, not just your closet tags.\n\n' +
                'Pay attention to fit descriptors like relaxed, slim, or high-rise — they signal how a garment wears beyond the number on the label. When between sizes, check whether the item runs large or small in reviews.',
            image: {
                url: '/images/guides/choose-right-size.jpg',
                altText: 'Measuring tape beside a size chart on a phone screen',
            },
            readTime: 8,
            theme: 'teal',
            type: 'guide',
            createdAt: '2025-03-08T10:00:00.000Z',
        },
        {
            id: 'sustainable-materials-101',
            identifier: 'sustainable-materials-101',
            name: 'Sustainable Materials 101',
            summary: 'Understand common fabric and packaging claims so you can shop with confidence.',
            description:
                'Terms like organic, recycled, and responsibly sourced appear on labels everywhere — but they mean different things. Organic cotton reduces pesticide use; recycled polyester gives plastic a second life; bamboo blends often prioritize softness and renewability.\n\n' +
                'Look for specific certifications rather than vague eco-friendly language. Matching material choices to how you use a product — daily wear vs. occasional use — helps you buy less and buy better.',
            image: {
                url: '/images/guides/sustainable-materials.jpg',
                altText: 'Close-up of natural and recycled fabric swatches',
            },
            readTime: 9,
            theme: 'green',
            type: 'guide',
            createdAt: '2025-03-22T10:00:00.000Z',
        },
        {
            id: 'seasonal-sale-shopping-tips',
            identifier: 'seasonal-sale-shopping-tips',
            name: 'Seasonal Sale Shopping Tips',
            summary: 'Plan ahead, set a budget, and know when end-of-season markdowns offer the best value.',
            description:
                'Sales reward preparation. Make a short list of items you actually need before browsing clearance — impulse deals on the wrong size or color rarely pay off.\n\n' +
                'End-of-season is ideal for outerwear and sandals bought a size ahead for next year. Accessory bundles and multi-packs can be strong value when the unit price beats buying singles at full price.',
            image: {
                url: '/images/guides/seasonal-sale-tips.jpg',
                altText: 'Retail rack with sale tags and seasonal clothing',
            },
            readTime: 6,
            theme: 'amber',
            type: 'buying-guide',
            createdAt: '2025-04-05T10:00:00.000Z',
        },
    ];
}
