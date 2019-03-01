import { Resolver, Ctx, Query, Arg } from "type-graphql";
// import { createConnection } from "typeorm";
import { createConn } from "../utils/connectionOptions";

import { FourHourSentiment } from "../../entity/sentiment/FourHourSentiment";
import { MyContext } from "../../types/MyContext";

@Resolver()
export class FourHourSentResolver {
  @Query(() => [FourHourSentiment])
  async fetchFourHourSent(
    @Arg("term") term: string,
    @Ctx() ctx: MyContext
  ): Promise<any | undefined> {
    if (!ctx.req.session!.userId) {
      return undefined;
    }
    //create connection from custom function
    let connection = await createConn("senticonn");
    let repo = connection.getRepository(FourHourSentiment);

    let findings = await repo.find({
      where: { term: term },
      take: 7,
      order: { id: "DESC" }
    });
    connection.close();

    return findings;
  }
}
