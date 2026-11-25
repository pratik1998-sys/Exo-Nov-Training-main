'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/** Re-runs the server component every few seconds so the backend status stays current. */
export function AutoRefresh({ intervalMs = 5000 }: { intervalMs?: number }) {
    const router = useRouter();

    useEffect(() => {
        const id = setInterval(() => router.refresh(), intervalMs);
        return () => clearInterval(id);
    }, [router, intervalMs]);

    return null;
}
