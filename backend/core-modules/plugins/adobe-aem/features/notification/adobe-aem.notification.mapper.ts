import { RequestContext } from "@context/request";
import { Notification, NotificationResultSet } from "@feature-notification";
import { BaseMapper } from "@plugin/mapper";

export class AdobeAEMNotificationMapper extends BaseMapper {
    mapNotificationResultSet(requestContext: RequestContext, dsResult: any): NotificationResultSet {
        const notifications = this.mapNotifications(requestContext, dsResult);

        return {
            pagination: {
                page: 1,
                pageSize: notifications.length ?? 0,
                pageCount: 1,
                resultCount: notifications.length ?? 0,
                hasMorePages: false,

            },
            results: notifications
        };
    }

    mapNotifications(requestContext: RequestContext, dsResult: any): Notification[] {
        const notifications: Notification[] = dsResult.map((dsNotification) => {
            return this.mapNotification(requestContext, dsNotification);
        });

        return notifications;
    }

    mapNotification(requestContext: RequestContext, dsNotification: any): Notification {
        const notification = {
            id: dsNotification.id,
            header: null,
            description: dsNotification.description,
        };

        return notification;
    }
}
