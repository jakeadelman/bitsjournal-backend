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
let AddAdditionalTermResolver = class AddAdditionalTermResolver {
    addAdditionalTerm(newTerm, currency, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield connectionOptions_1.createConn("currencyconn");
            if (!ctx.req.session.userId) {
                connection.close();
                console.log("not logged in");
                return null;
            }
            let currencyRepo = yield connection.getRepository(Currency_1.Currency);
            let newCurrency = yield currencyRepo.findOne({ where: { name: currency } });
            if (!!newCurrency && newCurrency.additional_terms) {
                newCurrency.additional_terms.push(newTerm);
                yield currencyRepo.save(newCurrency);
                connection.close();
                return true;
            }
            else if (!!newCurrency && !newCurrency.additional_terms) {
                let newRay = [];
                newRay.push(newTerm);
                newCurrency.additional_terms = newRay;
                yield currencyRepo.save(newCurrency);
                connection.close();
                return true;
            }
            else {
                connection.close();
                return false;
            }
        });
    }
};
__decorate([
    type_graphql_1.Mutation(() => Boolean, { nullable: true }),
    __param(0, type_graphql_1.Arg("newTerm")),
    __param(1, type_graphql_1.Arg("currency")),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AddAdditionalTermResolver.prototype, "addAdditionalTerm", null);
AddAdditionalTermResolver = __decorate([
    type_graphql_1.Resolver()
], AddAdditionalTermResolver);
exports.AddAdditionalTermResolver = AddAdditionalTermResolver;
//# sourceMappingURL=addAdditionalTerm.js.map