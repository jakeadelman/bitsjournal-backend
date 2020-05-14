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
const Currency_1 = require("../../entity/Currency");
const connectionOptions_1 = require("../utils/connectionOptions");
let AllCurrenciesResolver = class AllCurrenciesResolver {
    allCurrencies(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ctx.req.session.userId) {
                console.log("not logged in");
                return null;
            }
            let connection = yield connectionOptions_1.createConn("allcurrconn" + ctx.req.session.userId.toString());
            let currencyRepo = yield connection.getRepository(Currency_1.Currency);
            let allCurrencies = yield currencyRepo.find({ order: { id: "ASC" } });
            console.log(allCurrencies);
            if (!allCurrencies) {
                connection.close();
                return false;
            }
            console.log(allCurrencies);
            connection.close();
            return allCurrencies;
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [Currency_1.Currency], { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AllCurrenciesResolver.prototype, "allCurrencies", null);
AllCurrenciesResolver = __decorate([
    type_graphql_1.Resolver()
], AllCurrenciesResolver);
exports.AllCurrenciesResolver = AllCurrenciesResolver;
//# sourceMappingURL=allCurrencies.js.map