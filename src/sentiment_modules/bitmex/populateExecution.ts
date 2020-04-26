import { BitmexAPI } from "bitmex-node";
import { User } from "../../entity/User";
import { Trade } from "../../entity/Trade";
import { createOrderObj, genDatesList, makeid } from "./bitmexHelpers";
import { createConn } from "../../modules/utils/connectionOptions";

export async function populateExecs(userId) {
  return new Promise<any>(async (resolve) => {
    let randId = makeid(10);
    let newconn = await createConn(randId);
    let userRepo = newconn.getRepository(User);
    let userNums = await userRepo.find({
      where: { id: userId },
      select: ["id", "apiKeyID", "apiKeySecret"],
    });
    try {
      const bitmex = new BitmexAPI({
        apiKeyID: userNums[0].apiKeyID,
        apiKeySecret: userNums[0].apiKeySecret,
      });

      let symbols = ["XBTUSD", "XBTU20", "XBTM20", "ETHUSD", "XRPUSD"];
      for (let i = 0; i < symbols.length; i++) {
        let symbol = symbols[i];
        let fullExecHistory;
        try {
          fullExecHistory = await bitmex.Execution.getTradeHistory({
            symbol: symbol,
            count: 500,
            reverse: true,
          });

          let datesList = await genDatesList();
          var theEye = 0; //  set your counter to 1
          console.log(datesList);

          //START LOOPING
          await myLoop(
            datesList,
            userNums,
            newconn,
            theEye,
            fullExecHistory,
            bitmex,
            symbol
          );

          // add start and end to trades
          addStartEnd(userNums[0], symbol, newconn, true).then(async () => {
            if (i == symbols.length - 1) {
              await newconn.close();
              resolve(true);
            }
          });
        } catch (err) {
          await newconn.close();
          resolve(false);
        }
      }
    } catch (err) {
      console.log(err);
    }
  });
}

function myLoop(
  datesList,
  userNums,
  newconn,
  i,
  fullExecHistory,
  bitmex,
  symbol
): Promise<any> {
  let end = new Promise(async (resolve) => {
    setTimeout(async function () {
      console.log("starting my loop");
      fetchHistory(
        userNums[0].id,
        newconn,
        symbol,
        datesList[i],
        fullExecHistory,
        bitmex
      )
        .then(async () => {
          try {
            if (i < datesList.length - 1) {
              i++;
              console.log("loop number " + i.toString());
              await myLoop(
                datesList,
                userNums,
                newconn,
                i,
                fullExecHistory,
                bitmex,
                symbol
              );
            } else {
              console.log("THE END");
              console.log("RESOLVING");
            }
          } catch (err) {
            console.log("IN ERR");
            resolve(true);
          } finally {
            console.log("IN FINALLY", i.toString());
            resolve(true);
          }
        })
        .catch(async (err) => {
          console.log(err);
          console.log("IN ERR");
          if (i < datesList.length) {
            i++;
            console.log("loop number " + i.toString());
            myLoop(
              datesList,
              userNums,
              newconn,
              i,
              fullExecHistory,
              bitmex,
              symbol
            );
          } else {
            console.log("THE END");
            console.log("RESOLVING");
            resolve(true);
          }
        });
    }, 2000);
  });
  return end;
}

export async function fetchHistory(
  userNum,
  conn,
  symbol,
  history,
  fullExecHistory,
  bitmex
) {
  return new Promise(async (resolve: any) => {
    console.log("starting fetch history");
    try {
      console.log("starting try in fetch history");
      const executionHistory = await bitmex.User.getExecutionHistory({
        symbol: symbol,
        timestamp: history,
      }).catch((err) => console.log(err));

      const userRepo = conn.getRepository(User);
      const tradeRepo = conn.getRepository(Trade);

      const thisUser = await userRepo.find({
        where: { id: parseInt(userNum), select: "id" },
      });
      let j = 0;

      if (executionHistory.length == 0) {
        resolve(false);
      }
      console.log("just fetched exec");

      for (let i = 0; i < executionHistory.length; i++) {
        console.log(i.toString() + "this one");
        createOrderObj(userNum, executionHistory[i]).then(
          async (orderObject) => {
            console.log("created order obj");
            let newTrade = new Trade();
            newTrade.tradeNum = i;
            newTrade.searchTimestamp = history;

            //get execution history records
            newTrade.price = orderObject.price;

            for (let k = 0; k < fullExecHistory.length; k++) {
              if (
                fullExecHistory[k].execID == orderObject.execID &&
                fullExecHistory[k].stopPx != null
              ) {
                newTrade.price = fullExecHistory[k].stopPx.toString();
              }
              if (k == fullExecHistory.length - 1) {
                newTrade.user = thisUser[0]!;
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

                //save trade
                tradeRepo
                  .save(newTrade)
                  .then(async (r) => {
                    if (j == executionHistory.length - 1) {
                      console.log("saved this many trades>>", j + 1);
                      await resolve(r);
                    } else {
                      j++;
                    }
                  })
                  .catch((err) => console.log(err));
              }
            }
          }
        );
      }
    } catch (err) {
      console.log("there was an err");
      console.log(err);
      resolve(err);
    }
  });
}

export function addStartEnd(
  userNum,
  symbol,
  newconn,
  checkFirstTrade: boolean
) {
  return new Promise(async (resolve) => {
    const tradeRepo = newconn.getRepository(Trade);
    let findings = await tradeRepo.find({
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
        // check if first trade is trdStart
        if (checkFirstTrade == true) {
          if (k == 0) {
            console.log("<<<<<<<<<<");
            console.log("I IS OOONNNE");
            console.log("<<<<<<<<<<");
            let realOrder: number;
            if (findings[0].side == "Sell") {
              realOrder = (findings[0].orderQty - findings[0].leavesQty) * -1;
            } else {
              realOrder = findings[0].orderQty - findings[0].leavesQty;
            }
            if (findings[0].currentQty == realOrder) {
              findings[0].trdStart = true;
              await tradeRepo.save(findings[0]);
            }
          }
        }

        if (torf == true) {
          console.log("TORF IS TRUE");
          findings[k].trdStart = true;
          if (findings[k].execType == "Funding") {
            findings[k].trdEnd = false;
            findings[k].trdStart = false;
            await tradeRepo.save(findings[k]);
          } else {
            await tradeRepo.save(findings[k]);
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
    } else {
      resolve(false);
    }
  });
}
