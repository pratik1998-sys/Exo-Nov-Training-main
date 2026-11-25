import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import type { FastifyReply } from "fastify";
import { Observable, tap } from "rxjs";
import {
  extractAuthTokenFromPayload,
  setAuthTokenCookieOnReply,
} from "./auth-token.cookie";

@Injectable()
export class AuthTokenCookieInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== "http") {
      return next.handle();
    }

    return next.handle().pipe(
      tap((data) => {
        const token = extractAuthTokenFromPayload(data);

        if (!token) {
          return;
        }

        const reply = context.switchToHttp().getResponse<FastifyReply>();

        setAuthTokenCookieOnReply(reply, token);
      }),
    );
  }
}
