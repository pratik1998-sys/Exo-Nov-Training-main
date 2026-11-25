
import { RequestContext } from '@context/request';
import { TutorialPetRestAuthenticateRequestBody, TutorialPetRestAuthenticateResponse } from './schema/tutorial-pet-rest.authenticate.schema';
import { HttpMethods, RestDatasourceServiceDefinition, RestDatasourceServiceDefinitions } from '@plugin-datasource-rest';
import { TutorialPetRestBaseDatasource } from '@plugin-tutorial-pet-rest/common/tutorial-pet-rest.base.datasource';


export interface TutorialPetRestAuthenticateDatasourceServiceDefinitions extends RestDatasourceServiceDefinitions {
    authenticate: RestDatasourceServiceDefinition;
    authenticateGuest: RestDatasourceServiceDefinition;
}

export class TutorialPetRestAuthenticateDatasource extends TutorialPetRestBaseDatasource {
    protected serviceDefinitions: TutorialPetRestAuthenticateDatasourceServiceDefinitions = {
        authenticate: {
            id: 'authenticate',
            method: HttpMethods.post,
            path: `authenticate`,
            timeout: 5000,
        },
        authenticateGuest: {
            id: 'authenticateGuest',
            method: HttpMethods.post,
            path: `authenticate/guest`,
            timeout: 5000,
        }
    };

    async authenticate(requestContext: RequestContext, username: string, password: string): Promise<TutorialPetRestAuthenticateResponse> {
        const methodname = `${TutorialPetRestAuthenticateDatasource.name}.authenticate`;

        const body: TutorialPetRestAuthenticateRequestBody = {
            username,
            password,
        };

        return await this.execute(requestContext, this.serviceDefinitions.authenticate, {}, {}, {}, body);
    }

    async authenticateGuest(requestContext: RequestContext): Promise<TutorialPetRestAuthenticateResponse> {
        const methodname = `${TutorialPetRestAuthenticateDatasource.name}.authenticate`;

        return await this.execute(requestContext, this.serviceDefinitions.authenticateGuest);
    }
}
