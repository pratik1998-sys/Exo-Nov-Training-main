import { Field, FieldType } from '@api-decorators';
import { AddressInput, Address } from '@feature-address';
import { ResultSetQuery } from '@feature/controller/models';
import { ResultSet } from '@feature/models';
import { ObjectType, InputType } from '@nestjs/graphql';

const { id } = FieldType

@InputType({ description: 'Pharmacy Filter Input' })
export class PharmacyFilterInput {
    @Field({ type: () => [String], description: 'identifiers' })
    identifiers?: string[];
}

@InputType({ description: 'Pharmacy Input' })
export class PharmacyInput {
    @Field({ description: 'name' })
    name?: string;

    @Field({ description: 'description' })
    description?: string;

    @Field({ description: 'type' })
    type?: string;

    @Field({ description: 'email' })
    email?: string;

    @Field({ description: 'phone' })
    phone?: string;

    @Field({ type: () => AddressInput, description: 'address' })
    address?: AddressInput;
}

@ObjectType({ description: 'Pharmacy' })
export class Pharmacy {
    @Field({ description: 'id' }, id)
    id?: string;

    @Field({ description: 'identifier' })
    identifier?: string;

    @Field({ description: 'type' })
    type?: string;

    @Field({ description: 'name' })
    name?: string;

    @Field({ description: 'description' })
    description?: string;

    @Field({ description: 'email' })
    email?: string;

    @Field({ description: 'phone' })
    phone?: string;

    @Field({ type: () => Address, description: 'address' })
    address?: Address;
}

@ObjectType({ description: 'Pharmacy Result Set' })
export class PharmacyResultSet extends ResultSet {
    @Field({ type: () => [Pharmacy], description: 'pharmacy results' })
    results?: Pharmacy[];
}

export class PharmacyResultSetQuery extends ResultSetQuery {
    @Field({ type: () => [String], description: 'identifiers' })
    identifiers?: string[];
}
