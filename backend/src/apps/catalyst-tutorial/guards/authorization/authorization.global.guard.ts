import { ExecutionContext } from '@nestjs/common';
import { RequestContext } from '@context/request';
import { AuthorizationGuard } from '@guards/authorization';

export class ExtAuthorizationGuard extends AuthorizationGuard {
    /**
     * RequestContext.user is set by the user middleware
     * 
     * @param requestContext
     * @param context
     * @returns
     */
    protected async isUserAuthorized(requestContext: RequestContext, context: ExecutionContext): Promise<boolean> {
        return requestContext.user ? true : false;
    }
}
