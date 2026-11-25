import { RequestContext } from "@context/request";
import { ECAuthenticate } from "./ec-authenticate.model";
import { BaseFeatureService } from "@feature/service";

export abstract class ECAuthenticateService extends BaseFeatureService {
    abstract authenticate(username: string, password: string, doUser: boolean, doCart: boolean, cartId: string, requestContext: RequestContext, context?: any): Promise<ECAuthenticate>;
    abstract authenticateGuest(requestContext: RequestContext, context?: any): Promise<ECAuthenticate>;
}
