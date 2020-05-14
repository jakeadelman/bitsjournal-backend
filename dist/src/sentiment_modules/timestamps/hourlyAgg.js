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
const SearchTerm_1 = require("../../entity/SearchTerm");
const connectionOptions_1 = require("../../modules/utils/connectionOptions");
const aggregateFunctions_1 = require("./aggregateFunctions");
const chalk = require("chalk");
const dateFormat = require("dateformat");
const schedule = require("node-schedule");
schedule.scheduleJob("01 01 * * * *", function () {
    return __awaiter(this, void 0, void 0, function* () {
        let theHour = dateFormat(new Date(), "yymmddHH");
        let connections = yield connectionOptions_1.createConns("hourly-agg");
        console.log(`[` + chalk.blue(`PG`) + `]:` + chalk.green(` opened connections`));
        let searchTermRepository = connections[0].getRepository(SearchTerm_1.SearchTerm);
        let terms = yield searchTermRepository.find({ select: ["term"] });
        terms.map((term) => __awaiter(this, void 0, void 0, function* () {
            console.log(`aggregating for ${term.term}`);
            const connection = yield connectionOptions_1.createConn(`${term.term}-ok`);
            aggregateFunctions_1.sendToDb(theHour, connection, term)
                .then(r => {
                console.log(r);
                connection.close();
            })
                .catch(r => {
                console.log(r);
                connection.close();
            });
        }));
        setTimeout(function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield connections[0].close();
                yield connections[1].close();
            });
        }, 15000);
    });
});
//# sourceMappingURL=hourlyAgg.js.map