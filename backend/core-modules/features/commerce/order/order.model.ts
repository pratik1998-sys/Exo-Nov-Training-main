import { InputType, ObjectType } from '@nestjs/graphql';
import { Field } from '@api-decorators';
import { DateRangeInput, ResultSet } from '@feature/models';
import { Quote, QuoteItem, QuoteItemResultSet } from '@feature-commerce/common';
import { ResultSetQuery, SortableResultSetQuery } from '@feature/controller/models';

@InputType({ description: 'Order Input' })
export class OrderInput {
    @Field({ description: 'status' })
    status: string;

    @Field({ description: 'purchaseOrderNumber' })
    purchaseOrderNumber?: string;
}

@InputType({ description: 'Order Filter' })
export class OrderFilterInput {
    @Field({ type: () => [String], description: 'identifier' })
    identifiers?: string[];

    @Field({ type: () => [String], description: 'status' })
    statuses?: string[];

    @Field({ type: () => DateRangeInput, description: 'Date range' })
    date?: DateRangeInput;

    @Field({ description: 'Email associated to order' })
    email?: string;

    @Field({ description: 'Postal code associated to order' })
    postalCode?: string;
}

@ObjectType({ description: 'Commerce Order Item' })
export class OrderItem extends QuoteItem { }

@ObjectType({ description: 'Item Result Set' })
export class OrderItemResultSet extends QuoteItemResultSet {
    @Field({ type: () => [OrderItem], description: 'order item results' })
    results: OrderItem[];
}

@ObjectType({ description: 'Commerce Order Status' })
export class OrderStatus {
    @Field({ description: 'order status id' })
    id?: string;

    @Field({ description: 'order status identifier' })
    identifier?: string;

    @Field({ description: 'order status name' })
    name?: string;

    @Field({ description: 'order status description' })
    description?: string;
}

@ObjectType({ description: 'Commerce Order' })
export class Order extends Quote {
    @Field({ description: 'order number' })
    orderNumber?: string;

    @Field({ type: () => OrderItemResultSet, description: 'order item results' })
    items?: OrderItemResultSet;
}

@ObjectType({ description: 'Order Result Set' })
export class OrderResultSet extends ResultSet<Order> {
    @Field({ type: () => [Order], description: 'order results' })
    results?: Order[];
}

@ObjectType({ description: 'Order Status Result Set' })
export class OrderStatusResultSet extends ResultSet<OrderStatus> {
    @Field({ type: () => [OrderStatus], description: 'order status results' })
    results?: OrderStatus[];
}

// export class OrdersGetInput {
//     @Field({ type: () => Boolean, description: 'fetch detailed order data' })
//     isDetailed: boolean;

//     @Field({ type: () => OrderFilterInput, description: 'order filter' })
//     filter: OrderFilterInput;

//     @Field({ type: () => PaginationInput, description: 'order pagination' })
//     pagination: PaginationInput;

//     @Field({ type: () => SortByInput, description: 'order sorting' })
//     sortBy: SortByInput;
// }

export class OrderResultSetQuery extends SortableResultSetQuery {
    @Field({ type: () => Boolean, description: 'fetch detailed order data' })
    isDetailed: boolean;

    @Field({ type: () => [String], description: 'identifier' })
    identifiers?: string[];

    @Field({ type: () => [String], description: 'status' })
    statuses?: string[];

    @Field({ description: 'Date from' })
    dateFrom?: string;

    @Field({ description: 'Date to' })
    dateTo?: string;

    @Field({ description: 'Email associated to order' })
    email?: string;

    @Field({ description: 'Postal code associated to order' })
    postalCode: string;
}

export class OrderStatusResultSetQuery extends ResultSetQuery { }
