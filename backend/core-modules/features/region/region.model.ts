import { ObjectType } from '@nestjs/graphql';
import { Field, FieldType } from '@api-decorators';
import { Image } from '@feature-shared-models';
import { ResultSet } from '@feature/models';
import { ResultSetQuery } from '@feature/controller/models';

const { id } = FieldType;

@ObjectType({ description: 'RegionBase' })
export class RegionBase {
    @Field({ description: 'id' }, id)
    id?: string;

    @Field({ description: 'identifier' })
    identifier?: string;

    @Field({ description: 'code' })
    code?: string;

    @Field({ description: 'name' })
    name?: string;

    @Field({ description: 'description' })
    description?: string;

    @Field({ type: () => Image, description: 'thumbnail', required: false })
    thumbnail?: Image;

    @Field({ type: () => [Image], description: 'images', required: false })
    images?: Image[];
}

@ObjectType({ description: 'State' })
export class State extends RegionBase { }

@ObjectType({ description: 'Country' })
export class Country extends RegionBase {
    @Field({ type: () => [State], description: 'Country states', required: false })
    states?: State[];
}

@ObjectType({ description: 'Country Result Set' })
export class CountryResultSet extends ResultSet<Country> {
    @Field({ type: () => [Country], description: 'List of countries' })
    results?: Country[];
}

@ObjectType({ description: 'Country Result Set' })
export class StateResultSet extends ResultSet<State> {
    @Field({ type: () => [State], description: 'List of states' })
    results?: State[];
}

export class CountryResultSetQuery extends ResultSetQuery { }
export class StateResultSetQuery extends ResultSetQuery { }
