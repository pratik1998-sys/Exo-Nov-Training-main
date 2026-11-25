import { RequestContext } from "@context/request";
import { Token } from "@token";
import { StringUtility } from "@utilities";

export class TokenUtility {
  static addToken(
    requestContext: RequestContext,
    tokenId: string,
    token: string,
    refreshToken: string,
    isRegistered: boolean,
    data: Record<string, any> = {},
  ): Record<string, Token> {
    const tokens: Record<string, Token> = requestContext.tokens ?? {};

    tokens[tokenId] = this.buildToken(
      requestContext,
      token,
      refreshToken,
      isRegistered,
      data,
    );

    return tokens;
  }

  static addTokenAndEncrypt(
    requestContext: RequestContext,
    tokenId: string,
    token: string,
    refreshToken: string,
    isRegistered: boolean,
    data: Record<string, any> = {},
  ) {
    const purse: Record<string, Token> = this.addToken(
      requestContext,
      tokenId,
      token,
      refreshToken,
      isRegistered,
      data,
    );

    return this.encryptTokens(requestContext, purse);
  }

  static encryptTokens(
    requestContext: RequestContext,
    tokens: Record<string, Token>,
  ) {
    return Buffer.from(JSON.stringify(tokens)).toString("base64");
  }

  static decryptTokens(
    requestContext: RequestContext,
    encryptedTokens: string,
  ) {
    return StringUtility.isStringNotEmpty(encryptedTokens)
      ? JSON.parse(Buffer.from(encryptedTokens, "base64").toString())
      : null;
  }

  static buildToken(
    requestContext: RequestContext,
    token: string,
    refreshToken: string,
    isRegistered: boolean,
    data: Record<string, any> = {},
  ) {
    const obj: Token = {
      token,
      refreshToken,
      isRegistered,
      ...data,
    };

    return obj;
  }
}
