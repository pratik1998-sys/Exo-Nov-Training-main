import { RequestContext } from "@context/request";
import { BaseFeatureService } from "@feature/service";

export abstract class AdminRegistryService extends BaseFeatureService {
  abstract getRegistries(requestContext: RequestContext, context?: any);
  abstract getRegistryData(
    id: string,
    requestContext: RequestContext,
    context?: any,
  );
  abstract refreshRegistry(
    id: string,
    requestContext: RequestContext,
    context?: any,
  );
}
