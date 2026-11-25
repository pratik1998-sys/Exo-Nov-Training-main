
import { Field, FieldType } from '@api-decorators';
import { Address } from '@feature-address';
import { Money } from '@feature-shared-models';
import { ObjectType } from '@nestjs/graphql';

const { id } = FieldType;

@ObjectType({ description: 'Commerce Payment Method Additional Data' })
export class PaymentMethodAdditionalData {
    @Field({ description: 'additional data name' })
    name?: string;

    @Field({ description: 'additional data value' })
    value?: string;
}

@ObjectType({ description: 'Commerce Payment Method Option' })
export class PaymentMethodOption {
    @Field({ description: 'payment method id' }, id)
    id?: string;

    @Field({ description: 'payment method identifier' })
    identifier?: string;

    @Field({ description: 'payment method type' })
    type?: string;

    @Field({ description: 'payment method name' })
    name?: string;

    @Field({ description: 'payment method description' })
    description?: string;
}

@ObjectType({ description: 'Commerce Cart Payment Method' })
export class PaymentMethod extends PaymentMethodOption {
    @Field({ description: 'payment method account' })
    account?: string;

    @Field({ description: 'payment method expiration month' })
    expirationMonth?: string;

    @Field({ description: 'payment method expiration year' })
    expirationYear?: string;

    @Field({ description: 'payment method cvv' })
    cvv?: string;

    @Field({ type: () => Money, description: 'payment method amount' })
    amount?: Money;

    @Field({ type: () => Address, description: 'payment method address' })
    address?: Address;

    @Field({ type: () => [PaymentMethodAdditionalData], description: 'additional data' })
    additionalData?: PaymentMethodAdditionalData[];
}
