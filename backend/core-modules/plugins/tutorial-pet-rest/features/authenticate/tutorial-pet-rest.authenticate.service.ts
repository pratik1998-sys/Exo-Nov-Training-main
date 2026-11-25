import { RequestContext } from '@context/request';
import { TutorialPetRestAuthenticateDatasource } from './tutorial-pet-rest.authenticate.datasource';
import { StringUtility } from '@utilities';
import { TutorialPetRestAuthenticateMapper } from './tutorial-pet-rest.authenticate.mapper';
import { TutorialPetRestAuthenticateResponse } from './schema/tutorial-pet-rest.authenticate.schema';
import { Authenticate, AuthenticateErrors, AuthenticateService } from '@feature-authenticate';
import { TutorialPetRestBaseServiceImpl } from '@plugin-tutorial-pet-rest/common/tutorial-pet-rest.base.service';
import { TokenUtility } from '@token/utilities';
import { UserService } from '@feature-user';

export class TutorialPetRestAuthenticateServiceImpl extends TutorialPetRestBaseServiceImpl implements AuthenticateService {
    async authenticate(username: string, password: string, doUser: boolean, additionalAttributes: Record<string, any>, requestContext: RequestContext, context?: any): Promise<Authenticate> {
        const methodname = `${TutorialPetRestAuthenticateServiceImpl.name}.authenticate`;

        if (StringUtility.isStringEmpty(username)) {
            throw AuthenticateErrors.missingUsername();
        } else if (StringUtility.isStringEmpty(password)) {
            throw AuthenticateErrors.missingPassword();
        }

        let dsResult: TutorialPetRestAuthenticateResponse;

        try {
            dsResult = await this.getAuthenticateDatasource(requestContext).authenticate(requestContext, username, password);
        } catch (error) {
            this.logger.info(`${methodname} - Error authenticating user [${username}]: ${error}`, requestContext);
            throw AuthenticateErrors.authenticateFailed();
        }

        requestContext.tokens = TokenUtility.addToken(requestContext, this.getPluginTokenId(requestContext), dsResult.token, null, true);

        dsResult.token = TokenUtility.encryptTokens(requestContext, requestContext.tokens);

        const authenticate = this.getAuthenticateMapper(requestContext).mapAuthenticate(requestContext, dsResult);

        if (doUser) {
            authenticate.user = await this.getService<UserService>(requestContext, UserService).getUser('@current', requestContext, context);
        }

        return authenticate;
    }

    async authenticateGuest(additionalAttributes: Record<string, any>, requestContext: RequestContext, context?: any): Promise<Authenticate> {
        const methodname = `${TutorialPetRestAuthenticateServiceImpl.name}.authenticateGuest`;

        let dsResult: TutorialPetRestAuthenticateResponse;

        try {
            dsResult = await this.getAuthenticateDatasource(requestContext).authenticateGuest(requestContext);
        } catch (error) {
            this.logger.info(`${methodname} - Error authenticating guest: ${this.logger.formatJSON(error, true)}`, requestContext);
            throw AuthenticateErrors.authenticateFailed();
        }

        return this.getAuthenticateMapper(requestContext).mapAuthenticate(requestContext, dsResult);
    }

    protected getAuthenticateDatasource(requestContext: RequestContext) {
        return this.getDatasource<TutorialPetRestAuthenticateDatasource>(requestContext, TutorialPetRestAuthenticateDatasource);
    }

    protected getAuthenticateMapper(requestContext: RequestContext) {
        return this.getMapper<TutorialPetRestAuthenticateMapper>(requestContext, TutorialPetRestAuthenticateMapper);
    }
}
