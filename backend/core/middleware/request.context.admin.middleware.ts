import { RequestContextMiddleware } from "@middleware";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RequestContextAdminMiddleware extends RequestContextMiddleware {
  protected getClass() {
    return RequestContextAdminMiddleware;
  }
}
