import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
// import bcrypt from "bcryptjs";
import { createConnection } from "typeorm";
import { User } from "../../entity/User";
import { MyContext } from "../../types/MyContext";
// import { InstaUser } from "../../entity/instagram/instaUser";
import { SearchTerm } from "../../entity/SearchTerm";

@Resolver()
export class AddSearchTermResolver {
  @Mutation(() => Boolean, { nullable: true })
  async addSearchTerm(
    @Arg("searchterm") searchterm: string,
    @Ctx() ctx: MyContext
  ): Promise<null | boolean> {
    let entLo1 = __dirname + "/../../entity/*.*";
    let entLo2 = __dirname + "/../../entity/instagram/*.*";
    const connection = await createConnection({
      name: "instaconntsdfsisdfe",
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "manx",
      password: "jakeadelman",
      database: "instagauge",
      logging: true,
      entities: [entLo1, entLo2]
    });

    if (!ctx.req.session!.userId) {
      connection.close();
      return null;
    }

    let theUser = ctx.req.session!.userId;

    let userRepo = connection.getRepository(User);
    let stRepo = connection.getRepository(SearchTerm);
    let user = await userRepo.findOne({
      where: { id: theUser },
      relations: ["searchterms"]
    });

    if (user == undefined) {
      return false;
    }
    console.log(user);
    console.log(searchterm);
    // console.log(searchterm);
    // console.log(stRepo);
    let isFalse = false;
    user.searchterms.map(us => {
      if (us.term == searchterm) {
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

    //check if searchterm already exists
    let st = await stRepo.findOne({ where: { term: searchterm } });
    if (typeof st !== "undefined") {
      console.log("already exists.. adding to user");
      user.searchterms.push(st);
      await userRepo.save(user);
      connection.close();
      return true;
    }

    let newSearchTerm = await new SearchTerm();
    console.log(newSearchTerm);
    newSearchTerm.term = searchterm;
    newSearchTerm.users = [user];
    await stRepo.save(newSearchTerm);

    // console.log(searchterm);
    connection.close();

    return true;
  }
}
