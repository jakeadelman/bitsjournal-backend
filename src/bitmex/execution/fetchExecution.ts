import { BitmexAPI } from "bitmex-node";
import { User } from "../../entity/User";
import { newDate, makeid } from "../bitmexHelpers";
import { createConn } from "../../modules/utils/connectionOptions";
import { fetchHistory, addStartEnd } from "./populateExecution";
import { symbols } from "../symbols";

var cron = require("node-cron");

async function fetch() {
  let randId = makeid(10);
  let newconn = await createConn(randId);
  let userRepo = newconn.getRepository(User);
  let userNums = await userRepo.find({
    select: ["id", "apiKeyID", "apiKeySecret"],
  });
  console.log(userNums);
  for (let i = 0; i < userNums.length; i++) {
    // let symbols = ["XBTUSD", "XBTH20"];
    for (let j = 0; j < symbols.length; j++) {
      try {
        let symbol = symbols[j];

        const bitmex = new BitmexAPI({
          apiKeyID: userNums[i].apiKeyID,
          apiKeySecret: userNums[i].apiKeySecret,
        });

        const fullExecHistory = await bitmex.Execution.getTradeHistory({
          symbol: symbol,
          count: 100,
          reverse: true,
        });
        let utcTime: any = newDate(0);

        fetchHistory(
          userNums[i].id,
          newconn,
          symbol,
          utcTime,
          fullExecHistory,
          bitmex
        )
          .then(async () => {
            return await addStartEnd(userNums[i], symbol, newconn, false);
          })
          .then(async () => {
            if (j == symbols.length - 1) {
              if (i == userNums.length - 1) {
                await newconn.close();
                console.log("closed connection");
              }
            }
          });
      } catch (err) {
        console.log(err);
      }
    }
  }
}

cron.schedule("*/10 * * * *", () => {
  console.log(">> STARTED FETCH EXEC <<");
  fetch();
});
