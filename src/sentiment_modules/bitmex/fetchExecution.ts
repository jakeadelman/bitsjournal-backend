import { BitmexAPI } from "bitmex-node";
import { User } from "../../entity/User";
import { Trade } from "../../entity/Trade";
import { createOrderObj, makeid } from "./bitmexHelpers";
import { createConn } from "../../modules/utils/connectionOptions";

async function fetchHistory(userNum, key, secret, conn, symbol, history) {
  const bitmex = new BitmexAPI({
    apiKeyID: key,
    apiKeySecret: secret
  });
  return new Promise(async (resolve: any) => {
    const executionHistory = await bitmex.User.getExecutionHistory({
      symbol: symbol,
      timestamp: history,
      reverse: true
    });
    // let conn = await createConn(userNum.toString() + "sldfjk");
    console.log(executionHistory.length, userNum);
    console.log(executionHistory);
    const userRepo = conn.getRepository(User);
    const tradeRepo = conn.getRepository(Trade);
    const thisUser = await userRepo.find({
      where: { id: parseInt(userNum), select: "id" }
    });
    console.log(thisUser[0]);
    let j = 0;
    for (let i = 0; i < executionHistory.length; i++) {
      createOrderObj(userNum, executionHistory[i]).then(async orderObject => {
        console.log(orderObject);
        let newTrade = new Trade();
        newTrade.user = thisUser[0]!;
        newTrade.execID = orderObject.execID;
        newTrade.timestamp = orderObject.timestamp;
        newTrade.side = orderObject.side;
        newTrade.price = orderObject.price;
        newTrade.orderQty = orderObject.orderQty;
        newTrade.leavesQty = orderObject.leavesQty;
        newTrade.currentQty = orderObject.currentQty;
        newTrade.avgEntryPrice = orderObject.avgEntryPrice;
        newTrade.execType = orderObject.execType;
        newTrade.orderType = orderObject.orderType;
        newTrade.execGrossPnl = orderObject.execGrossPnl;
        newTrade.realizedPnl = orderObject.realizedPnl;
        newTrade.commission = orderObject.commission;
        newTrade.trdStart = orderObject.trdStart;
        newTrade.trdEnd = orderObject.trdEnd;
        tradeRepo
          .save(newTrade)
          .then(r => {
            j++;
            console.log(j);
            console.log("successfully saved trade " + i.toString());
            if (j == executionHistory.length - 1) {
              resolve(true);
            }
            console.log(r);
          })
          .catch(err => console.log(err));
      });
    }
  });
}

setInterval(async function() {
  let randId = makeid(10);
  let newconn = await createConn(randId);
  let userRepo = newconn.getRepository(User);
  let userNums = await userRepo.find({
    select: ["id", "apiKeyID", "apiKeySecret"]
  });
  console.log(userNums);
  // let oneHrBack: any = newDate(24);

  for (let i = 0; i < userNums.length; i++) {
    fetchHistory(
      userNums[i].id,
      userNums[i].apiKeyID,
      userNums[i].apiKeySecret,
      newconn,
      "XBTUSD",
      "2020-01-15T12:00:00.000Z"
    ).then(async res => {
      await newconn.close();
      console.log("closed connection");
      console.log(res);
    });
  }
  // newconn.close();
}, 10000);
