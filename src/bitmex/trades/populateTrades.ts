import { fetchTrades } from "./helpers";
import { createConn } from "../../modules/utils/connectionOptions";

// run once at start (from backend)

async function populate() {
  return new Promise(async (resolve) => {
    let newconn = await createConn("populate trades connection opened");
    let timeframes = ["1m", "5m", "1h", "1d"];
    for (let i = 0; i < timeframes.length; i++) {
      let thisTime = timeframes[i];
      let symbol = "XBTUSD";
      let count;
      if (thisTime == "1d") {
        count = 400;
      } else {
        count = 1000;
      }
      fetchTrades(thisTime, symbol, count, newconn).then(() => {
        if (i == timeframes.length - 1) {
          resolve("end");
        }
      });
    }
  });
}

populate();
