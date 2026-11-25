import { CommercetoolsCustomer } from "@plugin-commercetools/features/ec-user";

export interface CommercetoolsGetTokenResponse {
    access_token: string;
    expires_in: number;
    scope: string;
    refresh_token: string;
    token_type: string;
}

export interface CommercetoolsCustomerLoginRequest {
    email: string;
    password: string;
    anonymousCart?: {
        id: string;
        typeId: string;
    };
}

export interface CommercetoolsCustomerLoginResponse {
    customer: CommercetoolsCustomer;
}
