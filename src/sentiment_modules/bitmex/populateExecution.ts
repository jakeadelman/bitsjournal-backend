import { BitmexAPI } from "bitmex-node";
import { User } from "../../entity/User";
import { Trade } from "../../entity/Trade";
import { createOrderObj, genDatesList, makeid } from "./bitmexHelpers";
import { createConn } from "../../modules/utils/connectionOptions";

export async function fetchHistory(
  userNum,
  conn,
  symbol,
  history,
  fullExecHistory,
  bitmex
) {
  return new Promise(async (resolve: any) => {
    // console.log("fetching history");
    // console.log(typeof history);
    try {
      const executionHistory = await bitmex.User.getExecutionHistory({
        symbol: symbol,
        timestamp: history,
      });
      // console.log("HERE");

      const userRepo = conn.getRepository(User);
      const tradeRepo = conn.getRepository(Trade);
      console.log("USERNUM IS ", userNum);
      const thisUser = await userRepo.find({
        where: { id: parseInt(userNum), select: "id" },
      });
      console.log(thisUser[0]);
      let j = 0;
      console.log(executionHistory.length, "LENGTH");
      if (executionHistory.length == 0) {
        resolve(false);
      }

      // if (fullExecHistory[0] && executionHistory[0]) {
      for (let i = 0; i < executionHistory.length; i++) {
        createOrderObj(userNum, executionHistory[i]).then(
          async (orderObject) => {
            // console.log(orderObject);

            let newTrade = new Trade();
            newTrade.tradeNum = i;
            newTrade.searchTimestamp = history;

            //get execution history records
            newTrade.price = orderObject.price;
            // console.log(fullExecHistory.length);
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

                tradeRepo
                  .save(newTrade)
                  .then(async (r) => {
                    j++;
                    // console.log(j);
                    // console.log("successfully saved trade " + i.toString());
                    if (j == executionHistory.length - 1) {
                      // console.log(executionHistory.length);
                      let findings = await tradeRepo.find({
                        select: ["id", "trdEnd", "trdStart", "execType"],
                        where: { userId: parseInt(userNum), symbol: symbol },
                        order: {
                          timestamp: "ASC",
                          searchTimestamp: "ASC",
                          tradeNum: "DESC",
                        },
                      });
                      // if(findings[0].side ==)
                      if (findings[0]) {
                        // console.log(findings.length);
                        let torf = false;
                        for (let i = 0; i < findings.length; i++) {
                          if (torf == true) {
                            findings[i].trdStart = true;
                            if (findings[i].execType == "Funding") {
                              // console.log(findings[i].id, findings[i].execType);
                              // console.log(findings[i]);
                              findings[i].trdEnd = false;
                              findings[i].trdStart = false;
                              await tradeRepo.save(findings[i]);
                            } else {
                              await tradeRepo.save(findings[i]);
                            }
                            torf = false;
                          }

                          if (
                            findings[i].trdEnd == true &&
                            findings[i].trdStart !== true
                          ) {
                            torf = true;
                          }
                          if (i == findings.length - 1) {
                            await resolve(r);
                          }
                        }
                      }
                    }
                    // console.log(r);
                  })
                  .catch((err) => console.log(err));
              }
            }
          }
        );
      }
      // }
    } catch (err) {
      resolve(err);
    }
  });
}

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

      let symbols = ["XBTUSD", "XBTU20"];
      for (let i = 0; i < symbols.length; i++) {
        let symbol = symbols[i];
        let fullExecHistory;
        try {
          fullExecHistory = await bitmex.Execution.getTradeHistory({
            symbol: symbol,
            count: 500,
            reverse: true,
          });
          console.log("HERE1");

          // console.log(userNums);
          // let oneHrBack: any = newDate(1);
          let datesList = await genDatesList();
          console.log(datesList);
          var theEye = 0; //  set your counter to 1
          console.log("STARTING");
          let ending = await myLoop(
            datesList,
            userNums,
            newconn,
            theEye,
            fullExecHistory,
            bitmex,
            symbol
          );
          console.log(ending);
          console.log("REAL END");
          resolve(ending);
        } catch (err) {
          // console.log(fullExecHistory);
          console.log("HERE2");
          resolve(false);
        }
      }
    } catch (err) {
      console.log("ERRING");
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
      // console.log(i);
      let rand = makeid(10);
      let newconnect = await createConn(rand);
      fetchHistory(
        userNums[0].id,
        newconnect,
        symbol,
        datesList[i],
        fullExecHistory,
        bitmex
      )
        .then(async () => {
          await newconnect.close();
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
              await newconn.close();
              console.log("RESOLVING");
              resolve(true);
            }
          } catch (err) {
            console.log("IN ERR");
            resolve(true);
          } finally {
            console.log("IN FINALLY");
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
            await newconn.close();
            console.log("RESOLVING");
            resolve(true);
          }
        });
    }, 2000);
  });
  return end;
}
