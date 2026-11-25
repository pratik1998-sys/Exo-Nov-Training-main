import { ObjectType } from '@nestjs/graphql';
import { Field, FieldType } from '@api-decorators';
import { Money } from '@feature-shared-models';

const { id, float } = FieldType;

@ObjectType({ description: ' Commerce Offer' })
export class Offer {
    @Field({ description: 'offer id' }, id)
    id: string;

    @Field({ description: 'offer identifier' })
    identifier: string;

    @Field({ description: 'offer description' })
    description: string;

    @Field({ description: 'start date' })
    startDate: string;

    @Field({ description: 'end date' })
    endDate: string;

    @Field({ type: () => Money, description: 'Amount off' })
    amount: Money;

    @Field({ description: 'Percent off' }, float)
    percent: number;
}
