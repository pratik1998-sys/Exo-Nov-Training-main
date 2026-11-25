import { RequestContext } from "@context/request";
import { BaseAdminPluginServiceImpl } from "@plugin/service";
import { MessengerLoggingRegistry } from "@messenger";
import {
  AdminMessengerErrors,
  AdminMessengerModel,
  AdminMessengerModelInput,
  AdminMessengerResultSet,
  AdminMessengerService,
} from "@admin-features/messenger";

export class AdminMessengerServiceImpl
  extends BaseAdminPluginServiceImpl
  implements AdminMessengerService
{
  getMessengers(
    requestContext: RequestContext,
    context?: any,
  ): AdminMessengerResultSet {
    const methodname = `${AdminMessengerServiceImpl.name}.getMessengers`;

    const registry: MessengerLoggingRegistry =
      MessengerLoggingRegistry.getInstance();

    const messageRegistry = registry.getMessengerRegistry();

    this.logger.info(
      `${methodname} - Messenger Registry: ${this.logger.formatJSON(messageRegistry)}`,
    );

    const messageList: AdminMessengerModel[] = [];

    Object.keys(messageRegistry).forEach((id) => {
      messageList.push(this.composeMessenger(id, registry));
    });

    return {
      pagination: {
        page: 1,
        pageSize: messageList.length,
        pageCount: 1,
        resultCount: messageList.length,
        hasMorePages: false,
      },
      results: messageList,
    };
  }

  getMessenger(
    id: string,
    requestContext: RequestContext,
    context?: any,
  ): AdminMessengerModel {
    const methodname = `${AdminMessengerServiceImpl.name}.getMessenger`;

    const registry: MessengerLoggingRegistry =
      MessengerLoggingRegistry.getInstance();

    const message = this.composeMessenger(id, registry);

    this.logger.info(
      `${methodname} - Messenger Configuration (${id}): ${this.logger.formatJSON(message)}`,
    );

    return message;
  }

  updateMessenger(
    messageInput: AdminMessengerModelInput,
    requestContext: RequestContext,
    context?: any,
  ) {
    const methodname = `${AdminMessengerServiceImpl.name}.updateMessenger`;

    this.logger.info(
      `${methodname} - Updating message: ${this.logger.formatJSON(messageInput)}`,
    );

    this.validateMessengerInput(requestContext, messageInput);

    const { id, topics } = messageInput;

    const registry: MessengerLoggingRegistry =
      MessengerLoggingRegistry.getInstance();

    topics.forEach((topic) => {
      registry.updateDataValue(`${id}.${topic.id}`, topic.isLoggingEnabled);
    });

    return this.getMessenger(id, requestContext, context);
  }

  updateMessengers(
    messages: AdminMessengerModelInput[],
    requestContext: RequestContext,
    context?: any,
  ): AdminMessengerResultSet {
    const methodname = `${AdminMessengerServiceImpl.name}.updateMessengers`;

    this.logger.info(
      `${methodname} - Updating messages: ${this.logger.formatJSON(messages)}`,
    );

    messages.forEach((message) => {
      this.validateMessengerInput(requestContext, message);
    });

    const messageResults = messages.map((message) =>
      this.updateMessenger(message, requestContext, context),
    );

    return {
      pagination: {
        page: 1,
        pageSize: messageResults.length,
        pageCount: 1,
        resultCount: messageResults.length,
        hasMorePages: false,
      },
      results: messageResults,
    };
  }

  protected validateMessengerInput(
    requestContext: RequestContext,
    messageInput: AdminMessengerModelInput,
  ) {
    const methodname = `${AdminMessengerServiceImpl.name}.validateMessenger`;

    const registry: MessengerLoggingRegistry =
      MessengerLoggingRegistry.getInstance();

    const messageRegistry = registry.getMessengerRegistry();

    const { id, topics } = messageInput;

    if (!messageRegistry[id]) {
      this.logger.info(`${methodname} - Messenger ${id} not found`);
      throw AdminMessengerErrors.messengerNotFound();
    }

    topics.forEach((topic) => {
      if (!messageRegistry[id].includes(topic.id)) {
        this.logger.info(
          `${methodname} - Messenger ${id} topic ${topic} not found`,
        );
        throw AdminMessengerErrors.messengerTopicNotFound();
      }
    });
  }

  protected composeMessenger(
    id: string,
    registry: MessengerLoggingRegistry,
  ): AdminMessengerModel {
    const messageRegistry = registry.getMessengerRegistry();

    const message: AdminMessengerModel = {
      id,
      topics: messageRegistry[id].map((topic) => {
        return {
          id: topic,
          isLoggingEnabled: registry.isMessengerLoggingEnabled(id, topic),
        };
      }),
    };

    return message;
  }
}
