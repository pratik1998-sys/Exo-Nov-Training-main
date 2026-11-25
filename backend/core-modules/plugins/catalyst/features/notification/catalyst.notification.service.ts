import { Notification, NotificationFilterInput, NotificationResultSet, NotificationService } from "@feature-notification";
import { RequestContext } from "@context/request";
import { PaginationInput } from "@feature/models";
import { CatalystNotificationConsumerConfiguration, CatalystNotificationConsumerOption } from "core-modules/plugins/catalyst/features/notification/types/catalyst.configuration.type";
import { BasePluginServiceImpl } from "@plugin/service";


export class CatalystNotificationServiceImpl extends BasePluginServiceImpl implements NotificationService {
    async getNotifications(filter: NotificationFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<NotificationResultSet> {
        const methodname = `${CatalystNotificationServiceImpl.name}.getNotifications`;

        const notifications = this.fetchNotifications(requestContext);

        return {
            pagination: {
                page: 1,
                pageSize: notifications.length,
                resultCount: notifications.length,
                pageCount: 1,
                hasMorePages: false,
            },
            results: notifications.map((notification) => {
                const label = notification.description.find((label) => label.locale === requestContext.locale);
                return {
                    id: notification.id,
                    header: label?.value ?? notification.id,
                    description: label?.value ?? notification.id,
                };
            }),
        };
    }

    async getNotification(id: string, requestContext: RequestContext, context?: any): Promise<Notification> {
        const methodname = `${CatalystNotificationServiceImpl.name}.getNotification`;

        const notificationResultSet = await this.getNotifications(null, null, requestContext, context);

        const notification = notificationResultSet.results.find((notification) => notification.id === id);

        return notification;
    }

    protected fetchNotifications(requestContext: RequestContext): CatalystNotificationConsumerOption[] {
        const { configuration } = this.getPluginConsumerConfiguration<CatalystNotificationConsumerConfiguration>(requestContext);

        const { notifications } = configuration;

        return notifications ?? [];
    }
}
