import { InputType, ObjectType } from '@nestjs/graphql';
import { Field, FieldType } from '@api-decorators';
import { Alert, EntityFilterInput, Money } from '@feature-shared-models';
import { Product } from '@feature-commerce/product';
import { ResultSet } from '@feature/models';


const { id, integer } = FieldType;

@InputType({ description: 'Item Filter' })
export class ItemFilterInput {
    @Field({ description: 'search term' })
    term?: string;

    @Field({ type: () => [EntityFilterInput], description: 'items to filter by' })
    item?: EntityFilterInput;

    @Field({ type: () => [EntityFilterInput], description: 'products to filter by' })
    product?: EntityFilterInput;
}

@ObjectType({ description: 'Item Reward' })
export class ItemReward {
    @Field({ description: 'reward amount' }, integer)
    amount?: number;

    @Field({ description: 'reward unit of measure' })
    uom: string;
}

@ObjectType({ description: 'Item Collection Pricing' })
export class ItemBasePricing {
    @Field({ type: () => Money, description: 'item total' })
    amount?: Money;
}

@ObjectType({ description: 'Item Pricing' })
export class ItemPricing extends ItemBasePricing {
    @Field({ type: () => Money, description: 'item price' })
    price?: Money;
}

@ObjectType({ description: 'Item Option Value' })
export class ItemOptionValue {
    @Field({ description: 'item option value id' }, id)
    id?: string;

    @Field({ description: 'item option value identifier' })
    identifier?: string;

    @Field({ description: 'item option value description' })
    description?: string;
}

@ObjectType({ description: 'Item Option' })
export class ItemOption {
    @Field({ description: 'item option id' }, id)
    id?: string;

    @Field({ description: 'item option identifier' })
    identifier?: string;

    @Field({ description: 'item option description' })
    description?: string;

    @Field({ type: () => ItemOptionValue, description: 'item option value' })
    value?: ItemOptionValue;
}

@ObjectType({ description: 'Item' })
export class Item {
    @Field({ description: 'item id' }, id)
    id?: string;

    @Field({ description: 'item alternate id' })
    identifier?: string;

    @Field({ description: 'quantity' }, integer)
    quantity?: number;

    @Field({ description: 'notes' })
    notes?: string;

    @Field({ description: 'status' })
    status?: string;

    @Field({ type: () => [ItemReward], description: 'rewards' })
    rewards?: ItemReward[];

    @Field({ type: () => ItemPricing, description: 'pricing' })
    pricing?: ItemPricing;

    @Field({ type: () => Product, description: 'item product' })
    product?: Product;

    @Field({ type: () => [ItemOption], description: 'configurable item option' })
    options?: ItemOption[];
}

@ObjectType({ description: 'Item Result Set' })
export class ItemResultSet extends ResultSet<Item> {
    @Field({ type: () => [Item], description: 'items' })
    results: Item[];
}

@ObjectType({ description: 'Item Collection Note' })
export class ItemCollectionNote {
    @Field({ description: 'note' })
    note?: string;

    @Field({ description: 'created on' })
    createdOn?: string;
}

@ObjectType({ description: 'Item Collection Coupon' })
export class ItemCollectionCoupon {
    @Field({ description: 'coupon id' })
    id?: string;

    @Field({ description: 'coupon identifier' })
    identifier?: string;

    @Field({ description: 'coupon code' })
    code?: string;

    @Field({ description: 'coupon name' })
    name?: string;

    @Field({ description: 'coupon description' })
    description?: string;
}

@ObjectType({ description: 'Item Collection' })
export class ItemCollection {
    @Field({ description: 'item collection id' }, id)
    id?: string;

    @Field({ description: 'item collection alternative id' })
    identifier?: string;

    @Field({ type: () => [ItemCollectionNote], description: 'item collection notes' })
    notes?: ItemCollectionNote[];

    @Field({ type: () => ItemBasePricing, description: 'Item Collection Pricing' })
    pricing?: ItemBasePricing;

    @Field({ type: () => [ItemCollectionCoupon], description: 'item collection coupon' })
    coupons?: ItemCollectionCoupon[];

    @Field({ type: () => [ItemReward], description: 'item collection rewards' })
    rewards?: ItemReward[];

    @Field({ description: 'status' })
    status?: string;

    @Field({ type: () => [Alert], description: 'warnings' })
    warnings?: Alert[];

    @Field({ type: () => [Alert], description: 'errors' })
    errors?: Alert[];

    @Field({ type: () => [Alert], description: 'notifications' })
    notifications?: Alert[];

    @Field({ description: 'order create date' })
    createdOn?: string;

    @Field({ description: 'order update date' })
    updatedOn?: string;

    @Field({ type: () => ItemResultSet, description: 'item results' })
    items?: ItemResultSet;
}
