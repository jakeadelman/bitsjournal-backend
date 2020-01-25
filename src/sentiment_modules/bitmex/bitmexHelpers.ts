export function createOrderObj(userNum, exec: any): Promise<OrderObj> {
  console.log("creating order obj");
  return new Promise<OrderObj>(async resolve => {
    let orderObject: OrderObj = {
      userNum: parseInt(userNum),
      execID: "",
      timestamp: "",
      side: "",
      orderQty: 0,
      leavesQty: 0,
      currentQty: 0,
      avgEntryPrice: "",
      execType: "",
      orderType: "",
      trdStart: false,
      trdEnd: false
    };
    orderObject.execID = exec.execID;
    orderObject.timestamp = exec.timestamp;
    orderObject.side = exec.side;
    orderObject.orderQty = exec.orderQty;
    orderObject.leavesQty = exec.leavesQty;
    orderObject.currentQty = exec.currentQty;
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
      realOrder = orderObject.orderQty * -1;
      realOrder = realOrder + orderObject.leavesQty;
    } else {
      realOrder = orderObject.orderQty - orderObject.leavesQty;
    }
    if (realOrder == orderObject.currentQty) {
      orderObject.trdStart = true;
    }
    if (orderObject.currentQty == 0 && orderObject.execType == "Trade") {
      orderObject.trdEnd = true;
    } else {
      orderObject.trdEnd = false;
    }
    resolve(orderObject);
  });
}

export function newDate() {
  let dt: any = new Date(new Date().toUTCString());
  dt = dt.toISOString();
  return dt;
  // console.log(dt);
}

export interface OrderObj {
  userNum: number;
  execID: string;
  timestamp: string;
  side: string;
  orderQty: number;
  leavesQty: number;
  currentQty: number;
  avgEntryPrice: string;
  execType: string;
  orderType: string;
  trdStart: boolean;
  trdEnd: boolean;
}
