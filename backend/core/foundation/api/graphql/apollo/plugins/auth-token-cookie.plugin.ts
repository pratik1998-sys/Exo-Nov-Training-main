import { ApolloServerPlugin, GraphQLRequestListener } from "@apollo/server";
import { Plugin } from "@nestjs/apollo";
import type { FastifyReply } from "fastify";
import {
  applyClearAuthTokenCookie,
  applySetAuthTokenCookie,
  extractAuthTokenFromPayload,
} from "@api/shared/cookies";

@Plugin()
export class AuthTokenCookiePlugin implements ApolloServerPlugin {
  async requestDidStart(): Promise<GraphQLRequestListener<any>> {
    return {
      async willSendResponse({ response, contextValue }) {
        const body = response.body;

        if (body.kind !== "single" || !body.singleResult?.data) {
          return;
        }

        const data = body.singleResult.data as Record<string, unknown>;
        const reply = contextValue?.res as FastifyReply | undefined;
        const httpHeaders = response.http?.headers;

        if (data.logout === true) {
          applyClearAuthTokenCookie(reply, httpHeaders);

          return;
        }

        const token = extractAuthTokenFromPayload(data);

        if (!token) {
          return;
        }

        applySetAuthTokenCookie(reply, httpHeaders, token);
      },
    };
  }
}
