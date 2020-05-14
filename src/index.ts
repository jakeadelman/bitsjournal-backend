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
//

const main = async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: resolverArray,
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    },
  });

  const apolloServer = new ApolloServer({
    schema,
    introspection: true,
    playground: true,
    formatError: formatArgumentValidationError,
    context: ({ req }: any) => ({ req }),
  });

  const app = Express();

  const RedisStore = connectRedis(session);

  app.use(
    cors({
      credentials: true,
      origin: [
        "http://localhost:3000",
        "https://socialslant.io",
        "https://bitsjournal.io",
        "https://bitsjournal-frontend.now.sh",
      ],
    })
  );
  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
      }),
      name: "qid",
      secret: "randomstring",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: false,
        // secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
    })
  );

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen({ port: process.env.PORT || 4000 }, () => {
    console.log(`server started on http://localhost:4000/graphql`);
    try {
      require("@dynatrace/oneagent")({
        environmentid: "uma42277",
        apitoken: "kvq4X7AyTbyXoQy0ESAPT",
        // endpoint: "<endpoint url>", // specify endpoint url - not needed for SaaS customers
      });
      console.log("SUCCESS loading oneagent");
    } catch (err) {
      console.log("Failed to load OneAgent: " + err);
    }
  });
};

main();
