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
const helpers_1 = require("./helpers");
const connectionOptions_1 = require("../../../modules/utils/connectionOptions");
function populate() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            let newconn = yield connectionOptions_1.createConn("populate trades connection opened");
            let timeframes = ["1m", "5m", "1h", "1d"];
            for (let i = 0; i < timeframes.length; i++) {
                let thisTime = timeframes[i];
                let symbol = "XBTUSD";
                let count;
                if (thisTime == "1d") {
                    count = 400;
                }
                else {
                    count = 1000;
                }
                helpers_1.fetchTrades(thisTime, symbol, count, newconn).then(() => {
                    if (i == timeframes.length - 1) {
                        resolve("end");
                    }
                });
            }
        }));
    });
}
populate();
//# sourceMappingURL=populateTrades.js.map