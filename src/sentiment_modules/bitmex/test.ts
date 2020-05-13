import { fetchTrades } from "./trades/helpers";
import { createConn } from "../../modules/utils/connectionOptions";

async function hello() {
  // let randId = makeid(10);
  let newconn = await createConn("testconn");
  await fetchTrades("1m", "XBTUSD", 1, newconn);
}
hello();
