import { fetchTrades } from "./helpers";
import { createConn } from "../../modules/utils/connectionOptions";
import { symbols } from "../symbols";
var cron = require("node-cron");

// always running
async function fetch(timeframe) {
  return new Promise(async (resolve) => {
    let newconn = await createConn("connection" + timeframe);

    // let symbol = "XBTUSD";
    let count = 1;
    for (let i = 0; i < symbols.length; i++) {
      let symbol = symbols[i];
      fetchTrades(timeframe, symbol, count, newconn).then(() => {
        resolve("end");
      });
    }
  });
}

console.log(">> STARTED FETCH TRADES <<");

cron.schedule("*/1 * * * *", () => {
  fetch("1m");
});
cron.schedule("*/5 * * * *", () => {
  fetch("5m");
});
cron.schedule("0 * * * *", () => {
  fetch("1h");
});
cron.schedule("0 0 * * *", () => {
  fetch("1d");
});
