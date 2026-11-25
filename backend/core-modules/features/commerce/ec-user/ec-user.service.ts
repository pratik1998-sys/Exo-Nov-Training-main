import { RequestContext } from "@context/request";
import { ECUser, ECUserCreate, ECUserCreateInput, ECUserInput } from "./ec-user.model";
import { BaseFeatureService } from "@feature/service";

export abstract class ECUserService extends BaseFeatureService {
    abstract createUser(customer: ECUserCreateInput, cartId: string, requestContext: RequestContext, context?: any): Promise<ECUserCreate>;
    abstract getUser(identifier: string, requestContext: RequestContext, context?: any): Promise<ECUser>;
    abstract updateUser(identifier: string, customer: ECUserInput, requestContext: RequestContext, context?: any): Promise<ECUser>;

    abstract getTokenPurseId(requestContext: RequestContext): string;
}
