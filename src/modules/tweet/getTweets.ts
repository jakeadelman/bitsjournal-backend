import { Resolver, Ctx, Query, Arg } from "type-graphql";
import { createConnection } from "typeorm";

import { Tweet } from "../../entity/Tweet";
import { MyContext } from "../../types/MyContext";

@Resolver()
export class FetchTweetResolver {
  @Query(() => [Tweet])
  async fetchTweets(
    @Arg("query") query: string,
    @Ctx() ctx: MyContext
  ): Promise<any | undefined> {
    if (!ctx.req.session!.userId) {
      return undefined;
    }
    //test commit
    //test
    const connection = await createConnection({
      name: "tweetconn",
      type: "postgres",
      host: "instagauge.cmxxymh53lj2.us-east-1.rds.amazonaws.com",
      port: 5432,
      username: "manx",
      password: "jakeadelman",
      database: "instagauge",
      logging: true,
      entities: [__dirname + "/../../entity/*.*"]
    });

    let repo = connection.getRepository(Tweet);

    let findings = await repo.find({ where: { query: query }, take: 20 });
    connection.close();

    return findings;
  }
}
