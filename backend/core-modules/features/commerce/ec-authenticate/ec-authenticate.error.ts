import { AuthenticateErrors, AuthenticateErrorsType } from "@feature-authenticate";

export interface ECAuthenticateErrorsType extends AuthenticateErrorsType { }

export class ECAuthenticateErrors extends AuthenticateErrors {
    protected static errors: ECAuthenticateErrorsType = {
        ...AuthenticateErrors.errors,
    };
}
