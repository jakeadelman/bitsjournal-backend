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
const User_1 = require("../../entity/User");
const stripe = require("stripe")("sk_test_bCGcyxmE3CahvatloCKNPVJV");
let ConfirmCardResolver = class ConfirmCardResolver {
    confirmCard(uid, sourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield User_1.User.findOne({ where: { id: parseInt(uid) } });
            if (!user) {
                return false;
            }
            const customer = yield stripe.customers.create({
                email: user.email,
                source: sourceId
            });
            const subscription = yield stripe.subscriptions.create({
                customer: customer.id,
                items: [{ plan: "plan_EbX1gzFjyRznJc" }],
                trial_from_plan: true
            });
            if (!subscription) {
                return false;
            }
            yield User_1.User.update({ id: parseInt(uid) }, { confirmed: true });
            console.log("confirmed user in db");
            return true;
        });
    }
};
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("uid")),
    __param(1, type_graphql_1.Arg("source")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ConfirmCardResolver.prototype, "confirmCard", null);
ConfirmCardResolver = __decorate([
    type_graphql_1.Resolver()
], ConfirmCardResolver);
exports.ConfirmCardResolver = ConfirmCardResolver;
//# sourceMappingURL=ConfirmCard.js.map