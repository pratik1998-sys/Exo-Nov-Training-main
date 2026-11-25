import { UserErrors, UserErrorsType } from "@feature-user";

export interface ECUserErrorsType extends UserErrorsType { }

export class ECUserErrors extends UserErrors {
    protected static errors: ECUserErrorsType = {
        ...UserErrors.errors,
    };
}
