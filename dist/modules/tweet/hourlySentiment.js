"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const connectionOptions_1 = require("../utils/connectionOptions");
const Currency_1 = require("../../entity/Currency");
const HourSentiment_1 = require("../../entity/sentiment/HourSentiment");
const Sentiment_1 = require("../../entity/sentiment/Sentiment");
let HourSentimentResolver = class HourSentimentResolver {
    hourSentiment(currency, hoursBack, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("ok");
            if (!ctx.req.session.userId) {
                return undefined;
            }
            let hoursBackInt = parseInt(hoursBack);
            let uidStr = ctx.req.session.userId.toString();
            let connection = yield connectionOptions_1.createConn("hoursentconn" + "-uid-" + uidStr);
            let currencyRepo = connection.getRepository(Currency_1.Currency);
            let sentimentRepo = connection.getRepository(HourSentiment_1.HourSentiment);
            let currencyFind = yield currencyRepo.findOne({
                where: { name: currency },
                relations: ["terms"]
            });
            if (!currencyFind) {
                return false;
            }
            let thisSenti;
            let newSent = new Sentiment_1.Sentiment();
            newSent.currency = currency;
            newSent.time = [];
            newSent.num_tweets = [];
            newSent.sentiment = [];
            for (let i = 0; i < currencyFind.terms.length; i++) {
                thisSenti = yield sentimentRepo.find({
                    where: { term: currencyFind.terms[i].term },
                    order: { id: "DESC" },
                    take: hoursBackInt
                });
                console.log(thisSenti);
                for (let r = 0; r < thisSenti.length; r++) {
                    if (i == 0) {
                        console.log(thisSenti[r].hour);
                        newSent.time.push(parseInt(thisSenti[r].hour));
                        newSent.sentiment.push(parseFloat(thisSenti[r].sentiment));
                        newSent.num_tweets.push(thisSenti[r].num_tweets);
                    }
                    else {
                        newSent.sentiment[r] =
                            newSent.sentiment[r] + parseFloat(thisSenti[r].sentiment);
                        newSent.num_tweets[r] =
                            newSent.num_tweets[r] + thisSenti[r].num_tweets;
                    }
                }
                console.log(newSent);
            }
            console.log(currencyFind.terms.length, thisSenti.length);
            let num = currencyFind.terms.length;
            for (let o = 0; o < newSent.sentiment.length; o++) {
                newSent.sentiment[o] = newSent.sentiment[o] / num;
            }
            connection.close();
            return newSent;
        });
    }
};
__decorate([
    type_graphql_1.Query(() => Sentiment_1.Sentiment),
    __param(0, type_graphql_1.Arg("currency")),
    __param(1, type_graphql_1.Arg("hoursBack")),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], HourSentimentResolver.prototype, "hourSentiment", null);
HourSentimentResolver = __decorate([
    type_graphql_1.Resolver()
], HourSentimentResolver);
exports.HourSentimentResolver = HourSentimentResolver;
//# sourceMappingURL=hourlySentiment.js.map