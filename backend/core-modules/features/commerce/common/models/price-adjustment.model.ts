import { Field, FieldType } from '@api-decorators';
import { Money } from '@feature-shared-models';
import { ObjectType } from '@nestjs/graphql';

const { id, float } = FieldType;

@ObjectType({ description: 'Commerce Price Adjustment' })
export class PriceAdjustment {
    @Field({ description: 'adjustment id' }, id)
    id?: string;

    @Field({ description: 'adjustment alternative id' })
    identifier?: string;

    @Field({ description: 'adjustment name' })
    name?: string;

    @Field({ description: 'adjustment description' })
    description?: string;

    @Field({ description: 'adjustment type' })
    type?: string;

    @Field({ description: 'adjustment code (promo code)' })
    code?: string;

    @Field({ type: () => Money, description: 'adjustment amount' })
    amount?: Money;

    @Field({ description: 'adjustment percent' }, float)
    percent?: number;
}
