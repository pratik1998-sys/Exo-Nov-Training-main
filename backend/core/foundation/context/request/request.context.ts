import { Token } from "@token";

export interface RequestContext {
  correlationId?: string;
  requestId?: string;
  service?: string;
  locale?: string;
  language?: string;
  country?: string;
  timezone?: string;
  currency?: string;
  idpUserId?: string;
  consumer?: string;
  graphql?: {
    service: string;
    args: any;
    parsingTime: number;
  };
  tokens?: Record<string, Token>;
  authorizationToken?: string;
  account?: string;
  user?: any;
  integrations?: any[];
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
}
