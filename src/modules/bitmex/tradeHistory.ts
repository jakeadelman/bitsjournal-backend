import { Resolver, Ctx, Query, Arg } from "type-graphql";
// import { createConnection } from "typeorm";
import { createConn } from "../utils/connectionOptions";
import { Between } from "typeorm";

import { User } from "../../entity/User";
import { Trade } from "../../entity/Trade";
import { MyContext } from "../../types/MyContext";
import { makeid } from "../../sentiment_modules/bitmex/bitmexHelpers";

@Resolver()
export class TradeHistoryResolver {
  @Query(() => [Trade])
  async fetchTradeHistory(
    @Arg("start") start: string,
    @Arg("end") end: string,
    @Ctx() ctx: MyContext
  ): Promise<any | undefined> {
    if (!ctx.req.session!.userId) {
      return undefined;
    }

    let randId = makeid(10);
    //create connection from custom function
    let connection = await createConn(randId);
    let tradeRepo = connection.getRepository(Trade);
    let userRepo = connection.getRepository(User);
    let thisUser = await userRepo.find({
      where: { id: ctx.req.session!.userId }
    });
    console.log(start, end);
    let findings = await tradeRepo.find({
      where: {
        user: thisUser[0],
        relations: ["user"],
        timestamp: Between(start, end)
      },
      order: { timestamp: "DESC" }
    });
    console.log(findings);
    await connection.close();

    return findings;
  }
}
