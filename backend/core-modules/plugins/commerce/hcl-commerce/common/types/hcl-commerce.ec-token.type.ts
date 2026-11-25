import { Token } from "@token";

export interface HCLCommerceECToken extends Token {
    WCToken?: string;
    WCTrustedToken?: string;
}
