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
const Candle_1 = require("../../../entity/Candle");
exports.fetchTrades = (binSize, symbol, count, conn) => __awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
        let candleRepo = conn.getRepository(Candle_1.Candle);
        const bitmex = new bitmex_node_1.BitmexAPI({
            apiKeyID: "WxX-i47QkysTG_8Yw2984EWb",
            apiKeySecret: "ee4YzptdaJK7hoQAolsl4EjkFt3JOhFcB2Kxi2zIff3VruM",
        });
        console.log(count, "THIS COUNT");
        bitmex.Trade.getBucketed({
            symbol: symbol,
            binSize: binSize,
            count: count,
            reverse: true,
        }).then((res) => __awaiter(this, void 0, void 0, function* () {
            console.log(res.length.toString() +
                " new candles for timeframe " +
                binSize.toString());
            for (let i = 0; i < res.length; i++) {
                let newCandle = new Candle_1.Candle();
                newCandle.timestamp = res[i].timestamp;
                newCandle.uniquekey = res[i].timestamp + binSize;
                newCandle.timeframe = binSize;
                newCandle.symbol = res[i].symbol;
                newCandle.open = res[i].open.toString();
                newCandle.high = res[i].high.toString();
                newCandle.low = res[i].low.toString();
                newCandle.close = res[i].close.toString();
                newCandle.trades = res[i].trades.toString();
                newCandle.volume = res[i].volume.toString();
                newCandle.vwap = res[i].vwap.toString();
                newCandle.lastSize = res[i].lastSize.toString();
                newCandle.turnover = res[i].turnover.toString();
                newCandle.homeNotional = res[i].homeNotional.toString();
                newCandle.foreignNotional = res[i].foreignNotional.toString();
                candleRepo
                    .save(newCandle)
                    .then(() => {
                    if (i == res.length - 1) {
                        console.log("saved all candles");
                        resolve(res);
                    }
                })
                    .catch((err) => {
                    console.log(err);
                    if (i == res.length - 1) {
                        console.log("saved all candles");
                        resolve(res);
                    }
                });
            }
        }));
    }));
});
//# sourceMappingURL=helpers.js.map