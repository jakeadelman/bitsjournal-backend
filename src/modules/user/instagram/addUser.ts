import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
// import bcrypt from "bcryptjs";
import { createConnection } from "typeorm";
import { User } from "../../../entity/User";
import { MyContext } from "../../../types/MyContext";
import { InstaUser } from "../../../entity/instagram/instaUser";

@Resolver()
export class AddInstaUserResolver {
  @Mutation(() => Boolean, { nullable: true })
  async addInstaUser(
    @Arg("account") account: string,
    @Ctx() ctx: MyContext
  ): Promise<null | boolean> {
    let entLo1 = __dirname + "/../../../entity/*.*";
    let entLo2 = __dirname + "/../../../entity/instagram/*.*";
    const connection = await createConnection({
      name: "instaconnection",
      type: "postgres",
      host: "instagauge.cmxxymh53lj2.us-east-1.rds.amazonaws.com",
      port: 5432,
      username: "manx",
      password: "jakeadelman",
      database: "instagauge",
      logging: true,
      entities: [entLo1, entLo2]
    });

    if (!ctx.req.session!.userId) {
      return null;
    }

    let theUser = ctx.req.session!.userId;

    let userRepo = connection.getRepository(User);
    let instaUserRepo = connection.getRepository(InstaUser);
    let user = await userRepo.findOne({
      where: { id: theUser },
      relations: ["instagramUsers"]
    });

    if (user == undefined) {
      return false;
    }

    let isFalse = false;
    user.instagramUsers.map(us => {
      if (us.name == account) {
        console.log("THIS IS THE FUCKING SAME");
        isFalse = true;
      } else {
        return;
      }
    });

    if (!!isFalse) {
      connection.close();
      return false;
    }

    let newInstaUser = new InstaUser();
    newInstaUser.name = account;
    newInstaUser.user = user;
    await instaUserRepo.save(newInstaUser);

    console.log(account);
    connection.close();

    return true;
  }
}
