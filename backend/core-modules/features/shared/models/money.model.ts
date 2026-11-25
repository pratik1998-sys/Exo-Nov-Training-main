import { Field } from '@api-decorators';
import { ObjectType, InputType } from '@nestjs/graphql';

@ObjectType({ description: 'representation of a unit of money' })
export class Money {
    @Field({
        description: 'The amount of money. Using string to avoid rounding issues',
    })
    value?: string;

    @Field({
        description: 'The currency associated to the amount',
    })
    currency?: string;
}

@InputType({ description: 'representation of a unit of money for input' })
export class MoneyInput {
    @Field({
        description: 'The amount of money. Using string to avoid rounding issues',
    })
    value?: string;

    @Field({
        description: 'The currency associated to the amount',
    })
    currency?: string;
}
