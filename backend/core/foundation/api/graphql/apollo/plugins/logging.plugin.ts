import { ApolloServerPlugin, GraphQLRequestListener } from "@apollo/server";
import { Plugin } from "@nestjs/apollo";

const resolverTypes = ["Query", "Mutation"];

@Plugin()
export class ApolloRequestContextPlugin implements ApolloServerPlugin {
  async requestDidStart(): Promise<GraphQLRequestListener<any>> {
    const start = new Date().getTime();

    return {
      async executionDidStart(executionRequestContext) {
        const parsingTime = new Date().getTime() - start;

        return {
          willResolveField({ source, args, contextValue, info }) {
            if (resolverTypes.includes(info.parentType.name)) {
              const service = `${info.parentType.name}.${info.fieldName}`;

              const ctx: any = contextValue as any;

              ctx.req.raw.requestContext = ctx.req.raw.requestContext ?? {};

              ctx.req.raw.requestContext.service = service;

              ctx.req.raw.requestContext.graphql = {
                service: service,
                args: args,
                parsingTime: parsingTime,
              };
            }
          },
        };
      },
    };
  }
}
