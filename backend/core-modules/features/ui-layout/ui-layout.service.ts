import { RequestContext } from "@context/request";
import { UILayout } from "@feature-ui-layout";
import { BaseFeatureService } from "@feature/service";

export abstract class UILayoutService extends BaseFeatureService {
    abstract getUILayout(id: string, type: string, requestContext: RequestContext, context?: any): Promise<UILayout>;
}
