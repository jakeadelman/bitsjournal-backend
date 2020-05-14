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
const Tweet_1 = require("../entity/Tweet");
const connectionOptions_1 = require("../modules/utils/connectionOptions");
const chalk = require("chalk");
const fetch = require("node-fetch");
exports.format = (subject) => {
    let subjStringified = JSON.stringify(subject);
    let subjParsed = JSON.parse(subjStringified);
    if (subjParsed[0]) {
        return subjParsed.toString();
    }
    else {
        return "null";
    }
};
exports.checkTweet = (array, repository, theTerms) => {
    return new Promise((resolve, reject) => {
        console.log("in check tweet");
        let newRay = [];
        let count = 0;
        array.map((r) => __awaiter(this, void 0, void 0, function* () {
            let isNotSpam = yield checkSpam(r, repository, theTerms);
            if (isNotSpam == true) {
                newRay.push(r);
                count += 1;
                if (count == array.length) {
                    console.log(chalk.green(`>> ${newRay.length} new tweets for term `) +
                        chalk.underline.bold.blue(`${r.query}`));
                    resolve(newRay);
                }
            }
            else {
                count += 1;
                if (count == array.length && !!newRay[0]) {
                    console.log(chalk.green(`>> ${newRay.length} new tweets for term `) +
                        chalk.underline.bold.blue(`${r.query}`));
                    resolve(newRay);
                }
                else if (count == array.length && !newRay[0]) {
                    reject(`no new tweets for term ` + chalk.green(`${r.query}`));
                }
            }
        }));
    });
};
exports.getSentiment = (array) => {
    return new Promise(resolve => {
        let dict = {};
        dict["data"] = array;
        console.log("about to fetch sentiment");
        fetch("http://127.0.0.1:5000/post", {
            method: "post",
            body: JSON.stringify(dict),
            headers: { "Content-Type": "application/json" }
        })
            .then((res) => res.json())
            .then((res) => __awaiter(this, void 0, void 0, function* () {
            let newconn = yield connectionOptions_1.createConn(res[0].query);
            let twRepo = newconn.getRepository(Tweet_1.Tweet);
            for (let i = 0; i < array.length; i++) {
                let r = res[i.toString()];
                let tweet = new Tweet_1.Tweet();
                tweet.query = r.query;
                tweet.tweetId = r.tweetId;
                tweet.timestamp = r.timestamp;
                tweet.currHour = r.currHour;
                tweet.hour = r.hour;
                tweet.screenName = r.screenName;
                tweet.isPinned = r.isPinned;
                tweet.isRetweet = r.isRetweet;
                tweet.isReplyTo = r.isReplyTo;
                tweet.text = r.text;
                tweet.userMentions = r.userMentions;
                tweet.hashtags = r.hashtags;
                tweet.images = r.images;
                tweet.urls = r.urls;
                tweet.replyCount = r.replyCount;
                tweet.retweetCount = r.retweetCount;
                tweet.favoriteCount = r.favoriteCount;
                tweet.polarity = r.polarity;
                yield twRepo
                    .save(tweet)
                    .catch(() => console.log("tweet may have already been added "));
                if (i + 1 == array.length) {
                    console.log(`saved ${array.length} new tweets`);
                    yield newconn.close();
                    resolve(true);
                }
            }
        }));
    });
};
exports.checkNer = (array) => {
    return new Promise(resolve => {
        let dict = {};
        dict["data"] = array;
        console.log("about to perform check2");
        fetch("http://127.0.0.1:5001/post", {
            method: "post",
            body: JSON.stringify(dict),
            headers: { "Content-Type": "application/json" }
        })
            .then((res) => res.json())
            .then((res) => __awaiter(this, void 0, void 0, function* () {
            console.log(res);
            let i = 0;
            console.log(typeof res[i.toString()]);
            if (typeof res[i.toString()] == "undefined") {
                resolve(false);
            }
            let fullRay = [];
            let thisOne;
            let done = false;
            while (done == false) {
                if (typeof res[i.toString()] == "undefined") {
                    console.log(fullRay);
                    resolve(fullRay);
                    done = true;
                }
                else {
                    thisOne = res[i.toString()];
                    fullRay.push(thisOne);
                }
            }
        }));
    });
};
const checkSpam = (tweet, repository, theTerms) => {
    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
        let id = yield repository.findOne({
            tweetId: tweet.tweetId
        });
        if (typeof id !== "undefined") {
            resolve(false);
        }
        if (tweet.text.includes("https://") && tweet.favoriteCount < 2) {
            resolve(false);
        }
        if (tweet.text.includes("http://") && tweet.favoriteCount < 2) {
            resolve(false);
        }
        if (tweet.text.includes(".com") && tweet.favoriteCount < 2) {
            resolve(false);
        }
        if (tweet.text.includes(".co") && tweet.favoriteCount < 2) {
            resolve(false);
        }
        if (tweet.text.includes(".ly") && tweet.favoriteCount < 2) {
            resolve(false);
        }
        let includes = yield checkIncludes(tweet.text, theTerms);
        if (includes == false) {
            resolve(false);
        }
        else {
            resolve(true);
        }
    }));
};
const checkIncludes = (checkString, terms) => {
    return new Promise(resolve => {
        let string = checkString;
        for (let i = 0; i < terms.length; i++) {
            let ans = string.search(new RegExp(terms[i], "i"));
            if (ans !== -1) {
                resolve(true);
            }
            if (i == terms.length - 1) {
                resolve(false);
            }
        }
    });
};
//# sourceMappingURL=tweetFunctions.js.map