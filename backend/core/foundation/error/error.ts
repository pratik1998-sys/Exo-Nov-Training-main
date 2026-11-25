import { HttpException } from "@nestjs/common";

export interface ErrorType {
  code: string;
  message: string;
  statusCode: number;
}

export interface ErrorsType {
  [key: string]: ErrorType;
}

export class BaseErrors {
  protected static errors: ErrorsType = {};

  protected static composeHTTPError = (error: ErrorType) => {
    return new HttpException(error.code, error.statusCode);
  };
}
