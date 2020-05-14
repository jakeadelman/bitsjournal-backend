import { BitmexAPI } from "bitmex-node";
import { Candle } from "../../entity/Candle";
// import { Trade } from "../../entity/Trade";
// import { makeid } from "./bitmexHelpers";
// import { createConn } from "../../modules/utils/connectionOptions";

export const fetchTrades = async (binSize, symbol, count, conn) => {
  return new Promise(async (resolve) => {
    let candleRepo = conn.getRepository(Candle);
    const bitmex = new BitmexAPI({
      apiKeyID: "WxX-i47QkysTG_8Yw2984EWb",
      apiKeySecret: "ee4YzptdaJK7hoQAolsl4EjkFt3JOhFcB2Kxi2zIff3VruM",
    });
    console.log(count, "THIS COUNT");
    bitmex.Trade.getBucketed({
      symbol: symbol,
      binSize: binSize,
      count: count,
      reverse: true,
    }).then(async (res) => {
      console.log(
        res.length.toString() +
          " new candles for timeframe " +
          binSize.toString()
      );

      for (let i = 0; i < res.length; i++) {
        let newCandle = new Candle();
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
    });
  });
};

// setInterval(async function() {
//   let randId = makeid(10);
//   let newconn = await createConn(randId);
//   //   let userRepo = newconn.getRepository(User);
//   //   let userNums = await userRepo.find({
//   //     select: ["id", "apiKeyID", "apiKeySecret"]
//   //   });
//   //   console.log(userNums);
//   //   for (let i = 0; i < userNums.length; i++) {
//   //     try {
//   //       let symbol = "XBTUSD";
//   //       const bitmex = new BitmexAPI({
//   //         apiKeyID: userNums[i].apiKeyID,
//   //         apiKeySecret: userNums[i].apiKeySecret
//   //       });
//   //       // console.log(bitmex);
//   //       const fullExecHistory = await bitmex.Execution.getTradeHistory({
//   //         symbol: symbol,
//   //         count: 100,
//   //         reverse: true
//   //       });
//   //       console.log(fullExecHistory[0]);
//   //       let utcTime: any = newDate(0);
//   //       fetchHistory(
//   //         userNums[i].id,
//   //         newconn,
//   //         symbol,
//   //         utcTime,
//   //         fullExecHistory,
//   //         bitmex
//   //       )
//   //         .then(async res => {
//   //           console.log(res);
//   //           if (i == userNums.length - 1) {
//   //             await newconn.close();
//   //             console.log("closed connection");
//   //           }
//   //         })
//   //         .catch(async err => {
//   //           console.log(err);
//   //           if (i == userNums.length - 1) {
//   //             await newconn.close();
//   //             console.log("closed connection");
//   //           }
//   //         });
//   //     } catch (err) {
//   //       console.log(err);
//   //     }
//   //   }
// }, 60000);
