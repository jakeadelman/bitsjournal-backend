import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema, formatArgumentValidationError } from "type-graphql";
import { createConnection } from "typeorm";
import session from "express-session";
import connectRedis from "connect-redis";
import { redis } from "./redis";
import cors from "cors";
import { resolverArray } from "./resolvers";

const main = async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: resolverArray,
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    }
  });

  const apolloServer = new ApolloServer({
    schema,
    introspection: true,
    playground: true,
    formatError: formatArgumentValidationError,
    context: ({ req }: any) => ({ req })
  });

  const app = Express();

  const RedisStore = connectRedis(session);

  app.use(
    cors({
      credentials: true,
      origin: [
        "http://localhost:3000",
        "https://socialslant.io",
        "https://tradrr.app",
        "https://tradrr-dev.now.sh"
      ]
    })
  );
  app.use(
    session({
      store: new RedisStore({
        client: redis as any
      }),
      name: "qid",
      secret: "randomstring",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: false,
        // secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years
      }
    })
  );

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log(`server started on http://localhost:4000/graphql`);
  });
};

main();
