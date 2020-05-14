import { Resolver, Mutation, Ctx } from "type-graphql";
// import { User } from "../../entity/User";
import { MyContext } from "../../types/MyContext";
import { createConn } from "../utils/connectionOptions";
import { populateExecs } from "../../bitmex/execution/populateExecution";

@Resolver()
export class PopulateResolver {
  @Mutation(() => Boolean, { nullable: true })
  async populate(@Ctx() ctx: MyContext): Promise<null | undefined | boolean> {
    let connection = await createConn("apikeyconn");
    // console.log(ctx.req.session!.userId);
    if (!ctx.req.session!.userId) {
      console.log(ctx.req.session);
      connection.close();
      console.log("not logged in");
      return null;
    }
    let userId = ctx.req.session!.userId;
    console.log("POPULATING");
    console.log(userId);
    let res = await populateExecs(userId);
    connection.close();
    console.log(res, "THIS RES");
    return res;
  }
}
