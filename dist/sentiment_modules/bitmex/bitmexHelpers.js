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
function createOrderObj(userNum, exec) {
    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
        let orderObject = {
            userNum: parseInt(userNum),
            symbol: "",
            execID: "",
            timestamp: "",
            side: "",
            price: "",
            orderQty: 0,
            leavesQty: 0,
            currentQty: 0,
            avgEntryPrice: "",
            execType: "",
            orderType: "",
            execGrossPnl: 0,
            realizedPnl: 0,
            commission: "",
            trdStart: false,
            trdEnd: false,
            notes: "undefined",
            hashtags: "undefined",
        };
        orderObject.symbol = exec.symbol;
        orderObject.execID = exec.execID;
        orderObject.timestamp = exec.timestamp;
        orderObject.side = exec.side;
        orderObject.orderQty = exec.orderQty;
        orderObject.leavesQty = exec.leavesQty;
        orderObject.currentQty = exec.currentQty;
        orderObject.orderType = exec.ordType.toString();
        orderObject.price = exec.price.toString();
        if (exec.execGrossPnl == undefined || exec.execGrossPnl == "undefined") {
            orderObject.execGrossPnl = 0;
        }
        else {
            orderObject.execGrossPnl = exec.execGrossPnl;
        }
        if (exec.realizedPnl == undefined || exec.realizedPnl == "undefined") {
            orderObject.realizedPnl = 0;
        }
        else {
            orderObject.realizedPnl = exec.realizedPnl;
        }
        orderObject.commission = exec.commission.toString();
        if (!exec.avgEntryPrice) {
            orderObject.avgEntryPrice = "0";
        }
        else {
            orderObject.avgEntryPrice = exec.avgEntryPrice.toString();
        }
        orderObject.execType = exec.execType;
        let realOrder;
        if (orderObject.side == "Sell") {
            realOrder = (exec.orderQty - exec.leavesQty) * -1;
        }
        else {
            realOrder = exec.orderQty - exec.leavesQty;
        }
        if (orderObject.currentQty == 0 && orderObject.execType == "Trade") {
            orderObject.trdEnd = true;
        }
        if (orderObject.side == "Sell" &&
            orderObject.currentQty < 0 &&
            realOrder < orderObject.currentQty &&
            orderObject.execType == "Trade") {
            console.log("IS SELL");
            orderObject.trdEnd = true;
            orderObject.trdStart = true;
        }
        if (orderObject.side == "Buy" &&
            orderObject.currentQty > 0 &&
            realOrder > orderObject.currentQty &&
            orderObject.execType == "Trade") {
            orderObject.trdEnd = true;
            orderObject.trdStart = true;
        }
        resolve(orderObject);
    }));
}
exports.createOrderObj = createOrderObj;
function newDate(hrsBack) {
    if (hrsBack == 0) {
        let dt = new Date(new Date().toUTCString());
        dt = dt.toISOString();
        return dt;
    }
    else {
        let dt = new Date(new Date().toUTCString());
        dt.setHours(dt.getHours() - hrsBack);
        dt = dt.toISOString();
        return dt;
    }
}
exports.newDate = newDate;
function newTwelveHourDate(hrsBack) {
    let dt = new Date(new Date().toUTCString());
    dt.setHours(dt.getHours() - hrsBack);
    if (process.env.NODE_ENV === "production") {
        dt.setHours(12, 0, 0, 0);
    }
    else {
        dt.setHours(7, 0, 0, 0);
    }
    dt = dt.toISOString();
    return dt;
}
exports.newTwelveHourDate = newTwelveHourDate;
function genDatesList() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            let daysBack = 15;
            let arr = [];
            for (let i = 0; i < daysBack; i++) {
                let num = 24 * i;
                if (i == 0) {
                    let otherDate = newTwelveHourDate(num);
                    let newerDate = newDate(num);
                    arr.push(otherDate);
                    arr.push(newerDate);
                }
                else {
                    let date = newTwelveHourDate(num);
                    arr.push(date);
                }
                if (i == daysBack - 1) {
                    let newArr = arr.reverse();
                    resolve(newArr);
                }
            }
        }));
    });
}
exports.genDatesList = genDatesList;
function makeid(length) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
exports.makeid = makeid;
//# sourceMappingURL=bitmexHelpers.js.map