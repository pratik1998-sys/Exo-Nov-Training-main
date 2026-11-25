import { BaseErrors, ErrorsType, ErrorType } from "@error";
import { HttpException } from "@nestjs/common";

export interface FeatureErrorsType extends ErrorsType {
  invalidConsumer: ErrorType;
  paginationMaxSizeExceeded: ErrorType;
}

export class FeatureErrors extends BaseErrors {
  protected static errors: FeatureErrorsType = {
    invalidConsumer: {
      code: "INVALID_CONSUMER",
      message: "Invalid consumer id",
      statusCode: 400,
    },
    paginationMaxSizeExceeded: {
      code: "PAGINATION_MAX_SIZE_EXCEEDED",
      message: "Pagination max size exceeded",
      statusCode: 400,
    },
  };

  static invalidConsumer(): HttpException {
    return this.composeHTTPError(this.errors.invalidConsumer);
  }

  static paginationMaxSizeExceeded(): HttpException {
    return this.composeHTTPError(this.errors.paginationMaxSizeExceeded);
  }
}
