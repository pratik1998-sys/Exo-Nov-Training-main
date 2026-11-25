import { RequestContext } from '@context/request';
import { TutorialPetRestAuthenticateResponse } from './schema/tutorial-pet-rest.authenticate.schema';
import { Authenticate } from '@feature-authenticate';
import { TutorialPetRestBaseMapper } from '@plugin-tutorial-pet-rest/common/tutorial-pet-rest.base.mapper';

export class TutorialPetRestAuthenticateMapper extends TutorialPetRestBaseMapper {
    mapAuthenticate(requestContext: RequestContext, dsAuthenticate: TutorialPetRestAuthenticateResponse): Authenticate {
        return dsAuthenticate ?
            {
                // accessToken: dsAuthenticate.accessToken,
                // refreshToken: dsAuthenticate.refreshToken,
                token: dsAuthenticate.token,
                expiresIn: dsAuthenticate.expiresIn,
                expiresOn: dsAuthenticate.expiresOn,
                id: dsAuthenticate.id,
            }
            : null;
    }
}
