import { Field, FieldType } from '@api-decorators';
import { User } from '@feature-user';
import { ObjectType } from '@nestjs/graphql';

const { integer, json } = FieldType;

@ObjectType({ description: 'Authenticate Base' })
export class AuthenticateBase {
    @Field({ description: 'token' })
    token: string;

    @Field({ description: 'expires on time' })
    expiresOn: string;

    @Field({ description: 'expires in time (ms)' }, integer)
    expiresIn: number;

    @Field({ description: 'user id' })
    id: string;

    @Field({ type: () => User, description: 'user' })
    user?: User;
}

@ObjectType({ description: 'Authenticate' })
export class Authenticate extends AuthenticateBase {
    @Field({ type: () => User, description: 'user' })
    user?: User;
}

@ObjectType({ description: 'Authenticate Guest' })
export class AuthenticateGuest extends AuthenticateBase { }

export class AuthenticateInputBase {
    @Field({ description: 'additional attributes' }, json)
    additionalAttributes: Record<string, any>;
}

export class AuthenticateInput extends AuthenticateInputBase {
    @Field({ description: 'username' })
    username: string;

    @Field({ description: 'password' })
    password: string;

    @Field({ type: () => Boolean, description: 'fetch the user details' })
    doUser: boolean;
}

export class AuthenticateGuestInput extends AuthenticateInputBase { }

@ObjectType({ description: 'Logout response' })
export class LogoutResponse {
    @Field({ type: () => Boolean, description: 'whether logout succeeded' })
    success: boolean;
}
