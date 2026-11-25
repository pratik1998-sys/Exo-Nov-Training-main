import { RequestContext } from "@context/request";

export class GraphQLUtility {
  /**
   *
   * @todo - Harden this a bit better
   *
   * @param requestContext
   * @returns
   */
  static isIntrospectionQuery(requestContext: RequestContext): boolean {
    return requestContext.service == "POST /";
  }
}
