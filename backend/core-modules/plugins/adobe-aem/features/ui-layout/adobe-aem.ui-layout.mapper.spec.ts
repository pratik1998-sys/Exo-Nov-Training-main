import { describe, it, expect } from 'vitest';
import { UILayoutMapper } from './adobe-aem.ui-layout.mapper';

describe('UILayoutMapper', () => {
  it('maps ordered AEM items to rows recursively', () => {
    const dsLayout = {
      ':path': '/content/dxp/catalyst/en/home',
      ':items': {
        root: {
          ':type': 'container',
          ':itemsOrder': ['hero', 'trust'],
          ':items': {
            hero: {
              ':type': 'hero-banner',
              title: 'Hero',
            },
            trust: {
              ':type': 'trust-badges',
              ':itemsOrder': [],
              ':items': {},
            },
          },
        },
      },
      ':itemsOrder': ['root'],
    };

    const mapped = UILayoutMapper.mapUILayout({} as any, dsLayout);

    expect(mapped.data).toMatchObject({
      path: '/content/dxp/catalyst/en/home',
    });
    expect(mapped.rows).toHaveLength(1);
    expect(mapped.rows?.[0]).toMatchObject({
      id: 'root',
      type: 'container',
    });
    expect(mapped.rows?.[0]?.items?.[0]).toMatchObject({
      id: 'hero',
      type: 'hero-banner',
      data: {
        title: 'Hero',
      },
    });
  });

  it('returns empty rows for null payload', () => {
    const mapped = UILayoutMapper.mapUILayout({} as any, null);
    expect(mapped.rows).toEqual([]);
    expect(mapped.data).toBeNull();
  });
});
