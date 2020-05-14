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
const typeorm_1 = require("typeorm");
const DailyTweet_1 = require("../../entity/DailyTweet");
const Tweet_1 = require("../../entity/Tweet");
const connectionOptions_1 = require("../utils/connectionOptions");
const dateformat = require("dateformat");
let GetDailyTweet = class GetDailyTweet {
    getDailyTweet(query, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ctx.req.session.userId) {
                return undefined;
            }
            let connection = yield connectionOptions_1.createConn("twbyhconn");
            let now = new Date();
            let formatNow = dateformat(now, "yymmddHH");
            let formatMinus24 = formatNow - 24;
            console.log(formatNow, formatMinus24);
            const loaded = yield connection.getRepository(Tweet_1.Tweet).find({
                where: { query: query, hour: typeorm_1.Between(formatMinus24, formatNow) }
            });
            let negCount = 0;
            let posCount = 0;
            let dailyT = new DailyTweet_1.DailyTweet();
            loaded.map(load => {
                if (load.polarity == 1) {
                    posCount += 1;
                }
                else if (load.polarity == 0) {
                    negCount += 1;
                }
                let together = posCount + negCount;
                if (together == loaded.length) {
                    dailyT.day = formatNow;
                    dailyT.negative = negCount;
                    dailyT.positive = posCount;
                    dailyT.total = loaded.length;
                }
            });
            connection.close();
            return yield dailyT;
        });
    }
};
__decorate([
    type_graphql_1.Query(() => DailyTweet_1.DailyTweet),
    __param(0, type_graphql_1.Arg("query")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GetDailyTweet.prototype, "getDailyTweet", null);
GetDailyTweet = __decorate([
    type_graphql_1.Resolver()
], GetDailyTweet);
exports.GetDailyTweet = GetDailyTweet;
//# sourceMappingURL=tweetByHour.js.map