import { ObjectType, InputType } from '@nestjs/graphql';
import { Field, FieldType } from '@api-decorators';
import { ResultSetQuery } from '@feature/controller/models';
import { ResultSet } from '@feature/models';
import { Address, AddressInput } from '@feature-address';
import { Image } from '@feature-shared-models';

const { id } = FieldType;

@InputType({ description: 'Veterinarian Filter Input' })
export class VeterinarianFilterInput {
    @Field({ type: () => [String], description: 'identifiers' })
    identifiers?: string[];
}

@InputType({ description: 'Veterinarian Input' })
export class VeterinarianInput {
    @Field({ description: 'type' })
    type?: string;

    @Field({ description: 'first name' })
    firstName?: string;

    @Field({ description: 'middle name' })
    middleName?: string;

    @Field({ description: 'last name' })
    lastName?: string;

    @Field({ description: 'email' })
    email?: string;

    @Field({ description: 'phone' })
    phone?: string;

    @Field({ description: 'thumbnail' })
    thumbnail?: string;

    @Field({ type: () => AddressInput, description: 'address' })
    address?: AddressInput;
}

@ObjectType({ description: 'Veterinarian' })
export class Veterinarian {
    @Field({ description: 'id' }, id)
    id?: string;

    @Field({ description: 'identifier' })
    identifier?: string;

    @Field({ description: 'type' })
    type?: string;

    @Field({ description: 'first name' })
    firstName?: string;

    @Field({ description: 'middle name' })
    middleName?: string;

    @Field({ description: 'last name' })
    lastName?: string;

    @Field({ description: 'email' })
    email?: string;

    @Field({ description: 'phone' })
    phone?: string;

    @Field({ type: () => Image, description: 'thumbnail' })
    thumbnail?: Image;

    @Field({ type: () => Address, description: 'address' })
    address?: Address;
}

@ObjectType({ description: 'Veterinarian Result Set' })
export class VeterinarianResultSet extends ResultSet {
    @Field({ type: () => [Veterinarian], description: 'veterinarian results' })
    results?: Veterinarian[];
}

export class VeterinarianResultSetQuery extends ResultSetQuery {
    @Field({ type: () => [String], description: 'identifiers' })
    identifiers?: string[];
}
