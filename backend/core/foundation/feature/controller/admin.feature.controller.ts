import { RequestContext } from "@context/request";
import { BaseFeatureController } from "@feature/controller";
import {
  BaseFeatureService,
  BaseFeatureServiceParameter,
} from "@feature/service";

export class BaseAdminFeatureController extends BaseFeatureController {
  protected resolveService<T extends BaseFeatureService>(
    requestContext: RequestContext,
    serviceInterface: BaseFeatureServiceParameter,
    isAdminService: boolean = false,
  ): T {
    return super.resolveService(requestContext, serviceInterface, true);
  }
}
