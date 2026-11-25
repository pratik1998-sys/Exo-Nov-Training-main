import { Field, FieldType } from '@api-decorators';
import { ResultSetQuery } from '@feature/controller/models';
import { ResultSet } from '@feature/models';
import { ObjectType, ID, InputType } from '@nestjs/graphql';
import { User } from '@feature-user';
import { Image } from '@feature-shared-models';


const { id } = FieldType

@InputType({ description: 'Pet Filter Input' })
export class PetFilterInput {
    @Field({ type: () => [String], description: 'identifiers' })
    identifiers?: string[];

    @Field({ description: 'first name' })
    firstName?: string;

    @Field({ description: 'user identifier' })
    userIdentifier?: string;
}

@InputType({ description: 'Pet Input' })
export class PetInput {
    @Field({ description: 'type' })
    type?: string;

    @Field({ description: 'first name' })
    firstName?: string;

    @Field({ description: 'middle name' })
    middleName?: string;

    @Field({ description: 'last name' })
    lastName?: string;

    @Field({ description: 'breed name' })
    breed?: string;

    @Field({ description: 'height' })
    height?: string;

    @Field({ description: 'weight' })
    weight?: string;

    @Field({ description: 'thumbnail' })
    thumbnail?: string;

    @Field({ description: 'user identifier' })
    userIdentifier?: string;
}

@ObjectType({ description: 'Pet' })
export class Pet {
    @Field({ description: 'id' }, id)
    id?: string;

    @Field({ description: 'identifier' })
    identifier?: string;

    @Field({ type: () => User, description: 'user' })
    user?: User;

    @Field({ description: 'type' })
    type?: string;

    @Field({ description: 'first name' })
    firstName?: string;

    @Field({ description: 'middle name' })
    middleName?: string;

    @Field({ description: 'last name' })
    lastName?: string;

    @Field({ description: 'breed' })
    breed?: string;

    @Field({ description: 'height' })
    height?: string;

    @Field({ description: 'weight' })
    weight?: string;

    @Field({ type: () => Image, description: 'thumbnail' })
    thumbnail?: Image;
}

@ObjectType({ description: 'Pet Result Set' })
export class PetResultSet extends ResultSet<Pet> {
    @Field({ type: () => [Pet], description: 'pet results' })
    results?: Pet[];
}

export class PetResultSetQuery extends ResultSetQuery {
    @Field({ type: () => [String], description: 'identifiers' })
    identifiers?: string[];

    @Field({ description: 'user identifier' })
    userIdentifier?: string;

    @Field({ description: 'first name' })
    firstName?: string;
}
