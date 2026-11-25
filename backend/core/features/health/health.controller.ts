import { Controller, Get } from "@api-decorators";
import { BaseAdminFeatureController } from "@feature/controller";
import { HealthApiConfiguration, HealthModule, HealthResponse } from "@health";
import { Req } from "@nestjs/common";
import { FastifyRequest } from "fastify";

export const healthPath = "health";

const feature = HealthModule.feature;

@Controller({ tags: "health", path: healthPath, feature })
export class HealthController extends BaseAdminFeatureController {
  @Get(HealthApiConfiguration.health().restOptions, feature)
  async getHealth(@Req() request: FastifyRequest): Promise<HealthResponse> {
    return {
      status: "UP",
    };
  }
}
