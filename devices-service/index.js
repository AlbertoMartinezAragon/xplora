import { ApolloServer } from "@apollo/server";
import { gql } from "graphql-tag";
import { buildFederatedSchema } from "@apollo/federation";

const typeDefs = gql`
  type Device @key(fields: "id") {
    id: ID!
    accountId: ID!
    name: String!
    account: Account @requires(fields: "accountId")
  }

  extend type Account @key(fields: "id") {
    id: ID! @external
    name: String!
    devices: [Device]
  }

  type Query {
    devices: [Device]
  }
`;

const resolvers = {
  Query: {
    devices: () => [
      { id: "101", name: "iPhone 13", accountId: "1" },
      { id: "102", name: "Samsung Galaxy", accountId: "2" },
    ],
  },
  Device: {
    account: (device) => {
      return { id: device.accountId };
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

import { startStandaloneServer } from "@apollo/server/standalone";

startStandaloneServer(server, {
  listen: { port: 4002 },
}).then(({ url }) => {
  console.log(`Devices Service running at ${url}`);
});
