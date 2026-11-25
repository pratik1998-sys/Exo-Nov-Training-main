import { AdminRegistryApiConfiguration } from "./admin-registry.api.configuration";
import { AdminRegistryModule } from "./admin-registry.module";
import { AdminRegistryRequestParameters } from "./admin-registry.parameters";
import { AdminRegistryModel } from "./admin-registry.model";
import { AdminRegistryService } from "./admin-registry.service";
import { Controller, Get, Put } from "@api-decorators";
import { Param, Req } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { BaseAdminFeatureController } from "@feature/controller";

const feature = AdminRegistryModule.feature;

@Controller({ tags: "admin", path: "admin/registry", feature })
export class AdminRegistryController extends BaseAdminFeatureController {
  @Get(AdminRegistryApiConfiguration.registries().restOptions, feature)
  async registries(@Req() request: FastifyRequest): Promise<string[]> {
    const { requestContext, service } =
      this.getRequestContextAndService<AdminRegistryService>(
        request,
        AdminRegistryService,
      );

    return service.getRegistries(requestContext, request);
  }

  @Get(AdminRegistryApiConfiguration.registry().restOptions, feature)
  async registry(
    @Param(AdminRegistryRequestParameters.id.id) id: string,
    @Req() request: FastifyRequest,
  ): Promise<AdminRegistryModel> {
    const { requestContext, service } =
      this.getRequestContextAndService<AdminRegistryService>(
        request,
        AdminRegistryService,
      );

    return {
      data: await service.getRegistryData(id, requestContext, request),
    };
  }

  @Put(AdminRegistryApiConfiguration.registryRefresh().restOptions, feature)
  async registryRefresh(
    @Param(AdminRegistryRequestParameters.id.id) id: string,
    @Req() request: FastifyRequest,
  ): Promise<AdminRegistryModel> {
    const { requestContext, service } =
      this.getRequestContextAndService<AdminRegistryService>(
        request,
        AdminRegistryService,
      );

    return {
      data: await service.refreshRegistry(id, requestContext, request),
    };
  }
}
