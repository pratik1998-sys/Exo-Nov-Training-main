
import { RequestContext } from '@context/request';
import { Authenticate, AuthenticateService } from '@feature-authenticate';
import { TutorialPetGraphqlBaseServiceImpl } from '@plugin-tutorial-pet-graphql/common/tutorial-pet-graphql.base.service';

export class TutorialPetGraphqlAuthenticateServiceImpl extends TutorialPetGraphqlBaseServiceImpl implements AuthenticateService {
    async authenticate(username: string, password: string, doUser: boolean, additionalAttributes: Record<string, any>, requestContext: RequestContext, context?: any): Promise<Authenticate> {
        const methodname = `${TutorialPetGraphqlAuthenticateServiceImpl.name}.authenticate`;

        throw new Error('Method not implemented.');
    }

    async authenticateGuest(additionalAttributes: Record<string, any>, requestContext: RequestContext, context?: any): Promise<Authenticate> {
        const methodname = `${TutorialPetGraphqlAuthenticateServiceImpl.name}.authenticateGuest`;

        throw new Error('Method not implemented.');
    }
}
