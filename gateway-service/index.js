import { ApolloServer } from "apollo-server-express";
import express from "express";
import { ApolloGateway, IntrospectAndCompose } from "@apollo/gateway";

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: "account", url: "http://account-service:4001/graphql" },
      { name: "devices", url: "http://devices-service:4002/graphql" },
    ],
  }),
});

const server = new ApolloServer({
  gateway,
  subscriptions: false,
  cors: {
    origin: "http://localhost:8081", // Allow the frontend's origin
    methods: ["GET", "POST"],
  },
});
const app = express();

// Root route to indicate server is working
app.get("/", (req, res) => {
  res.send(
    "Apollo Server is running. Go to /graphql to interact with the API."
  );
});

// Start the Apollo server and apply middleware
server.start().then(() => {
  server.applyMiddleware({ app, path: "/graphql" });

  app.listen(4000, () => {
    console.log("Server is running at http://localhost:4000/graphql");
  });
});
