import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
// import bcrypt from "bcryptjs";
import { User } from "../../entity/User";
import { MyContext } from "../../types/MyContext";
// import { InstaUser } from "../../entity/instagram/instaUser";
import { SearchTerm } from "../../entity/SearchTerm";
import { createConn } from "../utils/connectionOptions";

@Resolver()
export class AddSearchTermResolver {
  @Mutation(() => Boolean, { nullable: true })
  async addSearchTerm(
    @Arg("searchterm") searchterm: string,
    @Ctx() ctx: MyContext
  ): Promise<null | boolean> {
    let connection = await createConn("stconn");

    if (!ctx.req.session!.userId) {
      connection.close();
      console.log("not logged in");
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
