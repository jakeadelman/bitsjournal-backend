import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
// import bcrypt from "bcryptjs";
import { createConnection } from "typeorm";
import { User } from "../../../entity/User";
import { MyContext } from "../../../types/MyContext";

@Resolver()
export class AddInstaUserResolver {
  @Mutation(() => Boolean, { nullable: true })
  async addInstaUser(
    @Arg("account") account: string,
    @Ctx() ctx: MyContext
  ): Promise<null | boolean> {
    const connection = await createConnection({
      name: "instaconn",
      type: "postgres",
      host: "instagauge.cmxxymh53lj2.us-east-1.rds.amazonaws.com",
      port: 5432,
      username: "manx",
      password: "jakeadelman",
      database: "instagauge",
      logging: true,
      entities: [__dirname + "/../../../entity/*.*"]
    });

    if (!ctx.req.session!.userId) {
      return null;
    }

    let theUser = ctx.req.session!.userId;

    let userRepo = connection.getRepository(User);
    let instaUsers = await userRepo.findOne({
      where: { id: theUser },
      select: ["instagramUsers"]
    });
    console.log(instaUsers);
    let newInstaUsers;
    if (instaUsers == undefined) {
      newInstaUsers = [];
      newInstaUsers += account;
    } else if (instaUsers) {
      instaUsers.instagramUsers.push(account);
      newInstaUsers = instaUsers.instagramUsers;
    }

    let response = await connection
      .createQueryBuilder()
      .update(User)
      .set({ instagramUsers: newInstaUsers })
      .where("id = :id", { id: theUser })
      .execute();

    console.log(response);
    connection.close();

    return true;
  }
}
