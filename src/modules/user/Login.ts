import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import bcrypt from "bcryptjs";
import { User } from "../../entity/User";
import { MyContext } from "../../types/MyContext";

@Resolver()
export class LoginResolver {
  @Mutation(() => String, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ): Promise<null | boolean> {
    const user = await User.findOne({ where: { email } });
    console.log("fetching user...");

    if (!user) {
      console.log("no user found");
      return null;
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      console.log("user not valid");
      return null;
    }

    if (!user.confirmed) {
      console.log("user not confirmed");
      return null;
    }

    ctx.req.session!.userId = user.id;
    console.log("user has been logged in");

    return true;
  }
}
