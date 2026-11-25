import { ObjectType, InputType } from '@nestjs/graphql';
import { Field, FieldType } from '@api-decorators';
import { Address } from '@feature-address';
import { Contact } from '@feature-contact';
import { ResultSet } from '@feature/models';
import { ResultSetQuery } from '@feature/controller/models';
import { Authenticate } from '@feature-authenticate';

const { id } = FieldType;

@InputType({ description: 'User Filter Input' })
export class UserFilterInput {
    @Field({ type: () => [String], required: false, description: 'identifiers' })
    identifiers?: string[];

    @Field({ type: () => [String], required: false, description: 'usernames' })
    usernames?: string[];
}

@InputType({ description: 'User Input' })
export class UserInput {
    @Field({ required: false, description: 'password' })
    password?: string;

    @Field({ required: false, description: 'type' })
    type?: string;

    @Field({ required: false, description: 'first name' })
    firstName?: string;

    @Field({ required: false, description: 'middle name' })
    middleName?: string;

    @Field({ required: false, description: 'last name' })
    lastName?: string;

    @Field({ required: false, description: 'email' })
    email?: string;

    @Field({ required: false, description: 'phone' })
    phone?: string;

    @Field({ required: false, description: 'gender' })
    gender?: string;

    @Field({ type: () => [String], required: false, description: 'user roles' })
    roles?: string[];

    @Field({ description: 'date of birth', required: false })
    dateOfBirth: string;

    @Field({ type: () => Boolean, description: 'opt in to marketing communication', required: false })
    isMarketingOptIn: boolean;
}

@InputType({ description: 'User Input Create' })
export class UserCreateInput extends UserInput {
    @Field({ required: true, description: 'username' })
    username?: string;
}

@ObjectType({ description: 'User' })
export class User {
    @Field({ description: 'id' }, id)
    id?: string;

    @Field({ required: false, description: 'identifier' })
    identifier?: string;

    @Field({ required: false, description: 'name' })
    name?: string;

    @Field({ required: false, description: 'created at' })
    createdAt?: string;

    @Field({ required: false, description: 'username' })
    username?: string;

    @Field({ required: false, description: 'type' })
    type?: string;

    @Field({ required: false, description: 'first name' })
    firstName?: string;

    @Field({ required: false, description: 'middle name' })
    middleName?: string;

    @Field({ required: false, description: 'last name' })
    lastName?: string;

    @Field({ required: false, description: 'email' })
    email?: string;

    @Field({ required: false, description: 'phone' })
    phone?: string;

    @Field({ required: false, description: 'date of birth' })
    dateOfBirth?: string;

    @Field({ required: false, description: 'gender' })
    gender?: string;

    @Field({ type: () => [String], required: false, description: 'user roles' })
    roles?: string[];

    @Field({ type: () => [Address], required: false, description: 'user addresses' })
    addresses?: Address[];

    @Field({ type: () => Boolean, required: false, description: 'opt in to marketing communication' })
    isMarketingOptIn?: boolean;

    @Field({ type: () => [Contact], required: false, description: 'user contacts' })
    contacts?: Contact[];
}

@ObjectType({ description: 'User Create' })
export class UserCreate extends User {
    @Field({ type: () => Authenticate, description: 'authenticate', required: false })
    authenticate: Authenticate;
}

@ObjectType({ description: 'User Result Set' })
export class UserResultSet extends ResultSet<User> {
    @Field({ type: () => [User], required: false, description: 'user results' })
    results?: User[];
}

export class UserResultSetQuery extends ResultSetQuery {
    @Field({ type: () => [String], required: false, description: 'Identifier' })
    identifiers?: string[];

    @Field({ type: () => [String], required: false, description: 'Usernames' })
    usernames?: string[];
}
