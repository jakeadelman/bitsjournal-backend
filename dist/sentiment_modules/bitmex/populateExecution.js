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
const Trade_1 = require("../../entity/Trade");
const bitmexHelpers_1 = require("./bitmexHelpers");
const connectionOptions_1 = require("../../modules/utils/connectionOptions");
function populateExecs(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            let randId = bitmexHelpers_1.makeid(10);
            let newconn = yield connectionOptions_1.createConn(randId);
            let userRepo = newconn.getRepository(User_1.User);
            let userNums = yield userRepo.find({
                where: { id: userId },
                select: ["id", "apiKeyID", "apiKeySecret"],
            });
            try {
                const bitmex = new bitmex_node_1.BitmexAPI({
                    apiKeyID: userNums[0].apiKeyID,
                    apiKeySecret: userNums[0].apiKeySecret,
                });
                let symbols = ["XBTUSD", "XBTU20", "XBTM20", "ETHUSD", "XRPUSD"];
                for (let i = 0; i < symbols.length; i++) {
                    let symbol = symbols[i];
                    let fullExecHistory;
                    try {
                        fullExecHistory = yield bitmex.Execution.getTradeHistory({
                            symbol: symbol,
                            count: 500,
                            reverse: true,
                        });
                        let datesList = yield bitmexHelpers_1.genDatesList();
                        var theEye = 0;
                        console.log(datesList);
                        yield myLoop(datesList, userNums, newconn, theEye, fullExecHistory, bitmex, symbol);
                        addStartEnd(userNums[0], symbol, newconn, true).then(() => __awaiter(this, void 0, void 0, function* () {
                            if (i == symbols.length - 1) {
                                yield newconn.close();
                                resolve(true);
                            }
                        }));
                    }
                    catch (err) {
                        yield newconn.close();
                        resolve(false);
                    }
                }
            }
            catch (err) {
                console.log(err);
            }
        }));
    });
}
exports.populateExecs = populateExecs;
function myLoop(datesList, userNums, newconn, i, fullExecHistory, bitmex, symbol) {
    let end = new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
        setTimeout(function () {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("starting my loop");
                fetchHistory(userNums[0].id, newconn, symbol, datesList[i], fullExecHistory, bitmex)
                    .then(() => __awaiter(this, void 0, void 0, function* () {
                    try {
                        if (i < datesList.length - 1) {
                            i++;
                            console.log("loop number " + i.toString());
                            yield myLoop(datesList, userNums, newconn, i, fullExecHistory, bitmex, symbol);
                        }
                        else {
                            console.log("THE END");
                            console.log("RESOLVING");
                        }
                    }
                    catch (err) {
                        console.log("IN ERR");
                        resolve(true);
                    }
                    finally {
                        console.log("IN FINALLY", i.toString());
                        resolve(true);
                    }
                }))
                    .catch((err) => __awaiter(this, void 0, void 0, function* () {
                    console.log(err);
                    console.log("IN ERR");
                    if (i < datesList.length) {
                        i++;
                        console.log("loop number " + i.toString());
                        myLoop(datesList, userNums, newconn, i, fullExecHistory, bitmex, symbol);
                    }
                    else {
                        console.log("THE END");
                        console.log("RESOLVING");
                        resolve(true);
                    }
                }));
            });
        }, 2000);
    }));
    return end;
}
function fetchHistory(userNum, conn, symbol, history, fullExecHistory, bitmex) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            console.log("starting fetch history");
            try {
                console.log("starting try in fetch history");
                const executionHistory = yield bitmex.User.getExecutionHistory({
                    symbol: symbol,
                    timestamp: history,
                }).catch((err) => console.log(err));
                const userRepo = conn.getRepository(User_1.User);
                const tradeRepo = conn.getRepository(Trade_1.Trade);
                const thisUser = yield userRepo.find({
                    where: { id: parseInt(userNum), select: "id" },
                });
                let j = 0;
                if (executionHistory.length == 0) {
                    resolve(false);
                }
                for (let i = 0; i < executionHistory.length; i++) {
                    console.log(i.toString() + "this one");
                    bitmexHelpers_1.createOrderObj(userNum, executionHistory[i]).then((orderObject) => __awaiter(this, void 0, void 0, function* () {
                        console.log("created order obj");
                        let newTrade = new Trade_1.Trade();
                        newTrade.tradeNum = i;
                        newTrade.searchTimestamp = history;
                        newTrade.price = orderObject.price;
                        for (let k = 0; k < fullExecHistory.length; k++) {
                            if (fullExecHistory[k].execID == orderObject.execID &&
                                fullExecHistory[k].stopPx != null) {
                                newTrade.price = fullExecHistory[k].stopPx.toString();
                            }
                            if (k == fullExecHistory.length - 1) {
                                newTrade.user = thisUser[0];
                                newTrade.symbol = orderObject.symbol;
                                newTrade.execID = orderObject.execID;
                                newTrade.timestamp = orderObject.timestamp;
                                newTrade.side = orderObject.side;
                                newTrade.orderQty = orderObject.orderQty;
                                newTrade.leavesQty = orderObject.leavesQty;
                                newTrade.currentQty = orderObject.currentQty;
                                newTrade.avgEntryPrice = orderObject.avgEntryPrice;
                                newTrade.execType = orderObject.execType;
                                newTrade.orderType = orderObject.orderType;
                                newTrade.trdStart = orderObject.trdStart;
                                newTrade.trdEnd = orderObject.trdEnd;
                                newTrade.realizedPnl = orderObject.realizedPnl;
                                newTrade.execGrossPnl = orderObject.execGrossPnl;
                                newTrade.commission = orderObject.commission;
                                newTrade.notes = "undefined";
                                newTrade.hashtags = "undefined";
                                tradeRepo
                                    .save(newTrade)
                                    .then((r) => __awaiter(this, void 0, void 0, function* () {
                                    if (j == executionHistory.length - 1) {
                                        console.log("saved this many trades>>", j + 1);
                                        yield resolve(r);
                                    }
                                    else {
                                        j++;
                                    }
                                }))
                                    .catch((err) => console.log(err));
                            }
                        }
                    }));
                }
            }
            catch (err) {
                console.log("there was an err");
                console.log(err);
                resolve(err);
            }
        }));
    });
}
exports.fetchHistory = fetchHistory;
function addStartEnd(userNum, symbol, newconn, checkFirstTrade) {
    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
        const tradeRepo = newconn.getRepository(Trade_1.Trade);
        let findings = yield tradeRepo.find({
            select: [
                "id",
                "trdEnd",
                "trdStart",
                "execType",
                "leavesQty",
                "orderQty",
                "side",
                "currentQty",
            ],
            where: { userId: userNum.id, symbol: symbol },
            order: {
                timestamp: "ASC",
                searchTimestamp: "ASC",
                tradeNum: "DESC",
            },
        });
        console.log(findings.length, " << found this many findings");
        if (findings[0]) {
            let torf = false;
            for (let k = 0; k < findings.length; k++) {
                if (checkFirstTrade == true) {
                    if (k == 0) {
                        console.log("<<<<<<<<<<");
                        console.log("I IS OOONNNE");
                        console.log("<<<<<<<<<<");
                        let realOrder;
                        if (findings[0].side == "Sell") {
                            realOrder = (findings[0].orderQty - findings[0].leavesQty) * -1;
                        }
                        else {
                            realOrder = findings[0].orderQty - findings[0].leavesQty;
                        }
                        if (findings[0].currentQty == realOrder) {
                            findings[0].trdStart = true;
                            yield tradeRepo.save(findings[0]);
                        }
                    }
                }
                if (torf == true) {
                    console.log("TORF IS TRUE");
                    findings[k].trdStart = true;
                    if (findings[k].execType == "Funding") {
                        findings[k].trdEnd = false;
                        findings[k].trdStart = false;
                        yield tradeRepo.save(findings[k]);
                    }
                    else {
                        yield tradeRepo.save(findings[k]);
                    }
                    torf = false;
                }
                if (findings[k].trdEnd == true && findings[k].trdStart !== true) {
                    torf = true;
                }
                if (k == findings.length - 1) {
                    resolve(true);
                }
            }
        }
        else {
            resolve(false);
        }
    }));
}
exports.addStartEnd = addStartEnd;
//# sourceMappingURL=populateExecution.js.map