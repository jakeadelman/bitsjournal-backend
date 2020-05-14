"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const redis_1 = require("./redis");
const cors_1 = __importDefault(require("cors"));
const resolvers_1 = require("./resolvers");
const main = () => __awaiter(this, void 0, void 0, function* () {
    yield typeorm_1.createConnection();
    const schema = yield type_graphql_1.buildSchema({
        resolvers: resolvers_1.resolverArray,
        authChecker: ({ context: { req } }) => {
            return !!req.session.userId;
        },
    });
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema,
        introspection: true,
        playground: true,
        formatError: type_graphql_1.formatArgumentValidationError,
        context: ({ req }) => ({ req }),
    });
    const app = express_1.default();
    const RedisStore = connect_redis_1.default(express_session_1.default);
    app.use(cors_1.default({
        credentials: true,
        origin: [
            "http://localhost:3000",
            "https://socialslant.io",
            "https://bitsjournal.io",
            "https://bitsjournal-frontend.now.sh",
        ],
    }));
    app.use(express_session_1.default({
        store: new RedisStore({
            client: redis_1.redis,
        }),
        name: "qid",
        secret: "randomstring",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: false,
            maxAge: 1000 * 60 * 60 * 24 * 7 * 365,
        },
    }));
    apolloServer.applyMiddleware({ app, cors: false });
    app.listen({ port: process.env.PORT || 4000 }, () => {
        console.log(`server started on http://localhost:4000/graphql`);
        try {
            require("@dynatrace/oneagent")({
                environmentid: "uma42277",
                apitoken: "kvq4X7AyTbyXoQy0ESAPT",
            });
            console.log("SUCCESS loading oneagent");
        }
        catch (err) {
            console.log("Failed to load OneAgent: " + err);
        }
    });
});
main();
//# sourceMappingURL=index.js.map