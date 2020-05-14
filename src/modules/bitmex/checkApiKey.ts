import { Resolver, Ctx, Query } from "type-graphql";
// import { createConnection } from "typeorm";
import { createConn } from "../utils/connectionOptions";
// import { Between } from "typeorm";
// import { Between } from "typeorm";

import { User } from "../../entity/User";
// import { Trade } from "../../entity/Trade";
import { MyContext } from "../../types/MyContext";
import { makeid } from "../../bitmex/bitmexHelpers";
// import { MoreThanDate, LessThanDate } from "./helpers";

@Resolver()
export class CheckApiResolver {
  @Query(() => Boolean)
  async checkApiKey(@Ctx() ctx: MyContext): Promise<any | undefined> {
    if (!ctx.req.session!.userId) {
      return undefined;
    }

    let randId = makeid(10);
    //create connection from custom function
    let connection = await createConn(randId);
    // let tradeRepo = connection.getRepository(Trade);
    let userRepo = connection.getRepository(User);
    let thisUser = await userRepo.find({
      where: { id: ctx.req.session!.userId },
    });
    // console.log(start, end);
    console.log(thisUser[0]);
    if (thisUser[0]!.apiKeyID == "none") {
      console.log("user is none");
      return false;
    } else {
      await connection.close();
      return true;
    }
  }
}
