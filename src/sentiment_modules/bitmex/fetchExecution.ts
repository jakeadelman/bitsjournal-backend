import { BitmexAPI } from "bitmex-node";
import { User } from "../../entity/User";
// import { Trade } from "../../entity/Trade";
// import { Trade } from "../../entity/Trade";
import { newDate, makeid } from "./bitmexHelpers";
import { createConn } from "../../modules/utils/connectionOptions";
import { fetchHistory, addStartEnd } from "./populateExecution";

setInterval(async function () {
  let randId = makeid(10);
  let newconn = await createConn(randId);
  let userRepo = newconn.getRepository(User);
  let userNums = await userRepo.find({
    select: ["id", "apiKeyID", "apiKeySecret"],
  });
  console.log(userNums);
  for (let i = 0; i < userNums.length; i++) {
    let symbols = ["XBTUSD", "XBTH20"];
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
        console.log(fullExecHistory[0]);
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
}, 60000);

// import { BitmexAPI } from "bitmex-node";
// import { User } from "../../entity/User";
// import { Trade } from "../../entity/Trade";
// import { createOrderObj, genDatesList, makeid } from "./bitmexHelpers";
// import { createConn } from "../../modules/utils/connectionOptions";

// export async function populate(userId) {
//   return new Promise(async resolve => {
//     let randId = makeid(10);
//     let newconn = await createConn(randId);
//     let userRepo = newconn.getRepository(User);
//     let userNums = await userRepo.find({
//       where: { id: userId },
//       select: ["id", "apiKeyID", "apiKeySecret"]
//     });
//     try {
//       const bitmex = new BitmexAPI({
//         apiKeyID: userNums[0].apiKeyID,
//         apiKeySecret: userNums[0].apiKeySecret
//       });
//       let symbol = "XBTUSD";
//       const fullExecHistory = await bitmex.Execution.getTradeHistory({
//         symbol: symbol,
//         count: 500,
//         reverse: true
//       });

//       // console.log(userNums);
//       // let oneHrBack: any = newDate(1);
//       let datesList = await genDatesList();
//       console.log(datesList);
//       var theEye = 1; //  set your counter to 1
//       myLoop(
//         datesList,
//         userNums,
//         newconn,
//         theEye,
//         fullExecHistory,
//         bitmex,
//         symbol
//       )
//         .then(() => {
//           resolve(true);
//         })
//         .catch(err => console.log(err));
//     } catch (err) {
//       console.log(err);
//     }
//   });
// }
