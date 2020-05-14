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
const bitmex_node_1 = require("bitmex-node");
const User_1 = require("../../entity/User");
const bitmexHelpers_1 = require("./bitmexHelpers");
const connectionOptions_1 = require("../../modules/utils/connectionOptions");
const populateExecution_1 = require("./populateExecution");
setInterval(function () {
    return __awaiter(this, void 0, void 0, function* () {
        let randId = bitmexHelpers_1.makeid(10);
        let newconn = yield connectionOptions_1.createConn(randId);
        let userRepo = newconn.getRepository(User_1.User);
        let userNums = yield userRepo.find({
            select: ["id", "apiKeyID", "apiKeySecret"],
        });
        console.log(userNums);
        for (let i = 0; i < userNums.length; i++) {
            let symbols = ["XBTUSD", "XBTH20"];
            for (let j = 0; j < symbols.length; j++) {
                try {
                    let symbol = symbols[j];
                    const bitmex = new bitmex_node_1.BitmexAPI({
                        apiKeyID: userNums[i].apiKeyID,
                        apiKeySecret: userNums[i].apiKeySecret,
                    });
                    const fullExecHistory = yield bitmex.Execution.getTradeHistory({
                        symbol: symbol,
                        count: 100,
                        reverse: true,
                    });
                    let utcTime = bitmexHelpers_1.newDate(0);
                    populateExecution_1.fetchHistory(userNums[i].id, newconn, symbol, utcTime, fullExecHistory, bitmex)
                        .then(() => __awaiter(this, void 0, void 0, function* () {
                        return yield populateExecution_1.addStartEnd(userNums[i], symbol, newconn, false);
                    }))
                        .then(() => __awaiter(this, void 0, void 0, function* () {
                        if (j == symbols.length - 1) {
                            if (i == userNums.length - 1) {
                                yield newconn.close();
                                console.log("closed connection");
                            }
                        }
                    }));
                }
                catch (err) {
                    console.log(err);
                }
            }
        }
    });
}, 60000 * 5);
//# sourceMappingURL=fetchExecution.js.map