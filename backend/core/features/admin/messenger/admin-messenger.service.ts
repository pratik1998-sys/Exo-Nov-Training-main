import { RequestContext } from "@context/request";
import {
  AdminMessengerModel,
  AdminMessengerModelInput,
  AdminMessengerResultSet,
} from "./admin-messenger.model";
import { BaseFeatureService } from "@feature/service";

export abstract class AdminMessengerService extends BaseFeatureService {
  abstract getMessengers(
    requestContext: RequestContext,
    context?: any,
  ): AdminMessengerResultSet;
  abstract getMessenger(
    id: string,
    requestContext: RequestContext,
    context?: any,
  ): AdminMessengerModel;
  abstract updateMessenger(
    message: AdminMessengerModelInput,
    requestContext: RequestContext,
    context?: any,
  ): AdminMessengerModel;
  abstract updateMessengers(
    messages: AdminMessengerModelInput[],
    requestContext: RequestContext,
    context?: any,
  ): AdminMessengerResultSet;
}
