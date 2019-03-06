import { Resolver, Query, Ctx } from "type-graphql";
// import bcrypt from "bcryptjs";
import { Currency } from "../../entity/Currency";
import { MyContext } from "../../types/MyContext";
import { createConn } from "../utils/connectionOptions";

@Resolver()
export class AllCurrenciesResolver {
  @Query(() => [Currency], { nullable: true })
  async allCurrencies(
    @Ctx() ctx: MyContext
  ): Promise<boolean | null | Currency[]> {
    if (!ctx.req.session!.userId) {
      console.log("not logged in");
      return null;
    }
    let connection = await createConn(
      "allcurrconn" + ctx.req.session!.userId.toString()
    );

    let currencyRepo = await connection.getRepository(Currency);
    let allCurrencies = await currencyRepo.find({ order: { id: "ASC" } });
    console.log(allCurrencies);
    if (!allCurrencies) {
      connection.close();
      return false;
    }
    console.log(allCurrencies);
    connection.close();
    return allCurrencies;
  }
}
