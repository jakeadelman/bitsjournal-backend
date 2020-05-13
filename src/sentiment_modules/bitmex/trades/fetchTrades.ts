// import { fetchTrades } from "./helpers";
// import { createConn } from "../../../modules/utils/connectionOptions";
var cron = require("node-cron");

// always running

// async function fetch() {
//   return new Promise(async (resolve) => {
//     let newconn = await createConn("populate trades connection opened");
//     let timeframes = ["1m", "5m", "1h", "1d"];
//     for (let i = 0; i < timeframes.length; i++) {
//       let thisTime = timeframes[i];
//       let symbol = "XBTUSD";
//       let count;
//       if (thisTime == "1m") {
//         count = 5;
//       }
//       if (thisTime == "5m") {
//         count = 1;
//       }
//       if (thisTime == "1h") {
//       }
//       if (thisTime == "1d") {
//       }
//       fetchTrades(thisTime, symbol, count, newconn).then(() => {
//         if (i == timeframes.length - 1) {
//           resolve("end");
//         }
//       });
//     }
//   });
// }

// let interval = 5 * 60 * 1000;
// setInterval(function () {
//   console.log("running fetch trades (getting candle data)");
//   fetch();
// }, interval);
console.log("started");

cron.schedule("*/5 * * * *", () => {
  console.log("running every minute 3,5");
  console.log(new Date());
});
