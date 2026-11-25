import { RequestContext } from "@context/request";
import { BaseFeatureResolver } from "@feature/resolver";
import {
  BaseFeatureService,
  BaseFeatureServiceParameter,
} from "@feature/service";

export class BaseAdminFeatureResolver extends BaseFeatureResolver {
  protected resolveService<T extends BaseFeatureService>(
    requestContext: RequestContext,
    serviceInterface: BaseFeatureServiceParameter,
  ): T {
    return super.resolveService(requestContext, serviceInterface, true);
  }
}
