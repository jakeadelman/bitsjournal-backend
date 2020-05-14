import { Resolver, Ctx, Mutation, Arg } from "type-graphql";
// import { createConnection } from "typeorm";
import { createConn } from "../utils/connectionOptions";
// import { Between } from "typeorm";
// import { Between } from "typeorm";

import { User } from "../../entity/User";
import { Trade } from "../../entity/Trade";
import { MyContext } from "../../types/MyContext";
import { makeid } from "../../bitmex/bitmexHelpers";
// import { MoreThanDate, LessThanDate } from "./helpers";

@Resolver()
export class AddHashtagResolver {
  @Mutation(() => String, { nullable: true })
  async addHashtag(
    @Arg("time") time: string,
    // @Arg("notes") notes: string,
    @Arg("hashtag") hashtag: string,
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
      where: { id: ctx.req.session!.userId },
    });
    // console.log(start, end);
    console.log(thisUser[0]);
    let findings = await tradeRepo.find({
      where: [
        {
          user: thisUser[0],
          relations: ["user"],
          timestamp: time,
        },
      ],
      order: { tradeNum: "ASC" },
    });
    try {
      //   if (notes != "undefined") {
      //     findings[0]!.notes = notes;
      //   }
      console.log("new hash is " + hashtag);

      if (hashtag != "undefined") {
        let hashtags = findings[0]!.hashtags.split(",");
        console.log(hashtags[0]);
        if (hashtags[0] == "undefined") {
          findings[0]!.hashtags = hashtag;
          await findings[0]!.save();
          await connection.close();
        } else {
          for (let i = 0; i < hashtags.length; i++) {
            if (hashtag == hashtags[i]) {
              // await findings[0]!.save();
              await connection.close();

              return "already added";
            }
            if (i == hashtags.length - 1) {
              let oldHashtags = findings[0]!.hashtags;

              findings[0]!.hashtags = oldHashtags + "," + hashtag;
              await findings[0]!.save();
              await connection.close();

              return "was undefined";
            }
          }
        }
      }
    } catch (err) {
      return false;
    }
  }
}
