import { AdminMessengerApiConfiguration } from "./admin-messenger.api.configuration";
import { AdminMessengerModule } from "./admin-messenger.module";
import { AdminMessengerRequestParameters } from "./admin-messenger.parameters";
import { AdminMessengerService } from "./admin-messenger.service";
import {
  AdminMessengerModel,
  AdminMessengersUpdateBody,
  AdminMessengerResultSet,
} from "./admin-messenger.model";
import { Controller, Get, Put } from "@api-decorators";
import { BaseAdminFeatureController } from "@feature/controller";
import { Body, Param, Req } from "@nestjs/common";
import { FastifyRequest } from "fastify";

const feature = AdminMessengerModule.feature;

@Controller({ tags: "admin", path: "admin/message", feature })
export class AdminMessengerController extends BaseAdminFeatureController {
  @Get(AdminMessengerApiConfiguration.messengers().restOptions, feature)
  async messengers(
    @Req() request: FastifyRequest,
  ): Promise<AdminMessengerResultSet> {
    const { requestContext, service } =
      this.getRequestContextAndService<AdminMessengerService>(
        request,
        AdminMessengerService,
      );

    return await service.getMessengers(requestContext, request);
  }

  @Get(AdminMessengerApiConfiguration.messenger().restOptions, feature)
  async messenger(
    @Param(AdminMessengerRequestParameters.id.id) id: string,
    @Req() request: FastifyRequest,
  ): Promise<AdminMessengerModel> {
    const { requestContext, service } =
      this.getRequestContextAndService<AdminMessengerService>(
        request,
        AdminMessengerService,
      );

    return await service.getMessenger(id, requestContext, request);
  }

  @Put(AdminMessengerApiConfiguration.messengersUpdate().restOptions, feature)
  async messengersUpdate(
    // @Param(AdminMessengerRequestParameters.id.id) id: string,
    @Body() body: AdminMessengersUpdateBody,
    @Req() request: FastifyRequest,
  ): Promise<AdminMessengerResultSet> {
    const { requestContext, service } =
      this.getRequestContextAndService<AdminMessengerService>(
        request,
        AdminMessengerService,
      );

    return await service.updateMessengers(
      body.messages,
      requestContext,
      request,
    );
  }
}
