import { Resolver, Ctx, Query, Arg } from "type-graphql";
// import { createConnection } from "typeorm";
import { createConn } from "../utils/connectionOptions";

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
    //create connection from custom function
    let connection = await createConn("gettwconn");
    let repo = connection.getRepository(Tweet);

    let findings = await repo.find({ where: { query: query }, take: 20 });
    connection.close();

    return findings;
  }
}
