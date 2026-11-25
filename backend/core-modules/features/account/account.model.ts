import { Field } from '@api-decorators';
import { Address } from '@feature-address';
import { ResultSetQuery } from '@feature/controller/models';
import { ResultSet } from '@feature/models';
import { InputType, ObjectType } from '@nestjs/graphql';

@InputType({ description: 'Account Filter Input' })
export class AccountFilterInput { }

@ObjectType({ description: ' Account' })
export class Account {
    @Field({ description: 'account id' })
    id?: string;

    @Field({ description: 'account identifier' })
    identifier?: string;

    @Field({ description: 'account name' })
    name?: string;

    @Field({ type: () => [Address], description: 'account addresses' })
    addresses?: Address[];

    @Field({ type: () => [Address], description: 'account shipping addresses' })
    shippingAddresses?: Address[];

    @Field({ type: () => [Address], description: 'account billing addresses' })
    billingAddresses?: Address[];

    @Field({ type: () => Boolean, description: 'is default address of an address book' })
    isDefault?: boolean;
}

@ObjectType({ description: ' Address Result Set' })
export class AccountResultSet extends ResultSet<Account> {
    @Field({ type: () => [Account], description: 'account results' })
    results?: Account[];
}

export class AccountResultSetQuery extends ResultSetQuery {
    @Field({ type: () => Boolean, description: 'detailed account information in results' })
    isDetailed: boolean;
}
