import { BaseErrors, ErrorsType, ErrorType } from "@error";
import { HttpException } from "@nestjs/common";

export interface RegistryErrorsType extends ErrorsType {
  registryNotFound: ErrorType;
}

export class RegistryErrors extends BaseErrors {
  protected static errors: RegistryErrorsType = {
    ...BaseErrors.errors,
    registryNotFound: {
      code: "REGISTRY_NOT_FOUND",
      message: "Registry not found",
      statusCode: 400,
    },
  };

  static registryNotFound(): HttpException {
    return this.composeHTTPError(this.errors.registryNotFound);
  }
}
