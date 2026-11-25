import { Field, FieldType } from '@api-decorators';
import { ObjectType } from '@nestjs/graphql';
import { Money } from '@feature-shared-models';
import { ResultSet } from '@feature/models';

const { id } = FieldType;

@ObjectType({ description: 'Commerce Shipping Method' })
export class ShippingMethod {
    @Field({ description: 'shipping method id' }, id)
    id?: string;

    @Field({ description: 'shipping method alternative id' })
    identifier?: string;

    @Field({ description: 'shipping method name' })
    name?: string;

    @Field({ description: 'shipping method description' })
    description?: string;

    @Field({ description: 'shipping method carrier' })
    carrier?: string;

    @Field({ type: () => Money, description: 'shipping method amount' })
    amount?: Money;

    @Field({ description: 'delivery date' })
    deliveryDate?: string;
}

@ObjectType({ description: 'Commerce Shipping Method Result Set' })
export class ShippingMethodResultSet extends ResultSet<ShippingMethod> {
    @Field({ type: () => [ShippingMethod], description: 'shipping methods' })
    results: ShippingMethod[];
}
