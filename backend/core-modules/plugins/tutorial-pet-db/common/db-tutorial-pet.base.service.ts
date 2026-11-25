import { RequestContext } from '@context/request';
import { BasePluginServiceImpl } from '@plugin/service';
import { TutorialPetErrors } from '@feature-tutorial-pet/common/tutorial-pet.error';

export class DBTutorialPetBaseServiceImpl extends BasePluginServiceImpl {
    protected isAdmin(requestContext: RequestContext) {
        return requestContext.user?.roles?.includes('ADMIN');
    }

    protected isVeterinarian(requestContext: RequestContext) {
        return requestContext.user?.roles?.includes('VETERINARIAN');
    }

    protected checkAuthorizationAdmin(requestContext: RequestContext) {
        if (!this.isAdmin(requestContext)) {
            throw TutorialPetErrors.notAuthorized();
        }
    }
}
