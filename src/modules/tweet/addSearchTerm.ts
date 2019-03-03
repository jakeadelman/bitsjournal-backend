import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
// import bcrypt from "bcryptjs";
import { Currency } from "../../entity/Currency";
import { MyContext } from "../../types/MyContext";
// import { InstaUser } from "../../entity/instagram/instaUser";
import { SearchTerm } from "../../entity/SearchTerm";
import { createConn } from "../utils/connectionOptions";

@Resolver()
export class AddSearchTermResolver {
  @Mutation(() => Boolean, { nullable: true })
  async addSearchTerm(
    @Arg("searchterm") searchterm: string,
    @Arg("currencyName") currencyName: string,
    @Ctx() ctx: MyContext
  ): Promise<null | boolean> {
    let connection = await createConn("stconn");

    if (!ctx.req.session!.userId) {
      connection.close();
      console.log("not logged in");
      return null;
    }

    // let theUser = ctx.req.session!.userId;

    let currencyRepo = await connection.getRepository(Currency);
    let stRepo = await connection.getRepository(SearchTerm);
    let currency = await currencyRepo.findOne({
      where: { name: currencyName }
    });

    if (!!currency) {
      let newSearchTerm = new SearchTerm();
      newSearchTerm.currency = currency!;
      newSearchTerm.term = searchterm;
      await stRepo.save(newSearchTerm);

      //close connection
      connection.close();
    }
    return true;
  }
}
