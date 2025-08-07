import { ApolloServerPlugin } from 'apollo-server-plugin-base';

export function LoggingPlugin(): ApolloServerPlugin {
  return {
    async requestDidStart(requestContext) {
      console.log(
        'GraphQL Request started',
        requestContext.request.operationName,
      );

      return {
        async willSendResponse(responseContext) {
          console.log(
            'GraphQL Response sent for',
            responseContext.request.operationName,
          );
        },
      };
    },
  };
}
