import { RequestContext } from "@context/request";
import { FooterNavigation, HeaderNavigation } from "./navigation.model";
import { BaseFeatureService } from "@feature/service";

export abstract class NavigationService extends BaseFeatureService {
    abstract getHeaderNavigation(requestContext: RequestContext, context?: any): Promise<HeaderNavigation>;
    abstract getFooterNavigation(requestContext: RequestContext, context?: any): Promise<FooterNavigation>;
}
