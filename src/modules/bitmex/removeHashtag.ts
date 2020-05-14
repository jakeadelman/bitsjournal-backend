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
export class RemoveHashtagResolver {
  @Mutation(() => String, { nullable: true })
  async removeHashtag(
    @Arg("time") time: string,
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
      console.log("hashtag to remove is " + hashtag);

      if (hashtag != "undefined") {
        let hashtags = findings[0]!.hashtags.split(",");
        console.log(hashtags[0]);
        if (hashtags[0] == "undefined") {
          console.log("<<<<<<<<<<<<<<<<<");
          console.log("HASHTAGS length is", hashtags.length);
          console.log("<<<<<<<<<<<<<<<<<");

          findings[0]!.hashtags = hashtag;
          await findings[0]!.save();
          await connection.close();
        } else {
          let newHashtags: string = "";
          console.log("<<<<<<<<<<<<<<<<<");
          console.log("HASHTAGS length is", hashtags.length);
          console.log("<<<<<<<<<<<<<<<<<");
          for (let i = 0; i < hashtags.length; i++) {
            if (hashtag !== hashtags[i]) {
              newHashtags += hashtags[i] + ",";
            }
            if (i == hashtags.length - 1) {
              if (hashtags.length == 1) {
                findings[0]!.hashtags = "undefined";
                await findings[0]!.save();
                await connection.close();
                return "saved new hashtags (length was 1)";
              } else {
                //   let oldHashtags = findings[0]!.hashtags;
                newHashtags = newHashtags.substring(0, newHashtags.length - 1);
                findings[0]!.hashtags = newHashtags;
                await findings[0]!.save();
                await connection.close();

                return "saved new hashtags";
              }
            }
          }
        }
      }
    } catch (err) {
      return false;
    }
  }
}
