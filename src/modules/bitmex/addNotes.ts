import { Resolver, Ctx, Mutation, Arg } from "type-graphql";
// import { createConnection } from "typeorm";
import { createConn } from "../utils/connectionOptions";
// import { Between } from "typeorm";
// import { Between } from "typeorm";

import { User } from "../../entity/User";
import { Trade } from "../../entity/Trade";
import { MyContext } from "../../types/MyContext";
import { makeid } from "../../sentiment_modules/bitmex/bitmexHelpers";
// import { MoreThanDate, LessThanDate } from "./helpers";

@Resolver()
export class AddNotesResolver {
  @Mutation(() => String, { nullable: true })
  async addNotes(
    @Arg("time") time: string,
    @Arg("notes") notes: string,
    // @Arg("hashtags") hashtags: string,
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
    // console.log(start, end);
    console.log(thisUser[0]);
    let findings = await tradeRepo.find({
      where: [
        {
          user: thisUser[0],
          relations: ["user"],
          timestamp: time
        }
      ],
      order: { tradeNum: "ASC" }
    });
    try {
      if (notes != "undefined") {
        findings[0]!.notes = notes;
      }
      // if (hashtags != "undefined") {
      //   findings[0]!.hashtags = hashtags;
      // }
      await findings[0]!.save();
      await connection.close();

      return true;
    } catch (err) {
      return false;
    }
  }
}
