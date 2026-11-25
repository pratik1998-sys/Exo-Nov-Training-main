/**
 * The entire client-side surface of this app.
 *
 * Note how small it is. There is one endpoint, one POST, one shape. That is the
 * whole point of a BFF: the client does not know that products come from
 * Shopify, or that feedback will come from Postgres. It knows one URL.
 */

const ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_URL ?? 'http://localhost:3100/graphql';
const CONSUMER = process.env.NEXT_PUBLIC_EXO_CONSUMER ?? 'shopify-app';

export type GqlResult<T> = {
    data: T | null;
    /** Raw response body, pretty-printed — shown in the teaching pane. */
    raw: string;
    /** Populated when the BFF is unreachable or returned GraphQL errors. */
    error: string | null;
    endpoint: string;
};

export async function gql<T>(query: string, variables?: Record<string, unknown>): Promise<GqlResult<T>> {
    try {
        const response = await fetch(ENDPOINT, {
            method: 'POST',
            // The consumer decides which provider serves the request (see backend configuration.yaml).
            headers: { 'Content-Type': 'application/json', 'x-consumer': CONSUMER },
            body: JSON.stringify({ query, variables }),
            // Always hit the BFF — caching a training app would hide the trace.
            cache: 'no-store',
        });

        const body = await response.json();

        if (body.errors?.length) {
            return {
                data: body.data ?? null,
                raw: JSON.stringify(body, null, 2),
                error: body.errors.map((e: { message: string }) => e.message).join('\n'),
                endpoint: ENDPOINT,
            };
        }

        return { data: body.data as T, raw: JSON.stringify(body, null, 2), error: null, endpoint: ENDPOINT };
    } catch (cause) {
        const message = cause instanceof Error ? cause.message : String(cause);

        return {
            data: null,
            raw: '',
            error: `Could not reach the BFF at ${ENDPOINT}\n\n${message}`,
            endpoint: ENDPOINT,
        };
    }
}
