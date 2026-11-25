import { InputType, ObjectType } from '@nestjs/graphql';
import { Field } from '@api-decorators';
import { DateRangeInput, ResultSet } from '@feature/models';
import { OrderItem } from '@feature-commerce/order';
import { SortableResultSetQuery } from '@feature/controller/models';

@InputType({ description: 'Purchase History Filter' })
export class PurchaseHistoryFilterInput {
    @Field({ type: () => [String], description: 'order identifiers' })
    identifiers?: string[];

    @Field({ type: () => [String], description: 'order statuses' })
    statuses?: string[];

    @Field({ type: () => DateRangeInput, description: 'Date range' })
    date?: DateRangeInput;
}

@ObjectType({ description: 'Purchased product' })
export class PurchaseHistoryItem extends OrderItem {
    @Field({ description: 'purchased date' })
    purchasedOn: string;
}

@ObjectType({ description: 'Purhchase History Result Set' })
export class PurchaseHistoryResultSet extends ResultSet<PurchaseHistoryItem> {
    @Field({ type: () => [PurchaseHistoryItem], description: 'purchased products' })
    results: PurchaseHistoryItem[];
}

export class PurchaseHistoryResultSetQuery extends SortableResultSetQuery {
    @Field({ type: () => [String], description: 'order identifiers' })
    identifiers?: string[];

    @Field({ type: () => [String], description: 'order statuses' })
    statuses?: string[];

    @Field({ description: 'order date from' })
    dateFrom?: string;

    @Field({ description: 'order date to' })
    dateTo?: string;
}
