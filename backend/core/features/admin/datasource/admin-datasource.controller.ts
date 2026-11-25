import { AdminDatasourceApiConfiguration } from "./admin-datasource.api.configuration";
import { AdminDatasourceModule } from "./admin-datasource.module";
import { AdminDatasourceRequestParameters } from "./admin-datasource.parameters";
import {
  AdminDatasourceServiceInputModel,
  AdminDatasourceServiceModel,
  AdminDatasourceServiceModelResultSet,
  AdminDatasourceServicesUpdateBody,
} from "./admin-datasource.model";
import { AdminDatasourceService } from "./admin-datasource.service";
import { Controller, Get, Put } from "@api-decorators";
import { BaseAdminFeatureController } from "@feature/controller";
import { Body, Param, Req } from "@nestjs/common";
import { FastifyRequest } from "fastify";

const feature = AdminDatasourceModule.feature;

@Controller({ tags: "admin", path: "admin/datasource", feature })
export class AdminDatasourceController extends BaseAdminFeatureController {
  @Get(
    AdminDatasourceApiConfiguration.datasourceServices().restOptions,
    feature,
  )
  async datasourceServices(
    @Req() request: FastifyRequest,
  ): Promise<AdminDatasourceServiceModelResultSet> {
    const { requestContext, service } =
      this.getRequestContextAndService<AdminDatasourceService>(
        request,
        AdminDatasourceService,
      );

    return await service.getDatasourceServices(requestContext, request);
  }

  @Get(AdminDatasourceApiConfiguration.datasourceService().restOptions, feature)
  async datasourceService(
    @Param(AdminDatasourceRequestParameters.id.id) id: string,
    @Req() request: FastifyRequest,
  ): Promise<AdminDatasourceServiceModel> {
    const { requestContext, service } =
      this.getRequestContextAndService<AdminDatasourceService>(
        request,
        AdminDatasourceService,
      );

    return await service.getDatasourceService(id, requestContext, request);
  }

  @Put(
    AdminDatasourceApiConfiguration.datasourceServiceUpdate().restOptions,
    feature,
  )
  async datasourceServiceUpdate(
    @Param(AdminDatasourceRequestParameters.id.id) id: string,
    @Body() body: AdminDatasourceServiceInputModel,
    @Req() request: FastifyRequest,
  ): Promise<AdminDatasourceServiceModel> {
    const { requestContext, service } =
      this.getRequestContextAndService<AdminDatasourceService>(
        request,
        AdminDatasourceService,
      );

    return await service.updateDatasourceService(
      id,
      body,
      requestContext,
      request,
    );
  }
}
