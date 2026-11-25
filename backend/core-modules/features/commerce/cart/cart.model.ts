import { InputType, ObjectType } from '@nestjs/graphql';
import { Field } from '@api-decorators';
import { AddressInput, Address } from '@feature-address';
import { QuoteShippingMethodInput, QuoteItemAddInput, QuoteItemUpdateInput, QuoteItemDeleteInput, QuoteItem, ShippingMethod, PaymentMethodOption, QuoteItemResultSet, Quote } from '@feature-commerce/common';
import { MoneyInput } from '@feature-shared-models';
import { ResultSetQuery } from '@feature/controller/models';
import { Order } from '@feature-commerce/order';

@InputType({ description: ' Cart Address Input' })
export class CartAddressInput extends AddressInput {
    @Field({ description: 'id' })
    id?: string;

    @Field({ type: () => Boolean, description: 'save address to address book' })
    doSave?: boolean;
}

@InputType({ description: ' Cart Address Input' })
export class CartBillingAddressInput extends AddressInput {
    @Field({ type: () => Boolean, description: 'same as shipping address' })
    sameAsShipping?: boolean;
}

@InputType({ description: ' Cart Update Input' })
export class CartUpdateInput {
    @Field({ description: 'email' })
    email?: string;

    @Field({ description: 'phone' })
    phone?: string;
}

@InputType({ description: 'Payment Method Input' })
export class CartPaymentMethodInput {
    @Field({ description: 'The id for the payment method' })
    id: string;

    @Field({ description: 'The identifier for the payment method' })
    identifier: string;

    @Field({ description: 'Payment method type' })
    type: string;

    @Field({ description: 'Payment method account number' })
    account: string;

    @Field({ description: 'Payment method expiration month' })
    expirationMonth: string;

    @Field({ description: 'Payment method expiration year' })
    expirationYear: string;

    @Field({ description: 'Payment method cvv' })
    cvv: string;

    @Field({ description: 'Payment method token' })
    token: string;

    @Field({ type: () => MoneyInput, description: 'Payment method amount' })
    amount: MoneyInput;

    @Field({ type: () => CartAddressInput, description: 'Payment method address' })
    address: CartAddressInput;
}

@InputType({ description: 'Shipping Method Input' })
export class CartShippingMethodInput extends QuoteShippingMethodInput { }

@InputType({ description: 'Commerce Cart Item Add Input' })
export class CartItemAddInput extends QuoteItemAddInput {
    @Field({ type: () => CartShippingMethodInput, description: 'shipping method of the item' })
    shippingMethod?: CartShippingMethodInput;
}

@InputType({ description: 'Commerce Cart Item Update Input' })
export class CartItemUpdateInput extends QuoteItemUpdateInput { }

@InputType({ description: 'Commerce Cart Item Delete Input' })
export class CartItemDeleteInput extends QuoteItemDeleteInput { }

@ObjectType({ description: 'Commerce Cart' })
export class CartItem extends QuoteItem {
    @Field({ description: 'estimated shipping date' })
    estimatedShippingDate?: string;
}

@ObjectType({ description: 'Cart Shipping Options' })
export class CartShippingOptions {
    @Field({ type: () => [ShippingMethod], description: 'cart shipping methods' })
    shippingMethods: ShippingMethod[];

    @Field({ type: () => [Address], description: 'cart shipping addresses' })
    addresses: Address[];
}

@ObjectType({ description: 'Cart Payment Options' })
export class CartPaymentOptions {
    @Field({ type: () => [PaymentMethodOption], description: 'cart payment methods' })
    paymentMethods: PaymentMethodOption[];

    @Field({ type: () => [Address], description: 'cart billing addresses' })
    addresses: Address[];
}

@ObjectType({ description: 'Item Result Set' })
export class CartItemResultSet extends QuoteItemResultSet {
    @Field({ type: () => [CartItem], description: 'cart items' })
    results: CartItem[];
}

@ObjectType({ description: 'Commerce Cart' })
export class Cart extends Quote {
    @Field({ description: 'estimated shipping date' })
    estimatedShippingDate?: string;

    @Field({ type: () => CartItemResultSet, description: 'cart item results' })
    items?: CartItemResultSet;

    @Field({ description: 'cart checkout url' })
    checkoutUrl?: string;
}

@ObjectType({ description: 'Commerce Checked OutCart' })
export class CartCheckout extends Order { }

export class CartItemsAddInputBody {
    @Field({ type: () => [CartItemAddInput], description: 'items to add', required: true })
    items: CartItemAddInput[];
}

export class CartItemsUpdateInputBody {
    @Field({ type: () => [CartItemUpdateInput], description: 'items to update', required: true })
    items: CartItemUpdateInput[];
}

export class CartItemsDeleteInputBody {
    @Field({ type: () => [CartItemDeleteInput], description: 'items to delete', required: true })
    items: CartItemDeleteInput[];
}

export class CartShippingUpdateInputBody {
    @Field({ type: () => CartShippingMethodInput, description: 'shipping method to update', required: true })
    shippingMethod: CartShippingMethodInput;

    @Field({ type: () => CartAddressInput, description: 'address to update', required: true })
    address: CartAddressInput;
}

export class CartPaymentAddInputBody {
    @Field({ type: () => [CartPaymentMethodInput], description: 'payments to add', required: true })
    payments: CartPaymentMethodInput[];

    @Field({ type: () => Boolean, description: 'is payment split - will not delete all other payments if true', required: true })
    isSplitPayment: boolean;
}

export class CartCouponAddInputBody {
    @Field({ description: 'coupon code to add', required: true })
    couponCode: string;
}

export class CartPresubmitInputBody {
    @Field({ description: 'cart id', required: false })
    id: string;
}

export class CartShippingMethodsQuery extends ResultSetQuery { }
