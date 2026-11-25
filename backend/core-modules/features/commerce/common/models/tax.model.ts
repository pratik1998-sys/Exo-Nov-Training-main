import { Field } from '@api-decorators';
import { Money } from '@feature-shared-models';
import { ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Commerce Cart Order Tax' })
export class Tax {
    @Field({ description: 'tax id' })
    id?: string;

    @Field({ description: 'tax alternate id' })
    identifier?: string;

    @Field({ description: 'tax description' })
    description?: string;

    @Field({ type: () => Money, description: 'tax amount' })
    amount?: Money;
}
