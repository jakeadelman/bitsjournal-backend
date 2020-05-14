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
const instaUser_1 = require("../../entity/instagram/instaUser");
const typeorm_1 = require("typeorm");
exports.fetchDan = (instaUser, instaUsername, instaPassword) => {
    var Client = require("instagram-private-api").V1;
    var device = new Client.Device(instaUsername);
    var storage = new Client.CookieFileStorage(__dirname + `/cookies/${instaUsername}.json`);
    return new Promise((resolve) => {
        console.log("about to create session");
        Client.Session.create(device, storage, instaUsername, instaPassword)
            .then(function (session) {
            return [session, Client.Account.searchForUser(session, instaUser)];
        })
            .spread(function (session, account) {
            return __awaiter(this, void 0, void 0, function* () {
                var feed = new Client.Feed.UserMedia(session, account.id);
                var getty = feed.get();
                return [session, getty];
            });
        })
            .spread((session, results) => __awaiter(this, void 0, void 0, function* () {
            let res = results[0];
            let id = res.id;
            let comments = new Client.Feed.MediaComments(session, id);
            comments.iteration = 2;
            comments.get().then(r => {
                r.map(comm => {
                    console.log(comm);
                });
            });
            resolve(true);
        }));
    });
};
const startMain = () => __awaiter(this, void 0, void 0, function* () {
    const user = "momo_52_mo";
    const pass = "jakeadelman";
    let entLo1 = __dirname + "/../../entity/*.*";
    let entLo2 = __dirname + "/../../entity/instagram/*.*";
    const connection = yield typeorm_1.createConnection({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "manx",
        password: "jakeadelman",
        database: "instagauge",
        entities: [entLo1, entLo2]
    });
    let instaUserRepo = yield connection.getRepository(instaUser_1.InstaUser);
    let instaUserList = yield instaUserRepo.find({ select: ["name"] });
    let mappedList = yield mapToList(instaUserList);
    console.log(mappedList);
    setInterval(function () {
        mappedList.map(instaUser => {
            exports.fetchDan(instaUser, user, pass);
        });
    }, 10000);
});
const mapToList = list => {
    return new Promise(resolve => {
        let arr = [];
        list.map(u => {
            arr.push(u.name);
        });
        resolve(arr);
    });
};
startMain();
//# sourceMappingURL=fetchPosts.js.map