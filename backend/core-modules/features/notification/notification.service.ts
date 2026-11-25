import { RequestContext } from "@context/request";
import { PaginationInput } from "@feature/models";
import { BaseFeatureService } from "@feature/service";
import { Notification, NotificationFilterInput, NotificationResultSet } from "./notification.model";

export abstract class NotificationService extends BaseFeatureService {
    abstract getNotifications(filter: NotificationFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<NotificationResultSet>;
    abstract getNotification(id: string, requestContext: RequestContext, context?: any): Promise<Notification>;
}
