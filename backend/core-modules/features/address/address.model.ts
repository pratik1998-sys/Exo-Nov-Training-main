
import { Field } from '@api-decorators';
import { ResultSetQuery } from '@feature/controller/models';
import { ResultSet } from '@feature/models';
import { InputType, ObjectType } from '@nestjs/graphql';

@InputType({ description: ' Address FilterInput' })
export class AddressFilterInput { }

@ObjectType({ description: 'Address country' })
export class AddressCountry {
    @Field({ description: 'country identifier' })
    identifier: string;

    @Field({ description: 'state name' })
    name: string;
}

@ObjectType({ description: 'Address state' })
export class AddressState {
    @Field({ description: 'state identifier' })
    identifier: string;

    @Field({ description: 'state name' })
    name: string;
}

@InputType({ description: ' Address Input' })
export class AddressInput {
    @Field({ description: 'address identifier' })
    identifier?: string;

    @Field({ description: 'first name' })
    firstName?: string;

    @Field({ description: 'middle name' })
    middleName?: string;

    @Field({ description: 'last name' })
    lastName?: string;

    @Field({ description: 'street line 1' })
    line1?: string;

    @Field({ description: 'street line 2' })
    line2?: string;

    @Field({ description: 'street line 3' })
    line3?: string;

    @Field({ description: 'city' })
    city?: string;

    @Field({ description: 'state' })
    state?: string;

    @Field({ description: 'postal code' })
    postalCode?: string;

    @Field({ description: 'country' })
    country?: string;

    @Field({ description: 'phone number' })
    phone?: string;

    @Field({ description: 'email address' })
    email?: string;

    @Field({ description: 'address type' })
    type?: string;

    @Field({ type: () => Boolean, description: 'is default address of an address book' })
    isDefault?: boolean;
}

@ObjectType({ description: ' Address' })
export class Address {
    @Field({ description: 'address id' })
    id?: string;

    @Field({ description: 'address identifier' })
    identifier?: string;

    @Field({ description: 'first name' })
    firstName?: string;

    @Field({ description: 'middle name' })
    middleName?: string;

    @Field({ description: 'last name' })
    lastName?: string;

    @Field({ description: 'street line 1' })
    line1?: string;

    @Field({ description: 'street line 2' })
    line2?: string;

    @Field({ description: 'street line 3' })
    line3?: string;

    @Field({ description: 'city' })
    city?: string;

    @Field({ description: 'state' })
    state?: string;

    @Field({ description: 'postal code' })
    postalCode?: string;

    @Field({ description: 'country' })
    country?: string;

    @Field({ description: 'phone number' })
    phone?: string;

    @Field({ description: 'email address' })
    email?: string;

    @Field({ description: 'address type' })
    type?: string;

    @Field({ type: () => Boolean, description: 'is default address of an address book' })
    isDefault?: boolean;
}
@ObjectType({ description: ' Address Result Set' })
export class AddressResultSet extends ResultSet<Address> {
    @Field({ type: () => [Address], description: 'is default address of an address book' })
    results?: Address[];
}

export class AddressResultSetQuery extends ResultSetQuery { }
