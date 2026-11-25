
import { ApiConfiguration, ApiOperationDefinition, ApiOperationOptions } from "@api";
import { Notification, NotificationResultSet } from "./notification.model";
import { NotificationRequestParameters } from "./notification.parameters";


export interface NotificationApiOperations {
    notifications: ApiOperationDefinition;
    notification: ApiOperationDefinition;
}

export class NotificationApiConfiguration extends ApiConfiguration {
    static operations: NotificationApiOperations = {
        notifications: {
            id: 'notifications',
            description: 'Get notifications',
            summary: 'Get notifications',
            isAuthRequired: false,
            restOptions: {
                apiOkResponseOptions: {
                    type: NotificationResultSet,
                },
                tags: [],
            },
            queryOptions: {
                required: false,
            },
        },
        notification: {
            id: 'notification',
            description: 'Get notification',
            summary: 'Get notification',
            isAuthRequired: false,
            restOptions: {
                isById: true,
                path: `:${NotificationRequestParameters.id.id}`,
                apiOkResponseOptions: {
                    type: Notification,
                },
                tags: [],
            },
            queryOptions: {
                required: false,
            },
        },
    };

    static notifications(): ApiOperationOptions {
        return this.composeOperationOptions(NotificationApiConfiguration.operations.notifications);
    }

    static notification(): ApiOperationOptions {
        return this.composeOperationOptions(NotificationApiConfiguration.operations.notification);
    }
}
