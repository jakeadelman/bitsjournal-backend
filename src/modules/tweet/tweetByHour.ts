import { Resolver, Ctx, Query, Arg } from "type-graphql";
import { Between } from "typeorm";

import { DailyTweet } from "../../entity/DailyTweet";
import { Tweet } from "../../entity/Tweet";
import { MyContext } from "../../types/MyContext";
import { createConn } from "../utils/connectionOptions";

const dateformat = require("dateformat");

@Resolver()
export class GetDailyTweet {
  @Query(() => DailyTweet)
  async getDailyTweet(
    @Arg("query") query: string,
    @Ctx() ctx: MyContext
  ): Promise<any | undefined> {
    if (!ctx.req.session!.userId) {
      return undefined;
    }
    let connection = await createConn("twbyhconn");

    let now = new Date();
    let formatNow: number = dateformat(now, "yymmddHH");
    let formatMinus24 = formatNow - 24;

    console.log(formatNow, formatMinus24);

    const loaded = await connection.getRepository(Tweet).find({
      where: { query: query, hour: Between(formatMinus24, formatNow) }
    });
    let negCount = 0;
    let posCount = 0;
    let dailyT = new DailyTweet();

    loaded.map(load => {
      if (load.polarity == 1) {
        posCount += 1;
      } else if (load.polarity == 0) {
        negCount += 1;
      }
      let together = posCount + negCount;
      // console.log(together, loaded.length);
      if (together == loaded.length) {
        dailyT.day = formatNow;
        dailyT.negative = negCount;
        dailyT.positive = posCount;
        dailyT.total = loaded.length;
      }

      // console.log(load.polarity);
    });

    // console.log(hour);

    // let repo = connection.getRepository(DailyTweet);

    // let findings = await repo.find({
    //   where: { query: query, hour: hour }
    // });
    // console.log(loaded);
    connection.close();

    return await dailyT;
  }
}
