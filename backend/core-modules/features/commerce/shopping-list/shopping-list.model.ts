import { InputType, ObjectType } from '@nestjs/graphql';
import { Field, FieldType } from '@api-decorators';
import { Item, ItemCollection } from '@feature-commerce/common';
import { ResultSet } from '@feature/models';

const { id: idField, integer } = FieldType;

@InputType({ description: 'Shopping list input' })
export class ShoppingListInput {
    @Field({ description: 'Human-readable name' })
    name?: string;
}

@InputType({ description: 'Shopping list line add input' })
export class ShoppingListItemAddInput {
    @Field({ description: 'Product identifier (sku, key, etc.)' })
    identifier?: string;

    @Field({ description: 'Quantity' }, integer)
    quantity?: number;

    @Field({ description: 'Line notes' })
    notes?: string;
}

@InputType({ description: 'Shopping list line update input' })
export class ShoppingListItemUpdateInput {
    @Field({ description: 'Line item id' }, idField)
    id?: string;

    @Field({ description: 'Quantity' }, integer)
    quantity?: number;

    @Field({ description: 'Line notes' })
    notes?: string;
}

@InputType({ description: 'Shopping list line delete input' })
export class ShoppingListItemDeleteInput {
    @Field({ description: 'Line item id' }, idField)
    id: string;
}

@ObjectType({ description: 'Shopping list line (no cart/quote pricing or tax fields)' })
export class ShoppingListItem extends Item { }

@ObjectType({ description: 'Shopping list line result set' })
export class ShoppingListItemResultSet extends ResultSet<ShoppingListItem> {
    @Field({ type: () => [ShoppingListItem], description: 'lines' })
    results: ShoppingListItem[];
}

@ObjectType({ description: 'Shopping list (no cart/quote totals, tax, coupons, or payments)' })
export class ShoppingList extends ItemCollection {
    @Field({ description: 'Name' })
    name?: string;

    @Field({ type: () => ShoppingListItemResultSet, description: 'Lines' })
    items?: ShoppingListItemResultSet;
}

@ObjectType({ description: 'Shopping list result set' })
export class ShoppingListResultSet extends ResultSet<ShoppingList> {
    @Field({ type: () => [ShoppingList], description: 'lists' })
    results: ShoppingList[];
}

export class ShoppingListItemsAddInputBody {
    @Field({ type: () => [ShoppingListItemAddInput], description: 'lines to add', required: true })
    items: ShoppingListItemAddInput[];
}

export class ShoppingListItemsUpdateInputBody {
    @Field({ type: () => [ShoppingListItemUpdateInput], description: 'lines to update', required: true })
    items: ShoppingListItemUpdateInput[];
}

export class ShoppingListItemsDeleteInputBody {
    @Field({ type: () => [ShoppingListItemDeleteInput], description: 'lines to remove', required: true })
    items: ShoppingListItemDeleteInput[];
}
