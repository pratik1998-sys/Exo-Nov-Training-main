import { RequestContext } from '@context/request';
import { ShopifyECAuthenticateDatasource } from './shopify.ec-authenticate.datasource';
import { ShopifyCustomerAccessTokenCreateResult } from './shopify.ec-authenticate.schema';
import { v4 as uuidv4 } from 'uuid';
import { ShopifyBaseServiceImpl } from '@plugin-shopify/common';
import { Cart } from '@feature-commerce/cart';
import { ECAuthenticateService, ECAuthenticate, ECAuthenticateErrors } from '@feature-commerce/ec-authenticate';
import { ECUser, ECUserService } from '@feature-commerce/ec-user';
import { StringUtility } from '@utilities';
import { TokenUtility } from '@token/utilities';
import { Headers } from '@api-headers';

export class ShopifyECAuthenticateServiceImpl extends ShopifyBaseServiceImpl implements ECAuthenticateService {
    async authenticate(username: string, password: string, doUser: boolean, doCart: boolean, cartId: string, requestContext: RequestContext, context?: any): Promise<ECAuthenticate> {
        const methodname = `${ShopifyECAuthenticateServiceImpl.name}.authenticate`;

        if (StringUtility.isStringEmpty(username)) {
            throw ECAuthenticateErrors.missingUsername();
        }

        if (StringUtility.isStringEmpty(password)) {
            throw ECAuthenticateErrors.missingPassword();
        }

        let dsAuthentication: ShopifyCustomerAccessTokenCreateResult;

        try {
            dsAuthentication = await this.getECAuthenticateDatasource(requestContext).createCustomerAccessToken(requestContext, username, password);
        } catch (error) {
            this.logger.info(`${methodname} - Error authenticating user ${username}: ${error}`, requestContext);
            throw ECAuthenticateErrors.authenticateFailed();
        }

        const tokenId = this.getPluginTokenId(requestContext);

        requestContext.tokens = TokenUtility.addToken(requestContext, tokenId, dsAuthentication.customerAccessToken.accessToken, null, true);

        const doCartMerge = !StringUtility.isStringEmpty(cartId);

        const doCartAction = doCartMerge || doCart;

        let user: ECUser;
        let cart: Cart;

        if (doUser) {
            this.logger.info(`${methodname} - Fetching user`, requestContext);

            const userService = this.getService<ECUserService>(requestContext, ECUserService);

            user = await userService.getUser(null, requestContext, context);

            requestContext.user = user;
        }

        // if (doCartAction) {
        //     const cartService = this.getService<CartService>(requestContext, CartService);

        //     if (doCartMerge) {
        //         this.logger.info(`${methodname} - Merging guest cart ${cartId} to user ${username} cart`, requestContext);
        //         cart = await cartService.mergeCarts(cartId, null, requestContext, context);
        //     } else if (doCart) {
        //         this.logger.info(`${methodname} - Fetching user ${username} cart`, requestContext);
        //         cart = await cartService.getCart(null, null, null, null, requestContext, context);
        //     }
        // }

        return {
            token: TokenUtility.encryptTokens(requestContext, requestContext.tokens),
            expiresOn: dsAuthentication.customerAccessToken.expiresAt,
            expiresIn: null,
            id: Headers.token.name,
            user,
            cart,
        };
    }

    async authenticateGuest(requestContext: RequestContext, context?: any): Promise<ECAuthenticate> {
        const methodname = `${ShopifyECAuthenticateServiceImpl.name}.authenticateGuest`;

        const tokenId = this.getPluginTokenId(requestContext);

        return {
            token: TokenUtility.addTokenAndEncrypt(requestContext, tokenId, uuidv4(), null, false),
            expiresIn: null,
            expiresOn: null,
            id: Headers.token.name,
        };
    }

    protected getECAuthenticateDatasource(requestContext: RequestContext) {
        return this.getDatasource<ShopifyECAuthenticateDatasource>(requestContext, ShopifyECAuthenticateDatasource);
    }
}
