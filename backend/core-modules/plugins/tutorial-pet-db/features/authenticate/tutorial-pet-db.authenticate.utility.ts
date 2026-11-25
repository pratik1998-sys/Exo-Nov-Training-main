import { RequestContext } from '@context/request';
import { StringUtility } from '@utilities';

export class DBTutorialPetAuthenticateUtility {
    static encryptPassword(requestContext: RequestContext, password: string) {
        return Buffer.from(password).toString('base64');
    }

    static decryptPassword(requestContext: RequestContext, password: string) {
        return StringUtility.isStringNotEmpty(password) ? Buffer.from(password, 'base64').toString() : null;
    }
}
