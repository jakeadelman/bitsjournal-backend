import { Resolver, Ctx, Query } from "type-graphql";
import { createConnection } from "typeorm";

import { User } from "../../entity/User";
import { SearchTerm } from "../../entity/SearchTerm";
import { MyContext } from "../../types/MyContext";

@Resolver()
export class FetchTermResolver {
  @Query(() => [SearchTerm])
  async fetchTerms(@Ctx() ctx: MyContext): Promise<any | undefined> {
    if (!ctx.req.session!.userId) {
      return undefined;
    }
    //test commit
    //test
    const connection = await createConnection({
      name: "tweetconnew",
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

    let repo = connection.getRepository(User);
    // let stRepo = connection.getRepository(SearchTerm);

    let findings = await repo.findOne({
      where: { id: ctx.req.session!.userId },
      relations: ["searchterms"]
    });
    console.log(findings!.searchterms);
    connection.close();

    return findings!.searchterms;
  }
}
