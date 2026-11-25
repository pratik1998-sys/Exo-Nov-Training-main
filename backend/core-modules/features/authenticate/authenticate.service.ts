import { RequestContext } from "@context/request";
import { Authenticate } from "./authenticate.model";
import { BaseFeatureService } from "@feature/service";

export abstract class AuthenticateService extends BaseFeatureService {
    abstract authenticate(username: string, password: string, doUser: boolean, additionalAttributes: Record<string, any>, requestContext: RequestContext, context?: any): Promise<Authenticate>;
    abstract authenticateGuest(additionalAttributes: Record<string, any>, requestContext: RequestContext, context?: any): Promise<Authenticate>;
}
