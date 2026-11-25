export enum HeaderTypes {
  consumer = "consumer",
  uuid = "uuid",
  locale = "locale",
  jwt = "jwt",
  text = "text",
}

export interface Header {
  name: string;
  description: string;
  type: HeaderTypes;
}

export const Headers: Record<
  "consumer" | "correlationId" | "requestId" | "locale" | "token" | "apiKey",
  Header
> = {
  consumer: {
    name: "x-consumer",
    description: "consumer id",
    type: HeaderTypes.consumer,
  },
  correlationId: {
    name: "x-correlation-id",
    description: "Correlation id",
    type: HeaderTypes.uuid,
  },
  requestId: {
    name: "x-request-id",
    description: "Request id",
    type: HeaderTypes.uuid,
  },
  locale: {
    name: "x-locale",
    description: "Locale id",
    type: HeaderTypes.locale,
  },
  token: {
    name: "x-token",
    description: "User token",
    type: HeaderTypes.jwt,
  },
  // account: {
  //     name: 'x-account',
  //     description: 'User account',
  //     type: HeaderTypes.text,
  // },
  apiKey: {
    name: "x-api-key",
    description: "API Key",
    type: HeaderTypes.text,
  },
};
