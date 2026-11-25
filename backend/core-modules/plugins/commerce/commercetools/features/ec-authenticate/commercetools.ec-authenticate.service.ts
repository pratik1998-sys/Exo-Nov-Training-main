import { Headers } from "@api-headers";
import { RequestContext } from "@context/request";
import { Cart, CartService } from "@feature-commerce/cart";
import { ECAuthenticate, ECAuthenticateErrors, ECAuthenticateService } from "@feature-commerce/ec-authenticate";
import { ECUser } from "@feature-commerce/ec-user";
import { CommercetoolsBaseServiceImpl } from "@plugin-commercetools/common";
import { CommercetoolsCustomerLoginResponse, CommercetoolsGetTokenResponse } from "./schema/commercetools.ec-authenticate.schema";
import { CommercetoolsECUserMapper } from "@plugin-commercetools/features/ec-user";
import { TokenUtility } from "@token/utilities";
import { StringUtility } from "@utilities";
import { CommercetoolsECAuthenticateDatasource } from "./commercetools.ec-authenticate.datasource";

export class CommercetoolsECAuthenticateServiceImpl extends CommercetoolsBaseServiceImpl implements ECAuthenticateService {
    async authenticate(username: string, password: string, doUser: boolean, doCart: boolean, cartId: string, requestContext: RequestContext, context?: any): Promise<ECAuthenticate> {
        const methodname = `${CommercetoolsECAuthenticateServiceImpl.name}.authenticate`;

        if (StringUtility.isStringEmpty(username)) {
            throw ECAuthenticateErrors.missingUsername();
        }

        if (StringUtility.isStringEmpty(password)) {
            throw ECAuthenticateErrors.missingPassword();
        }

        const tokenId = this.getPluginTokenId(requestContext);

        const ds = this.getDatasource<CommercetoolsECAuthenticateDatasource>(requestContext);

        let dsOAuthTokenResult: CommercetoolsGetTokenResponse;
        let dsLoginResponse: CommercetoolsCustomerLoginResponse;

        try {
            dsOAuthTokenResult = await ds.getCustomerToken_OAuth(requestContext, username, password);

            requestContext.tokens = TokenUtility.addToken(requestContext, tokenId, dsOAuthTokenResult.access_token, dsOAuthTokenResult.refresh_token, true);

            dsLoginResponse = await ds.customerLogin(requestContext, username, password, cartId);
        } catch (error) {
            this.logger.info(`${methodname} - Error authenticating user ${username}: ${error}`, requestContext);
            throw ECAuthenticateErrors.authenticateFailed();
        }

        const doCartMerge = StringUtility.isStringNotEmpty(cartId);

        const doCartAction = doCartMerge || doCart;

        let user: ECUser;
        let cart: Cart;

        if (doUser) {
            user = this.getMapper<CommercetoolsECUserMapper>(requestContext, CommercetoolsECUserMapper).mapECUser(requestContext, dsLoginResponse.customer);

            requestContext.user = user;

            await this.fetchContacts(requestContext, user, context);
        }

        if (doCartAction) {
            const cartService = this.getService<CartService>(requestContext, CartService);

            this.logger.info(`${methodname} - Fetching customer [${username}] cart`, requestContext);
            try {
                cart = await cartService.getCart(null, null, null, null, requestContext, context);
            } catch (error) { }
        }

        return {
            token: TokenUtility.encryptTokens(requestContext, requestContext.tokens),
            expiresOn: null,
            expiresIn: dsOAuthTokenResult.expires_in,
            id: Headers.token.name,
            user,
            cart,
        };
    }

    async authenticateGuest(requestContext: RequestContext, context?: any): Promise<ECAuthenticate> {
        const methodname = `${CommercetoolsECAuthenticateServiceImpl.name}.authenticateGuest`;

        const tokenId = this.getPluginTokenId(requestContext);

        let dsAuthentication: CommercetoolsGetTokenResponse;

        try {
            dsAuthentication = await this.getDatasource<CommercetoolsECAuthenticateDatasource>(requestContext).getAnonymousToken(requestContext);
        } catch (error) {
            this.logger.info(`${methodname} - Error authenticating guest: ${error}`, requestContext);
            throw ECAuthenticateErrors.authenticateFailed();
        }

        return {
            token: TokenUtility.addTokenAndEncrypt(requestContext, tokenId, dsAuthentication.access_token, dsAuthentication.refresh_token, false),
            expiresOn: null,
            expiresIn: dsAuthentication.expires_in,
            id: Headers.token.name,
        };
    }

    protected async fetchContacts(requestContext: RequestContext, user: ECUser, context?: any) { }
}
