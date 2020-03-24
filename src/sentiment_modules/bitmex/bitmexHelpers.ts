export function createOrderObj(userNum, exec: any): Promise<OrderObj> {
  // console.log("creating order obj");
  return new Promise<OrderObj>(async resolve => {
    let orderObject: OrderObj = {
      userNum: parseInt(userNum),
      execID: "",
      timestamp: "",
      side: "",
      price: "",
      orderQty: 0,
      leavesQty: 0,
      currentQty: 0,
      avgEntryPrice: "",
      execType: "",
      orderType: "",
      execGrossPnl: 0,
      realizedPnl: 0,
      commission: "",
      trdStart: false,
      trdEnd: false,
      notes: "undefined",
      hashtags: "undefined"
    };
    orderObject.execID = exec.execID;
    // console.log(exec.execID);
    orderObject.timestamp = exec.timestamp;
    orderObject.side = exec.side;
    orderObject.orderQty = exec.orderQty;
    orderObject.leavesQty = exec.leavesQty;
    orderObject.currentQty = exec.currentQty;

    //price
    orderObject.price = exec.price.toString();
    // if (exec.stopPx != null) {
    //   orderObject.price = exec.stopPx.toString();
    // }

    if (exec.execGrossPnl == undefined || exec.execGrossPnl == "undefined") {
      orderObject.execGrossPnl = 0;
    } else {
      orderObject.execGrossPnl = exec.execGrossPnl;
    }
    if (exec.realizedPnl == undefined || exec.realizedPnl == "undefined") {
      orderObject.realizedPnl = 0;
    } else {
      orderObject.realizedPnl = exec.realizedPnl;
    }

    orderObject.commission = exec.commission.toString();
    if (!exec.avgEntryPrice) {
      orderObject.avgEntryPrice = "0";
    } else {
      orderObject.avgEntryPrice = exec.avgEntryPrice.toString();
    }

    orderObject.execType = exec.execType;
    if (
      !exec.orderType ||
      exec.orderType == undefined ||
      exec.orderType == null
    ) {
      orderObject.orderType = "undefined";
    } else {
      orderObject.orderType = exec.orderType.toString();
    }

    let realOrder: number;
    if (orderObject.side == "Sell") {
      realOrder = (exec.orderQty - exec.leavesQty) * -1;
      // realOrder = realOrder + orderObject.leavesQty;
    } else {
      realOrder = exec.orderQty - exec.leavesQty;
    }

    if (orderObject.currentQty == 0 && orderObject.execType == "Trade") {
      orderObject.trdEnd = true;
    }
    // if (orderObject.timestamp == "2020-03-07T08:43:18.644Z") {
    //   console.log(realOrder, orderObject.currentQty);
    //   console.log("issss");
    // }
    if (
      orderObject.side == "Sell" &&
      orderObject.currentQty < 0 &&
      realOrder < orderObject.currentQty
    ) {
      console.log("IS SELL");
      orderObject.trdEnd = true;
      orderObject.trdStart = true;
    }
    if (
      orderObject.side == "Buy" &&
      orderObject.currentQty > 0 &&
      realOrder > orderObject.currentQty
    ) {
      // console.log(
      //   realOrder + orderObject.currentQty,
      //   realOrder,
      //   orderObject.timestamp
      // );
      orderObject.trdEnd = true;
      orderObject.trdStart = true;
    }
    resolve(orderObject);
  });
}

export function newDate(hrsBack: number) {
  if (hrsBack == 0) {
    let dt: any = new Date(new Date().toUTCString());
    dt = dt.toISOString();
    return dt;
  } else {
    let dt: any = new Date(new Date().toUTCString());
    dt.setHours(dt.getHours() - hrsBack);
    dt = dt.toISOString();
    return dt;
  }
  // console.log(dt);
}

export function newTwelveHourDate(hrsBack: number) {
  if (hrsBack == 0) {
    let dt: any = new Date(new Date().toUTCString());
    dt.setHours(7, 0, 0, 0);
    dt = dt.toISOString();
    return dt;
  } else {
    let dt: any = new Date(new Date().toUTCString());
    dt.setHours(dt.getHours() - hrsBack);
    dt.setHours(7, 0, 0, 0);
    dt = dt.toISOString();
    return dt;
  }
  // console.log(dt);
}

export async function genDatesList(): Promise<any> {
  return new Promise(async resolve => {
    let daysBack = 15;
    let arr: string[] = [];
    for (let i = 0; i < daysBack; i++) {
      let num = 24 * i;

      if (i == 0) {
        let otherDate = newTwelveHourDate(num);
        let newerDate = newDate(num);
        arr.push(otherDate);
        arr.push(newerDate);
      } else {
        let date: string = newTwelveHourDate(num);
        arr.push(date);
      }
      if (i == daysBack - 1) {
        let newArr = arr.reverse();
        resolve(newArr);
      }
    }
    // return [];
  });
}

export function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export interface OrderObj {
  userNum: number;
  execID: string;
  timestamp: string;
  side: string;
  price: string;
  orderQty: number;
  leavesQty: number;
  currentQty: number;
  avgEntryPrice: string;
  execType: string;
  orderType: string;
  execGrossPnl: number;
  realizedPnl: number;
  commission: string;
  trdStart: boolean;
  trdEnd: boolean;
  notes: string;
  hashtags: string;
}
