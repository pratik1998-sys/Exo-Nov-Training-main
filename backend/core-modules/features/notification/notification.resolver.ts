import { Args, Query, Resolver } from '@api-decorators';
import { BaseFeatureResolver } from '@feature/resolver';
import { PaginationInput } from '@feature/models';
import { Context } from '@nestjs/graphql';
import { Notification, NotificationResultSet } from './notification.model';
import { NotificationApiConfiguration } from './notification.api.configuration';
import { NotificationModule } from './notification.module';
import { NotificationRequestParameters } from './notification.parameters';
import { NotificationService } from './notification.service';

const feature = NotificationModule.feature;

@Resolver((of) => Notification, { feature })
export class NotificationResolver extends BaseFeatureResolver {
    @Query(() => NotificationResultSet, NotificationApiConfiguration.notifications().queryOptions, feature)
    async notifications(
        // @Args({ parameter: NotificationRequestParameters.filter, type: () => NotificationFilterInput, required: false })
        // filter: NotificationFilterInput,
        @Args({ parameter: NotificationRequestParameters.pagination, type: () => PaginationInput, required: false })
        pagination: PaginationInput,
        @Context()
        context: any,
    ): Promise<NotificationResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<NotificationService>(context, NotificationService);

        const notifications = await service.getNotifications(null, pagination, requestContext, context);

        return notifications;
    }

    @Query(() => Notification, NotificationApiConfiguration.notification().queryOptions, feature)
    async notification(
        @Args({ parameter: NotificationRequestParameters.id, required: true })
        id: string,
        @Context()
        context: any,
    ): Promise<Notification> {
        const { requestContext, service } = this.getRequestContextAndService<NotificationService>(context, NotificationService);

        return await service.getNotification(id, requestContext, context);
    }
}
