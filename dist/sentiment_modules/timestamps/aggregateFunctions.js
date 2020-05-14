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
const Tweet_1 = require("../../../src/entity/Tweet");
const HourSentiment_1 = require("../../../src/entity/sentiment/HourSentiment");
const dateFormat = require("dateformat");
exports.sendToDb = (theHour, connection, term) => {
    return new Promise(resolve => {
        getMinusH(theHour)
            .then((endHour) => __awaiter(this, void 0, void 0, function* () {
            console.log(endHour);
            let twRepo = connection.getRepository(Tweet_1.Tweet);
            let allTweets = yield twRepo.find({
                where: [{ query: term.term, hour: endHour }]
            });
            console.log(`found ${allTweets.length} tweets for ${term.term} from ${endHour}`);
            mapAndGetSentiment(allTweets)
                .then((r) => __awaiter(this, void 0, void 0, function* () {
                let hourSentimentRepo = yield connection.getRepository(HourSentiment_1.HourSentiment);
                let newHourSentiment = new HourSentiment_1.HourSentiment();
                newHourSentiment.hour = parseInt(endHour);
                newHourSentiment.sentiment = parseFloat(r);
                newHourSentiment.term = term.term;
                newHourSentiment.num_tweets = parseInt(allTweets.length);
                yield hourSentimentRepo
                    .save(newHourSentiment)
                    .then(() => console.log("saved correctly"))
                    .catch(() => {
                    console.log("sentiment not saved");
                });
                let res = yield connection
                    .createQueryBuilder()
                    .delete()
                    .from(Tweet_1.Tweet)
                    .where("query = :query AND hour = :hour", {
                    query: term.term,
                    hour: endHour
                })
                    .execute();
                console.log(res);
                resolve(true);
            }))
                .catch((r) => __awaiter(this, void 0, void 0, function* () {
                console.log(r);
                resolve(false);
            }));
        }))
            .catch((err) => console.log(err, "error getting minus hours"));
    });
};
const getMinusH = (theHour) => {
    return new Promise(resolve => {
        console.log(`starting hour is ${theHour}`);
        let utcHour = dateFormat(new Date(), "UTC:yymmddHH");
        let utcHourString = utcHour.toString();
        let endTwoHours = utcHourString[6] + utcHourString[7];
        let newUtc;
        if (endTwoHours == "00") {
            newUtc = parseInt(utcHour) - 77;
            console.log(`ending hour is ${newUtc}`);
            resolve(newUtc.toString());
        }
        else {
            newUtc = parseInt(utcHour) - 1;
            console.log(`ending hour is ${newUtc}`);
            resolve(newUtc.toString());
        }
    });
};
const mapAndGetSentiment = (allTweets) => {
    return new Promise(resolve => {
        let total = 0;
        let sentiment = 0;
        let done = false;
        let overallSentiment;
        allTweets.map(tw => {
            if (parseInt(tw.polarity) == 4) {
                sentiment += 1;
                total += 1;
                if (total == allTweets.length) {
                    overallSentiment = sentiment / total;
                    done = true;
                }
            }
            else if (parseInt(tw.polarity) == 0) {
                total += 1;
                if (total == allTweets.length) {
                    overallSentiment = sentiment / total;
                    done = true;
                }
            }
        });
        if (!!done) {
            console.log("we are done bitch");
            console.log(`overall sentiment is ${overallSentiment}`);
            console.log(`number of tweets is ${allTweets.length}`);
            resolve(overallSentiment);
        }
    });
};
//# sourceMappingURL=aggregateFunctions.js.map