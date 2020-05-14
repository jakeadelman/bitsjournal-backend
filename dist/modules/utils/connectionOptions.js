"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
exports.createConn = (name) => {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        if (process.env.NODE_ENV === "production") {
            const connection = yield typeorm_1.createConnection({
                name: name,
                type: "postgres",
                host: "bitsjournal-db-do-user-3307088-0.a.db.ondigitalocean.com",
                port: 25061,
                username: "doadmin",
                password: "xndvas26gehlgnn2",
                database: "newpool",
                ssl: { rejectUnauthorized: false },
                logging: false,
                entities: [
                    __dirname + "/../../entity/*.*",
                    __dirname + "/../../entity/instagram/*.*",
                    __dirname + "/../../entity/sentiment/*.*",
                ],
            });
            console.log(`created connection ${name}`);
            resolve(connection);
        }
        else if (process.env.NODE_ENV === "development") {
            const connection = yield typeorm_1.createConnection({
                name: name,
                type: "postgres",
                host: "localhost",
                port: 5432,
                username: "manx",
                password: "jakeadelman",
                database: "instagauge",
                logging: false,
                entities: [
                    __dirname + "/../../entity/*.*",
                    __dirname + "/../../entity/instagram/*.*",
                    __dirname + "/../../entity/sentiment/*.*",
                ],
            });
            console.log(`created connection ${name}`);
            resolve(connection);
        }
        else {
            reject(new Error("env not known"));
        }
    }));
};
exports.createConns = (name) => {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        if (process.env.NODE_ENV === "production") {
            const connections = yield typeorm_1.createConnections([
                {
                    name: `${name}1`,
                    type: "postgres",
                    host: "bitsjournal-db-do-user-3307088-0.a.db.ondigitalocean.com",
                    port: 25061,
                    username: "doadmin",
                    password: "xndvas26gehlgnn2",
                    database: "newpool",
                    ssl: { rejectUnauthorized: false },
                    logging: false,
                    entities: [
                        __dirname + "/../../entity/*.*",
                        __dirname + "/../../entity/instagram/*.*",
                        __dirname + "/../../entity/sentiment/*.*",
                    ],
                },
                {
                    name: `${name}2`,
                    type: "postgres",
                    host: "bitsjournal-db-do-user-3307088-0.a.db.ondigitalocean.com",
                    port: 25061,
                    username: "doadmin",
                    password: "xndvas26gehlgnn2",
                    database: "newpool",
                    ssl: { rejectUnauthorized: false },
                    logging: false,
                    entities: [
                        __dirname + "/../../entity/*.*",
                        __dirname + "/../../entity/instagram/*.*",
                        __dirname + "/../../entity/sentiment/*.*",
                    ],
                },
            ]);
            console.log(`created connections ${name}1 and ${name}2`);
            resolve(connections);
        }
        else if (process.env.NODE_ENV === "development") {
            const connections = yield typeorm_1.createConnections([
                {
                    name: `${name}1`,
                    type: "postgres",
                    host: "localhost",
                    port: 5432,
                    username: "manx",
                    password: "jakeadelman",
                    database: "instagauge",
                    logging: false,
                    entities: [
                        __dirname + "/../../entity/*.*",
                        __dirname + "/../../entity/instagram/*.*",
                        __dirname + "/../../entity/sentiment/*.*",
                    ],
                },
                {
                    name: `${name}2`,
                    type: "postgres",
                    host: "localhost",
                    port: 5432,
                    username: "manx",
                    password: "jakeadelman",
                    database: "instagauge",
                    logging: false,
                    entities: [
                        __dirname + "/../../entity/*.*",
                        __dirname + "/../../entity/instagram/*.*",
                        __dirname + "/../../entity/sentiment/*.*",
                    ],
                },
            ]);
            console.log(`created connections ${name}1 and ${name}2`);
            resolve(connections);
        }
        else {
            reject(new Error("env not known"));
        }
    }));
};
//# sourceMappingURL=connectionOptions.js.map