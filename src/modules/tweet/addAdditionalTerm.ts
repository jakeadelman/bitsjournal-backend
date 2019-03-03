import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import { Currency } from "../../entity/Currency";
import { MyContext } from "../../types/MyContext";
import { createConn } from "../utils/connectionOptions";

@Resolver()
export class AddAdditionalTermResolver {
  @Mutation(() => Boolean, { nullable: true })
  async addAdditionalTerm(
    @Arg("newTerm") newTerm: string,
    @Arg("currency") currency: string,
    @Ctx() ctx: MyContext
  ): Promise<null | boolean> {
    let connection = await createConn("currencyconn");

    if (!ctx.req.session!.userId) {
      connection.close();
      console.log("not logged in");
      return null;
    }

    let currencyRepo = await connection.getRepository(Currency);
    let newCurrency = await currencyRepo.findOne({ where: { name: currency } });
    if (!!newCurrency && newCurrency.additional_terms[0]) {
      newCurrency.additional_terms.push(newTerm);
      await currencyRepo.save(newCurrency);
      connection.close();
      return true;
    } else if (!!newCurrency && !newCurrency.additional_terms) {
      let newRay: string[] = [];
      newRay.push(newTerm);
      newCurrency.additional_terms = newRay;
      await currencyRepo.save(newCurrency);
      connection.close();
      return true;
    } else {
      connection.close();
      return false;
    }
  }
}
