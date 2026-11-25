import { Controller, Get } from '@api-decorators';
import { BaseFeatureController } from '@feature/controller';
import { ResultSetQueryType } from '@feature/controller/types';
import { Param, Query, Req } from '@nestjs/common';
import { Notification, NotificationFilterInput, NotificationResultSet, NotificationResultSetQuery } from './notification.model';
import { NotificationApiConfiguration } from './notification.api.configuration';
import { NotificationModule } from './notification.module';
import { NotificationRequestParameters } from './notification.parameters';
import { FastifyRequest } from 'fastify';
import { NotificationService } from './notification.service';

const paths = {
    root: 'notification',
};

const feature = NotificationModule.feature;

@Controller({ tags: 'notification', path: paths.root, feature })
export class NotificationController extends BaseFeatureController {
    @Get(NotificationApiConfiguration.notifications().restOptions, feature)
    async notifications(@Req() request: FastifyRequest, @Query() query: NotificationResultSetQuery): Promise<NotificationResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<NotificationService>(request, NotificationService);

        const resultSetQuery: ResultSetQueryType = this.processResultSetQuery(query);

        const { pagination } = resultSetQuery;

        const filter: NotificationFilterInput = null;

        return await service.getNotifications(filter, pagination, requestContext, request);
    }

    @Get(NotificationApiConfiguration.notification().restOptions, feature)
    async notification(@Param(NotificationRequestParameters.id.id) id: string, @Req() request: FastifyRequest): Promise<Notification> {
        const { requestContext, service } = this.getRequestContextAndService<NotificationService>(request, NotificationService);

        return await service.getNotification(id, requestContext, request);
    }
}
