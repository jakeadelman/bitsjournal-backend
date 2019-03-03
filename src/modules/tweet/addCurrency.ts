import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import { Currency } from "../../entity/Currency";
import { MyContext } from "../../types/MyContext";
import { createConn } from "../utils/connectionOptions";

@Resolver()
export class AddCurrencyResolver {
  @Mutation(() => Boolean, { nullable: true })
  async addCurrency(
    @Arg("currencyName") currencyName: string,
    @Arg("ticker") ticker: string,
    @Ctx() ctx: MyContext
  ): Promise<null | boolean> {
    let connection = await createConn("currencyconn");

    if (!ctx.req.session!.userId) {
      connection.close();
      console.log("not logged in");
      return null;
    }

    let currencyRepo = await connection.getRepository(Currency);
    let newCurrency = new Currency();
    newCurrency.name = currencyName;
    newCurrency.ticker = ticker;
    await currencyRepo.save(newCurrency);
    connection.close();

    return true;
  }
}
