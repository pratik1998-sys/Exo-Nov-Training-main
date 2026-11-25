import { Field, FieldType } from '@api-decorators';
import { Address, AddressInput } from '@feature-address';
import { Image } from '@feature-shared-models';
import { ResultSetQuery } from '@feature/controller/models';
import { ResultSet } from '@feature/models';
import { ObjectType, InputType } from '@nestjs/graphql';

const { id } = FieldType;

@InputType({ description: 'Contact Filter Input' })
export class ContactFilterInput {
    @Field({ type: () => [String], description: 'identifiers' })
    identifiers?: string[];
}

@InputType({ description: 'Contact Input' })
export class ContactInput {
    @Field({ description: 'type', required: false })
    type?: string;

    @Field({ description: 'first name', required: false })
    firstName?: string;

    @Field({ description: 'middle name', required: false })
    middleName?: string;

    @Field({ description: 'last name', required: false })
    lastName?: string;

    @Field({ description: 'email', required: false })
    email?: string;

    @Field({ description: 'phone', required: false })
    phone?: string;

    @Field({ description: 'thumbnail', required: false })
    thumbnail?: string;

    @Field({ type: () => AddressInput, description: 'address', required: false })
    address?: AddressInput;
}

@ObjectType({ description: 'Contact' })
export class Contact {
    @Field({ description: 'id' }, id)
    id?: string;

    @Field({ description: 'identifier' })
    identifier?: string;

    @Field({ description: 'ownerIdentfier', required: false })
    ownerIdentfier?: string;

    @Field({ description: 'type', required: false })
    type?: string;

    @Field({ description: 'first name', required: false })
    firstName?: string;

    @Field({ description: 'middle name', required: false })
    middleName?: string;

    @Field({ description: 'last name', required: false })
    lastName?: string;

    @Field({ description: 'email', required: false })
    email?: string;

    @Field({ description: 'phone', required: false })
    phone?: string;

    @Field({ type: () => Image, description: 'thumbnail', required: false })
    thumbnail?: Image;

    @Field({ type: () => Address, description: 'address', required: false })
    address?: Address;
}

@ObjectType({ description: 'Contact Result Set' })
export class ContactResultSet extends ResultSet<Contact> {
    @Field({ type: () => [Contact], description: 'contact results', required: false })
    results?: Contact[];
}

export class ContactResultSetQuery extends ResultSetQuery {
    @Field({ type: () => [String], description: 'identifiers' })
    identifiers?: string[];
}
