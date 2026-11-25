import { InputType, ObjectType } from '@nestjs/graphql';
import { Field, FieldType } from '@api-decorators';
import { Item, ItemBasePricing, ItemCollection, ItemResultSet } from './item.model';
import { PaymentMethod } from './payment-method.model';
import { PriceAdjustment } from './price-adjustment.model';
import { ShippingMethod } from './shipping-method.model';
import { Tax } from './tax.model';
import { Money } from '@feature-shared-models';
import { Address } from '@feature-address';

const { integer } = FieldType;

@ObjectType({ description: 'Commerce Cart/Order Payment Method' })
export class ItemQuotePaymentMethod extends PaymentMethod {
    @Field({ type: () => Money, description: 'payment method amount' })
    amount?: Money;

    @Field({ type: () => Address, description: 'payment method address' })
    address?: Address;
}

@ObjectType({ description: 'Item Quote base pricing' })
export class ItemQuoteBasePricing extends ItemBasePricing {
    @Field({ type: () => [PriceAdjustment], description: 'price adjustments' })
    adjustments?: PriceAdjustment[];

    @Field({ type: () => [Tax], description: 'taxes' })
    taxes?: Tax[];

    @Field({ type: () => Money, description: 'total tax' })
    tax?: Money;

    @Field({ type: () => Money, description: 'total adjustment' })
    adjustment?: Money;

    @Field({ type: () => Money, description: 'total + taxes' })
    amountWithTax?: Money;

    @Field({ type: () => Money, description: 'total + adjustments' })
    amountWithAdjustment?: Money;

    @Field({ type: () => Money, description: 'total + taxes + adjustments' })
    amountWithTaxAndAdjustment?: Money;

    @Field({ type: () => Money, description: 'shipping' })
    shipping?: Money;
}

@ObjectType({ description: 'Commerce Cart Order Base' })
export class ItemQuotePricing extends ItemQuoteBasePricing {
    @Field({ type: () => Money, description: 'item price' })
    price?: Money;
}

@ObjectType({ description: 'Commerce Cart Order Base' })
export class ItemQuoteCollectionPricing extends ItemQuoteBasePricing {
    @Field({ type: () => Money, description: 'grand total' })
    total?: Money;
}

@InputType({ description: 'Item Quote Input' })
export class QuoteItemInput {
    @Field({ description: 'quantity' }, integer)
    quantity?: number;
}

@InputType({ description: 'Shipping Method Input' })
export class QuoteShippingMethodInput {
    @Field({ description: 'Shipping method id' })
    id: string;

    @Field({ description: 'Shipping method id' })
    identifier: string;

    @Field({ description: 'Shipping method type' })
    type: string;
}

@InputType({ description: 'Item Quote Add Input' })
export class QuoteItemAddInput extends QuoteItemInput {
    @Field({ description: 'product identifier to add' })
    identifier?: string;

    @Field({ type: () => [String], description: 'option ids of the configurable product / dynamic product' })
    options?: string[];
}

@InputType({ description: 'Item Quote Update Input' })
export class QuoteItemUpdateInput extends QuoteItemInput {
    @Field({ description: 'item id to update' })
    id?: string;
}

@InputType({ description: 'Item Quote Delete Input' })
export class QuoteItemDeleteInput {
    @Field({ description: 'item id to delete' })
    id?: string;
}

@ObjectType({ description: 'Item Quote Collection - Base for Cart and Order' })
export class QuoteItem extends Item {
    @Field({ type: () => ItemQuotePricing, description: 'pricing' })
    pricing?: ItemQuotePricing;

    @Field({ description: 'shipped date' })
    shipDate?: string;

    @Field({ description: 'delivery date' })
    deliveryDate?: string;
}

@ObjectType({ description: 'Item Result Set' })
export class QuoteItemResultSet extends ItemResultSet {
    @Field({ type: () => [QuoteItem], description: 'item results' })
    results: QuoteItem[];
}

@ObjectType({ description: 'Item Quote Collection - Base for Cart and Order' })
export class Quote extends ItemCollection {
    @Field({ description: 'PO Number' })
    purchaseOrderNumber?: string;

    @Field({ type: () => ItemQuoteCollectionPricing, description: 'Item Quote Collection Pricing' })
    pricing?: ItemQuoteCollectionPricing;

    @Field({ description: 'cart email address' })
    email?: string;

    @Field({ description: 'cart phone number' })
    phone?: string;

    @Field({ type: () => Address, description: 'shipping address' })
    shippingAddress?: Address;

    @Field({ type: () => Address, description: 'billing address' })
    billingAddress?: Address;

    @Field({ type: () => ShippingMethod, description: 'applied shipping method' })
    shippingMethod?: ShippingMethod;

    @Field({ type: () => [ItemQuotePaymentMethod], description: 'applied payment methods' })
    paymentMethods?: ItemQuotePaymentMethod[];

    @Field({ description: 'shipped date' })
    shipDate?: string;

    @Field({ description: 'delivery date' })
    deliveryDate?: string;

    @Field({ description: 'Total Item Quantity' })
    itemQuantity?: number;

    @Field({ type: () => QuoteItemResultSet, description: 'item results' })
    items?: QuoteItemResultSet;
}
