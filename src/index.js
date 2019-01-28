// import { ApolloServer } from "apollo-server-express";
// import Express from "express";
// import "reflect-metadata";
// import { formatArgumentValidationError } from "type-graphql";
// import { createConnection } from "typeorm";
// import session from "express-session";
// import connectRedis from "connect-redis";
// import { redis } from "./redis";
// import cors from "cors";
// import jwt from "express-jwt";

import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import * as jwt from "express-jwt";

import { schema } from "./schema";

const app = express();
const path = "/graphql";

// Create a GraphQL server
const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    const context = {
      req,
      user: req.user // `req.user` comes from `express-jwt`
    };
    return context;
  }
});

// Mount a jwt or other authentication middleware that is run before the GraphQL execution
app.use(
  path,
  jwt({
    secret: "TypeGraphQL",
    credentialsRequired: false
  })
);

// Apply the GraphQL server middleware
server.applyMiddleware({ app, path });

// Launch the express server
app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);

// const main = async () => {
//   await createConnection();

//   const schema = await buildSchema({
//     resolvers: [
//       RegisterResolver,
//       LoginResolver,
//       MeResolver,
//       ConfirmUserResolver
//     ]
//     // authChecker: ({ context: { req } }) => {
//     //   return !!req.session.userId;
//     // }
//   });

//   const apolloServer = new ApolloServer({
//     schema,
//     formatError: formatArgumentValidationError,
//     context: ({ req }): any => {
//       const context = {
//         req,
//         user: req.user // `req.user` comes from `express-jwt`
//       };
//       return context;
//     }
//   });

//   const app = Express();

//   const RedisStore = connectRedis(session);

//   app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

//   // const corsOptions = {
//   //   credentials: true,
//   //   origin: "http://localhost:3000"
//   // };

//   app.use(
//     session({
//       store: new RedisStore({
//         client: redis as any
//       }),
//       name: "qid",
//       secret: "randomstring",
//       resave: false,
//       saveUninitialized: false,
//       cookie: {
//         httpOnly: false,
//         // httpOnly: false,
//         // secure: process.env.NODE_ENV === "production",
//         maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years
//       }
//     })
//   );

//   apolloServer.applyMiddleware({ app });

//   app.listen(4000, () => {
//     console.log("server started on http://localhost:4000/graphql");
//   });
// };

// main();
