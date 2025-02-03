import { ApolloServer } from "@apollo/server";
import { gql } from "graphql-tag";
import { buildFederatedSchema } from "@apollo/federation";
import { startStandaloneServer } from "@apollo/server/standalone";

const typeDefs = gql`
  type Account @key(fields: "id") {
    id: ID!
    name: String
    email: String
    devices: [Device]
  }

  type Device @key(fields: "id") {
    id: ID!
    accountId: ID!
  }

  type Query {
    accounts: [Account]
  }
`;

const resolvers = {
  Query: {
    accounts: () => [
      { id: "1", name: "John Doe", email: "john.doe@example.com" },
      { id: "2", name: "Jane Doe", email: "jane.doe@example.com" },
    ],
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

startStandaloneServer(server, {
  listen: { port: 4001 },
}).then(({ url }) => {
  console.log(`Account Service running at ${url}`);
});
