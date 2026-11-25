import { HttpException } from "@nestjs/common";
import { FeatureErrors, FeatureErrorsType } from "@feature/error";
import { ErrorType } from "@error";

export interface AdminMessengerErrorsType extends FeatureErrorsType {
  messageNotFound: ErrorType;
  messageTopicNotFound: ErrorType;
}

export class AdminMessengerErrors extends FeatureErrors {
  protected static errors: AdminMessengerErrorsType = {
    ...FeatureErrors.errors,
    messageNotFound: {
      code: "ADMIN_MESSENGER_NOT_FOUND",
      message: "Messenger not found",
      statusCode: 400,
    },
    messageTopicNotFound: {
      code: "ADMIN_MESSENGER_TOPIC_NOT_FOUND",
      message: "Messenger topic not found",
      statusCode: 400,
    },
  };

  static messengerNotFound(): HttpException {
    return this.composeHTTPError(this.errors.messengerNotFound);
  }

  static messengerTopicNotFound(): HttpException {
    return this.composeHTTPError(this.errors.messengerTopicNotFound);
  }
}
