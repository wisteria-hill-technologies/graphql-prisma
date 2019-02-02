import { GraphQLServer, PubSub } from 'graphql-yoga';
import { resolvers, fragmentReplacements } from './resolvers/index';
import prisma from './prisma.js';

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context(request) {
    // need request.request.headers for Authorization (JWT) token in the headers.
    return {
      pubsub,
      prisma,
      request
    }
  },
  fragmentReplacements
});

export { server as default };
