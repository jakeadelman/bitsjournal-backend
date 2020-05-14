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
const scrape_twitter_1 = __importDefault(require("scrape-twitter"));
const Tweet_1 = require("../entity/Tweet");
const SearchTerm_1 = require("../entity/SearchTerm");
const Currency_1 = require("../entity/Currency");
const tweetFunctions_1 = require("./tweetFunctions");
const connectionOptions_1 = require("../modules/utils/connectionOptions");
const dateFormat = require("dateformat");
const chalk = require("chalk");
const getTweets = (word, by, searchTermRepository) => {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        let arr = [];
        let st = word + " lang:en";
        const stream = new scrape_twitter_1.default.TweetStream(st, by, { count: 50 });
        let conns = yield connectionOptions_1.createConns(word);
        const tweetRepository = conns[0].getRepository(Tweet_1.Tweet);
        stream.on("error", (r) => {
            console.log("got error");
            return `here is err: ${r}`;
        });
        stream.on("data", (data) => __awaiter(this, void 0, void 0, function* () {
            let daty = JSON.stringify(data);
            let dat = JSON.parse(daty);
            console.log(data);
            let userMentions = tweetFunctions_1.format(dat.userMentions);
            let hashtags = tweetFunctions_1.format(dat.hashtags);
            let images = tweetFunctions_1.format(dat.images);
            let urls = tweetFunctions_1.format(dat.urls);
            let now = new Date();
            let currHour = dateFormat(now, "yymmddHH");
            let concatHour = dat.time;
            let str1 = concatHour.substring(2, 4);
            let str2 = concatHour.substring(5, 7);
            let str3 = concatHour.substring(8, 10);
            let str4 = concatHour.substring(11, 13);
            concatHour = str1 + str2 + str3 + str4;
            const variables = {
                tweetId: dat.id,
                query: word,
                timestamp: dat.time,
                currHour: currHour,
                hour: concatHour,
                screenName: dat.screenName,
                isRetweet: dat.isRetweet,
                isPinned: dat.isPinned,
                isReplyTo: dat.isReplyTo,
                text: dat.text,
                userMentions: userMentions,
                hashtags: hashtags,
                images: images,
                urls: urls,
                replyCount: parseInt(dat.replyCount),
                retweetCount: parseInt(dat.retweetCount),
                favoriteCount: parseInt(dat.favoriteCount)
            };
            arr.push(variables);
        }));
        stream.on("end", () => __awaiter(this, void 0, void 0, function* () {
            console.log(`found ${arr.length} tweets for ${word}`);
            if (arr.length == 0) {
                yield conns[0].close();
                yield conns[1].close();
                reject("no new tweets");
            }
            else {
                let theTerm = yield searchTermRepository.findOne({
                    where: { term: word },
                    relations: ["currency"]
                });
                let currRepo = yield conns[0].getRepository(Currency_1.Currency);
                let curr = yield currRepo.findOne({
                    where: { name: theTerm.currency.name },
                    relations: ["terms"]
                });
                let terms = [];
                for (let r = 0; r < curr.terms.length; r++) {
                    terms.push(curr.terms[r].term);
                }
                if (curr && curr.additional_terms) {
                    for (let i = 0; i < curr.additional_terms.length; i++) {
                        terms.push(curr.additional_terms[i]);
                    }
                }
                tweetFunctions_1.checkTweet(arr, tweetRepository, terms)
                    .then((r) => __awaiter(this, void 0, void 0, function* () {
                    return r;
                }))
                    .then((r) => {
                    tweetFunctions_1.getSentiment(r)
                        .then((r) => __awaiter(this, void 0, void 0, function* () {
                        yield conns[0].close();
                        yield conns[1].close();
                        resolve(r);
                    }))
                        .catch((err) => __awaiter(this, void 0, void 0, function* () {
                        yield conns[0].close();
                        yield conns[1].close();
                        reject(new Error(err));
                    }));
                })
                    .catch((r) => __awaiter(this, void 0, void 0, function* () {
                    yield conns[0].close();
                    yield conns[1].close();
                    reject(chalk.red(`>> ${r}`));
                }));
            }
        }));
    }));
};
setInterval(function () {
    return __awaiter(this, void 0, void 0, function* () {
        let connections = yield connectionOptions_1.createConns("fetchtws");
        console.log(`[` + chalk.blue(`PG`) + `]:` + chalk.green(` opened connections`));
        let searchTermRepository = connections[0].getRepository(SearchTerm_1.SearchTerm);
        let terms = yield searchTermRepository.find({ select: ["term"] });
        let count = 0;
        terms.map(term => {
            console.log(`[` +
                chalk.green(`FETCH`) +
                `]` +
                `: fetching tweets for term ` +
                chalk.underline.bold.green(`${term.term}`));
            getTweets(term.term, "latest", searchTermRepository)
                .then((r) => {
                console.log(r);
                count += 1;
                if (count == terms.length) {
                    connections[1].close();
                    connections[0].close();
                    console.log(`[` + chalk.blue(`PG`) + `]:` + chalk.red(` closed connections`));
                }
            })
                .catch((r) => {
                count += 1;
                console.log(`${r}`);
                if (count == terms.length) {
                    connections[1].close();
                    connections[0].close();
                    console.log(`[` + chalk.blue(`PG`) + `]:` + chalk.red(` closed connections`));
                }
            });
        });
    });
}, 3000);
//# sourceMappingURL=fetchTweetsPromise.js.map