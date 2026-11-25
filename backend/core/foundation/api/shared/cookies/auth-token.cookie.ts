import { parseCookie, stringifySetCookie } from "cookie";
import type { FastifyReply } from "fastify";

export const AUTH_TOKEN_COOKIE_NAME = "auth_token";
export const AUTH_TOKEN_COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

type CookieHeaderMap = {
  set: (key: string, value: string) => void;
};

export function getAuthTokenCookieOptions(secure = false) {
  return {
    path: "/",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: AUTH_TOKEN_COOKIE_MAX_AGE_SECONDS,
    secure,
  };
}

export function getClearAuthTokenCookieOptions(secure = false) {
  return {
    path: "/",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 0,
    secure,
  };
}

export function serializeAuthTokenCookie(
  value: string,
  secure = false,
): string {
  return stringifySetCookie({
    name: AUTH_TOKEN_COOKIE_NAME,
    value,
    ...getAuthTokenCookieOptions(secure),
  });
}

export function serializeClearAuthTokenCookie(secure = false): string {
  return stringifySetCookie({
    name: AUTH_TOKEN_COOKIE_NAME,
    value: "",
    ...getClearAuthTokenCookieOptions(secure),
  });
}

export function applySetAuthTokenCookie(
  reply: FastifyReply | undefined,
  httpHeaders: CookieHeaderMap | undefined,
  token: string,
): void {
  const secure = process.env.NODE_ENV === "production";

  if (reply?.setCookie) {
    reply.setCookie(
      AUTH_TOKEN_COOKIE_NAME,
      token,
      getAuthTokenCookieOptions(secure),
    );
  }

  if (httpHeaders) {
    httpHeaders.set("Set-Cookie", serializeAuthTokenCookie(token, secure));
  }
}

export function applyClearAuthTokenCookie(
  reply: FastifyReply | undefined,
  httpHeaders: CookieHeaderMap | undefined,
): void {
  const secure = process.env.NODE_ENV === "production";

  if (reply?.clearCookie) {
    reply.clearCookie(
      AUTH_TOKEN_COOKIE_NAME,
      getClearAuthTokenCookieOptions(secure),
    );
  }

  if (httpHeaders) {
    httpHeaders.set("Set-Cookie", serializeClearAuthTokenCookie(secure));
  }
}

/**
 * Extract auth token from REST bodies ({ token }) or nested auth ({ authenticate: { token } }),
 * and from GraphQL mutation data ({ authenticate }, { authenticateGuest }, { userCreate }).
 */
export function extractAuthTokenFromPayload(data: unknown): string | undefined {
  if (!data || typeof data !== "object") {
    return undefined;
  }

  const record = data as Record<string, unknown>;

  const authenticate = record.authenticate as { token?: string } | undefined;
  const authenticateGuest = record.authenticateGuest as
    { token?: string } | undefined;
  const userCreate = record.userCreate as
    { authenticate?: { token?: string } } | undefined;

  const fromGraphqlRoots =
    authenticate?.token ??
    authenticateGuest?.token ??
    userCreate?.authenticate?.token;

  if (fromGraphqlRoots) {
    return fromGraphqlRoots;
  }

  if (typeof record.token === "string") {
    return record.token;
  }

  return undefined;
}

export function setAuthTokenCookieOnReply(
  reply: FastifyReply | undefined,
  token: string,
): void {
  applySetAuthTokenCookie(reply, undefined, token);
}

export function clearAuthTokenCookieOnReply(
  reply: FastifyReply | undefined,
): void {
  applyClearAuthTokenCookie(reply, undefined);
}

/**
 * Read auth token from @fastify/cookie-parsed cookies on the Fastify request,
 * copied cookies on the raw IncomingMessage (see NestServer), or Cookie header fallback.
 */
export function getAuthTokenFromRequest(req: any): string | undefined {
  const fromFastify =
    req?.cookies?.[AUTH_TOKEN_COOKIE_NAME] ??
    req?.raw?.cookies?.[AUTH_TOKEN_COOKIE_NAME];

  if (fromFastify) {
    return fromFastify;
  }

  const cookieHeader = req?.headers?.cookie ?? req?.raw?.headers?.cookie;

  if (!cookieHeader) {
    return undefined;
  }

  return parseCookie(cookieHeader)[AUTH_TOKEN_COOKIE_NAME];
}
