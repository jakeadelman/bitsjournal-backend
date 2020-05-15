import { Resolver, Mutation, Ctx } from "type-graphql";
import { MyContext } from "../../types/MyContext";

@Resolver()
export class LogoutResolver {
  @Mutation(() => Boolean, { nullable: true })
  async logout(@Ctx() ctx: MyContext): Promise<null | boolean> {
    try {
      let sess = ctx.req.session;
      sess!.destroy(() => {
        console.log("session has been destroyed");
      });

      return true;
    } catch {
      return false;
    }
  }
}
