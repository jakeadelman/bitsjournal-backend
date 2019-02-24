import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema, formatArgumentValidationError } from "type-graphql";
import { createConnection } from "typeorm";
import session from "express-session";
import connectRedis from "connect-redis";
import { redis } from "./redis";
import cors from "cors";

import { RegisterResolver } from "./modules/user/Register";
import { LoginResolver } from "./modules/user/Login";
import { MeResolver } from "./modules/user/Me";
import { ConfirmUserResolver } from "./modules/user/ConfirmUser";
// import { FetchTweetResolver } from "./modules/tweet/getTweets";
// import { AddInstaUserResolver } from "./modules/user/instagram/addUser";
// import { AddSearchTermResolver } from "./modules/tweet/addSearchTerm";
// import { FetchTermResolver } from "./modules/user/fetchTerms";
// import { GetDailyTweet } from "./modules/tweet/tweetByHour";
const path = require("path");

const main = async () => {
  await createConnection();
  console.log(process.env.NODE_ENV);
  // console.log(process.env);
  if (process.env.NODE_ENV === "production") {
    console.log("loading production VARS");
    let thePath = path.join(__dirname, "/../envs/prod/.env");
    require("dotenv").config({ path: thePath });
  } else if (process.env.NODE_ENV === "development") {
    let thePath = path.join(__dirname, "/../envs/dev/.env");
    require("dotenv").config({
      path: thePath
    });

    console.log(thePath);
    console.log(process.env.DB_HOST);
    console.log("loading dev VARS");
  }

  const schema = await buildSchema({
    resolvers: [
      RegisterResolver,
      LoginResolver,
      MeResolver,
      ConfirmUserResolver
      // FetchTweetResolver,
      // AddInstaUserResolver,
      // AddSearchTermResolver,
      // FetchTermResolver,
      // GetDailyTweet
    ],
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    }
  });

  const apolloServer = new ApolloServer({
    schema,
    formatError: formatArgumentValidationError,
    context: ({ req }: any) => ({ req })
  });

  const app = Express();

  const RedisStore = connectRedis(session);

  app.use(
    cors({
      credentials: true,
      origin: ["http://localhost:3000", "https://socialslant.io"]
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
        secure: process.env.NODE_ENV === "production",
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
