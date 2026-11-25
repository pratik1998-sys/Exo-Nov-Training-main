import { Field } from '@api-decorators';
import { ResultSetQuery } from '@feature/controller/models';
import { ResultSet } from '@feature/models';
import { InputType, ObjectType } from '@nestjs/graphql';

@InputType({ description: 'Notification Filter Input' })
export class NotificationFilterInput { }

@ObjectType({ description: 'Notification' })
export class Notification {
    @Field({ description: 'notification id', required: false })
    id: string;

    @Field({ description: 'notification header', required: false })
    header: string;

    @Field({ description: 'notification description', required: false })
    description: string;
}

@ObjectType({ description: 'Notification Result Set' })
export class NotificationResultSet extends ResultSet<Notification> {
    @Field({ type: () => [Notification], description: 'notifications' })
    results?: Notification[];
}

export class NotificationResultSetQuery extends ResultSetQuery { }
