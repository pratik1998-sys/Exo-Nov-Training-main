import { Headers } from "@api-headers";
import { RequestContext } from "@context/request";
import { Cart } from "@feature-commerce/cart";
import { ECAuthenticate, ECAuthenticateErrors, ECAuthenticateService } from "@feature-commerce/ec-authenticate";
import { ECUser, ECUserService } from "@feature-commerce/ec-user";
import { SAPCommerceBaseServiceImpl } from "@plugin-sap-commerce/common";
import { SAPCommerceECAuthenticateDatasource } from "./sap-commerce.ec-authenticate.datasource";
import { TokenUtility } from "@token/utilities";
import { StringUtility } from "@utilities";
import { v4 as uuidv4 } from 'uuid';


export class SAPCommerceECAuthenticateServiceImpl extends SAPCommerceBaseServiceImpl implements ECAuthenticateService {
    async authenticate(username: string, password: string, doUser: boolean, doCart: boolean, cartId: string, requestContext: RequestContext, context?: any): Promise<ECAuthenticate> {
        const methodname = `${SAPCommerceECAuthenticateServiceImpl.name}.authenticate`;

        if (StringUtility.isStringEmpty(username)) {
            throw ECAuthenticateErrors.missingUsername();
        }

        if (StringUtility.isStringEmpty(password)) {
            throw ECAuthenticateErrors.missingPassword();
        }

        let dsAuthentication: any;

        try {
            dsAuthentication = await this.getDatasource<SAPCommerceECAuthenticateDatasource>(requestContext).authenticate(requestContext, username, password);
        } catch (error) {
            this.logger.info(`${methodname} - Error authenticating user ${username}: ${error}`, requestContext);
            throw ECAuthenticateErrors.authenticateFailed();
        }

        const tokenId = this.getPluginTokenId(requestContext);

        requestContext.tokens = TokenUtility.addToken(requestContext, tokenId, dsAuthentication.access_token, dsAuthentication.refresh_token, true);

        const doCartMerge = StringUtility.isStringNotEmpty(cartId);

        const doCartAction = doCartMerge || doCart;

        let user: ECUser;
        let cart: Cart;

        if (doUser) {
            this.logger.info(`${methodname} - Fetching customer`, requestContext);

            const userService = this.getService<ECUserService>(requestContext, ECUserService);

            user = await userService.getUser(null, requestContext, context);

            requestContext.user = user;
        }

        /*
        if (doCartAction) {
            const cartService = this.getService<CartService>(requestContext, CartService);

            if (doCartMerge) {
                this.logger.info(`${methodname} - Merging guest cart ${cartId} to customer ${username} cart`, requestContext);
                cart = await cartService.mergeCarts(cartId, null, requestContext, context);
            } else if (doCart) {
                this.logger.info(`${methodname} - Fetching customer ${username} cart`, requestContext);
                cart = await cartService.getCart(null, null, null, null, requestContext, context);
            }
        }
        */

        return {
            token: TokenUtility.encryptTokens(requestContext, requestContext.tokens),
            expiresOn: null,
            expiresIn: dsAuthentication.expires_in,
            id: Headers.token.name,
            user,
            cart,
        };
    }

    async authenticateGuest(requestContext: RequestContext, context?: any): Promise<ECAuthenticate> {
        const tokenId = this.getPluginTokenId(requestContext);

        return {
            token: TokenUtility.addTokenAndEncrypt(requestContext, tokenId, uuidv4(), null, false),
            expiresIn: null,
            expiresOn: null,
            id: 'GUEST',
        };
    }
}
