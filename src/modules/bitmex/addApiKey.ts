import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import { User } from "../../entity/User";
import { MyContext } from "../../types/MyContext";
import { createConn } from "../utils/connectionOptions";

@Resolver()
export class AddApiKeyResolver {
  @Mutation(() => Boolean, { nullable: true })
  async addApiKey(
    @Arg("key") key: string,
    @Arg("secret") secret: string,
    @Ctx() ctx: MyContext
  ): Promise<null | boolean> {
    let connection = await createConn("apikeyconn");
    // console.log(ctx.req.session!.userId);
    if (!ctx.req.session!.userId) {
      console.log(ctx.req.session);
      connection.close();
      console.log("not logged in");
      return null;
    }
    let userID = ctx.req.session!.userId;

    let userRepo = await connection.getRepository(User);
    let thisUser = await userRepo.findOne({
      where: { id: userID },
      select: ["id", "apiKeyID", "apiKeySecret"]
    });
    if (thisUser!.apiKeyID !== "none") {
      console.log("user already has key");
      return null;
    }
    thisUser!.apiKeyID = key;
    thisUser!.apiKeySecret = secret;
    await userRepo.save(thisUser!);
    connection.close();
    return true;
  }
}
