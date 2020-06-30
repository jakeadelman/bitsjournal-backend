import { Resolver, Mutation, Ctx } from "type-graphql";
// import { User } from "../../entity/User";
import { MyContext } from "../../types/MyContext";
import { createConn } from "../utils/connectionOptions";
import { populateExecs } from "../../bitmex/execution/populateExecution";
import { makeid } from "../../bitmex/bitmexHelpers";

@Resolver()
export class PopulateResolver {
  @Mutation(() => Boolean, { nullable: true })
  async populate(@Ctx() ctx: MyContext): Promise<null | undefined | boolean> {
    let randid = makeid(10);
    let connection = await createConn("apikeyconn" + randid.toString());
    // console.log(ctx.req.session!.userId);
    try {
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
      await connection.close();
      console.log(res, "THIS RES");
      return res;
    } catch (err) {
      await connection.close();
      return null;
    }
  }
}
