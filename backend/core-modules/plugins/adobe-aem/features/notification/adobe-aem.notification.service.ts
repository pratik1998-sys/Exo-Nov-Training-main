import { AdobeAEMBaseServiceImpl, AdobeAEMConsumerConfiguration } from "@plugin-adobe-aem/common";
import { AdobeAEMNotificationDatasource } from "./adobe-aem.notification.datasource";
import { AdobeAEMNotificationMapper } from "./adobe-aem.notification.mapper";
import { Notification, NotificationErrors, NotificationFilterInput, NotificationResultSet, NotificationService } from "@feature-notification";
import { RequestContext } from "@context/request";
import { PaginationInput } from "@feature/models";


export class AdobeAEMNotificationServiceImpl extends AdobeAEMBaseServiceImpl implements NotificationService {
    async getNotifications(filter: NotificationFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<NotificationResultSet> {
        const methodname = `${AdobeAEMNotificationServiceImpl.name}.getNotifications`;

        let result = null;

        try {
            result = await this.getDatasource<AdobeAEMNotificationDatasource>(requestContext).getNotifications(requestContext);

            result = result?.data?.alertList?.items.length > 0 ? result.data.alertList.items : [];

            result = result.filter((obj) => {
                return obj.isActive;
            });
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching notifications data: ${error}`);
            throw NotificationErrors.getNotificationsFailed();
        }

        return this.getMapper<AdobeAEMNotificationMapper>(requestContext).mapNotificationResultSet(requestContext, result);
    }

    async getNotification(id: string, requestContext: RequestContext, context?: any): Promise<Notification> {
        const methodname = `${AdobeAEMNotificationServiceImpl.name}.getNotification`;

        const notificationResultSet = await this.getNotifications(null, null, requestContext, context);

        let notification: Notification = null;

        const notifications = notificationResultSet.results;

        if (notifications && notifications != null) {
            notification = notifications.find((obj) => {
                return obj.id == id;
            });
        }

        return notification;
    }
}
