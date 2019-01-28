import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import bcrypt from "bcryptjs";
import { User } from "../../entity/User";
import { MyContext } from "../../types/MyContext";

const jwt = require("jsonwebtoken");

@Resolver()
export class LoginResolver {
  @Mutation(() => String, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ): Promise<User | string | null> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return null;
    }

    if (!user.confirmed) {
      return null;
    }

    ctx.req.session!.userId = user.id;
    // console.log(ctx.req.session!);

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      "somesupersecret",
      { expiresIn: "1y" }
    );

    return token;
  }
}
