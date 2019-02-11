import { Resolver, Ctx, Query, Arg } from "type-graphql";
import { createConnection } from "typeorm";
import { Between } from "typeorm";

import { Tweet } from "../../entity/Tweet";
import { MyContext } from "../../types/MyContext";

const dateformat = require("dateformat");

@Resolver()
export class TweetByHour {
  @Query(() => [])
  async tweetByHour(
    @Arg("query") query: string,
    @Ctx() ctx: MyContext
  ): Promise<any | undefined> {
    if (!ctx.req.session!.userId) {
      return undefined;
    }

    const connection = await createConnection({
      name: "tweetconni",
      type: "postgres",
      host: "instagauge.cmxxymh53lj2.us-east-1.rds.amazonaws.com",
      port: 5432,
      username: "manx",
      password: "jakeadelman",
      database: "instagauge",
      logging: true,
      entities: [
        __dirname + "/../../entity/*.*",
        __dirname + "/../../entity/instagram/*.*"
      ]
    });

    let now = new Date();
    let formatNow: number = dateformat(now, "yymmddHH");
    let formatMinus24 = formatNow - 24;

    console.log(formatNow, formatMinus24);

    const loaded = await connection.getRepository(Tweet).find({
      where: { query: query, hour: Between(formatMinus24, formatNow) }
    });

    loaded.map(load => {
      console.log(load.polarity);
    });

    // console.log(hour);

    // let repo = connection.getRepository(Tweet);

    // let findings = await repo.find({
    //   where: { query: query, hour: hour }
    // });
    // console.log(loaded);
    connection.close();

    return loaded;
  }
}
