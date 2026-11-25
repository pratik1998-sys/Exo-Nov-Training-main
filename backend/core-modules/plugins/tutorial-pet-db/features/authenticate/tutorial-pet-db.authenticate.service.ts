import { RequestContext } from '@context/request';
import { FindManyOptions } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { DBTutorialPetAuthenticateUtility } from './tutorial-pet-db.authenticate.utility';
import { StringUtility } from '@utilities';
import { Authenticate, AuthenticateErrors, AuthenticateService } from '@feature-authenticate';
import { TokenUtility } from '@token/utilities';
import { DBTutorialPetUserServiceImpl } from '@plugin-tutorial-pet-db/features/user/tutorial-pet-db.user.service';
import { DBTutorialPetUserEntity } from '@plugin-tutorial-pet-db/features/user/entities/tutorial-pet-db.user.entity';


export class DBTutorialPetAuthenticateServiceImpl extends DBTutorialPetUserServiceImpl implements AuthenticateService {
    async authenticate(username: string, password: string, doUser: boolean, additionalAttributes: Record<string, any>, requestContext: RequestContext, context?: any): Promise<Authenticate> {
        const methodname = `${DBTutorialPetAuthenticateServiceImpl.name}.authenticate`;

        if (StringUtility.isStringEmpty(username)) {
            throw AuthenticateErrors.missingUsername();
        } else if (StringUtility.isStringEmpty(password)) {
            throw AuthenticateErrors.missingPassword();
        }

        const userOptions: FindManyOptions<DBTutorialPetUserEntity> = {
            where: {
                username,
                password: DBTutorialPetAuthenticateUtility.encryptPassword(requestContext, password),
            },
        };

        const result = await this.getDBTutorialPetUserRepository().findAndCount(userOptions);

        const dsUser = result[0]?.length > 0 ? result[0][0] : null;

        if (!dsUser) {
            throw AuthenticateErrors.authenticateFailed();
        }

        const user = this.getUserMapper(requestContext).mapUser(requestContext, dsUser);

        const tokenId = this.getPluginTokenId(requestContext);

        // requestContext.token = TokenUtility.buildToken(requestContext, user.identifier, true);
        requestContext.tokens = TokenUtility.addToken(requestContext, tokenId, user.identifier, null, true);

        return {
            // accessToken: TokenUtility.encryptToken(requestContext, requestContext.token),
            // refreshToken: null,
            token: TokenUtility.encryptTokens(requestContext, requestContext.tokens),
            expiresOn: null,
            expiresIn: null,
            id: user.identifier,
            user: doUser ? user : undefined,
        };
    }

    async authenticateGuest(additionalAttributes: Record<string, any>, requestContext: RequestContext, context?: any): Promise<Authenticate> {
        const tokenId = this.getPluginTokenId(requestContext);

        return {
            // accessToken: TokenUtility.encryptToken(requestContext, requestContext.token),
            // refreshToken: null,
            token: TokenUtility.addTokenAndEncrypt(requestContext, tokenId, uuidv4(), null, false),
            expiresOn: null,
            expiresIn: null,
            id: tokenId,
        };
    }
}
