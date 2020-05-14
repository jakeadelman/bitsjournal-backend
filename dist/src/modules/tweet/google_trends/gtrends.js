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
const gTrends_1 = require("../../../entity/google_trends/gTrends");
const gTrends_2 = require("../../../sentiment_modules/gTrends");
let GoogleTrendsResolver = class GoogleTrendsResolver {
    fetchGoogleTrend(currency, time, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ctx.req.session.userId) {
                return undefined;
            }
            if (time == "day") {
                let endDate = new Date();
                let startDate = new Date();
                startDate.setDate(startDate.getDate() - 1);
                return yield gTrends_2.fetchGTrends(startDate, endDate, currency);
            }
            if (time == "week") {
                let endDate = new Date();
                let startDate = new Date();
                startDate.setDate(startDate.getDate() - 300);
                return yield gTrends_2.fetchGTrends(startDate, endDate, currency);
            }
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [gTrends_1.GoogleTrends]),
    __param(0, type_graphql_1.Arg("currency")),
    __param(1, type_graphql_1.Arg("time")),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], GoogleTrendsResolver.prototype, "fetchGoogleTrend", null);
GoogleTrendsResolver = __decorate([
    type_graphql_1.Resolver()
], GoogleTrendsResolver);
exports.GoogleTrendsResolver = GoogleTrendsResolver;
//# sourceMappingURL=gtrends.js.map