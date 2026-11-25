import { Headers } from "@api-headers";
import { RequestContext } from "@context/request";
import { CartService, Cart } from "@feature-commerce/cart";
import { ECAuthenticateService, ECAuthenticate, ECAuthenticateErrors } from "@feature-commerce/ec-authenticate";
import { ECUserService, ECUser } from "@feature-commerce/ec-user";
import { HCLCommerceBaseServiceImpl, HCLCommerceConsumerConfiguration } from "@plugin-hcl-commerce/common";
import { HCLCommerceECAuthenticateRestDatasource } from "./hcl-commerce.ec-authenticate.datasource";
import { TokenUtility } from "@token/utilities";
import { StringUtility } from "@utilities";

export class HCLCommerceECAuthenticateRestServiceImpl extends HCLCommerceBaseServiceImpl implements ECAuthenticateService {
    async authenticate(username: string, password: string, doUser: boolean, doCart: boolean, cartId: string, requestContext: RequestContext, context?: unknown): Promise<ECAuthenticate> {
        const methodname = `${HCLCommerceECAuthenticateRestServiceImpl.name}.authenticate`;

        if (StringUtility.isStringEmpty(username)) {
            throw ECAuthenticateErrors.missingUsername();
        }

        if (StringUtility.isStringEmpty(password)) {
            throw ECAuthenticateErrors.missingPassword();
        }

        let authResponse;

        try {
            authResponse = await this.getDatasource<HCLCommerceECAuthenticateRestDatasource>(requestContext).authenticate(requestContext, username, password);
        } catch (error) {
            this.logger.info(`${methodname} - Error authenticating user ${username}: ${error}`, requestContext);
            throw ECAuthenticateErrors.authenticateFailed();
        }

        const { WCToken, WCTrustedToken } = authResponse;

        const tokenId = this.getPluginTokenId(requestContext);

        requestContext.tokens = TokenUtility.addToken(requestContext, tokenId, WCToken, null, true, { WCToken, WCTrustedToken });

        const async = [];

        if (doUser) {
            async.push(this.getService<ECUserService>(requestContext, ECUserService).getUser(null, requestContext, context));
        }

        if (doCart) {
            async.push(this.getService<CartService>(requestContext, CartService).getCart(null, null, null, null, requestContext, context));
        }

        let user: ECUser;
        let cart: Cart;

        if (async.length > 0) {
            const results = await Promise.all(async);

            if (doUser) {
                user = results[0];
                requestContext.user = user;
            }

            if (!doUser && doCart) {
                cart = results[0];
            } else if (doUser && doCart) {
                cart = results[1];
            }
        }

        const { configuration } = this.getPluginConsumerConfiguration<HCLCommerceConsumerConfiguration>(requestContext);

        return {
            token: TokenUtility.encryptTokens(requestContext, requestContext.tokens),
            expiresOn: null,
            expiresIn: configuration.accessTokenTTL,
            id: Headers.token.name,
            user,
            cart,
        };
    }

    async authenticateGuest(requestContext: RequestContext, context?: any): Promise<ECAuthenticate> {
        const methodname = `${HCLCommerceECAuthenticateRestServiceImpl.name}.authenticateGuest`;

        let authResponse;

        try {
            authResponse = await this.getDatasource<HCLCommerceECAuthenticateRestDatasource>(requestContext).authenticateGuest(requestContext);
        } catch (error) {
            this.logger.info(`${methodname} - Error obtaining guest tokens: ${this.logger.formatJSON(error)}`, requestContext);
            throw ECAuthenticateErrors.authenticateFailed();
        }

        const { WCToken, WCTrustedToken } = authResponse;

        const { configuration } = this.getPluginConsumerConfiguration<HCLCommerceConsumerConfiguration>(requestContext);

        const tokenId = this.getPluginTokenId(requestContext);

        return {
            token: TokenUtility.addTokenAndEncrypt(requestContext, tokenId, WCToken, null, false, { WCToken, WCTrustedToken }),
            expiresOn: null,
            expiresIn: configuration.accessTokenTTL,
            id: Headers.token.name,
            user: null,
            cart: null,
        };
    }
}
