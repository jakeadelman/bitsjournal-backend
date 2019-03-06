import { Resolver, Ctx, Query, Arg } from "type-graphql";
// import { createConnection } from "typeorm";
// import { createConn } from "../../utils/connectionOptions";
import { GoogleTrends } from "../../../entity/google_trends/gTrends";
// import { FourHourSentiment } from "../../entity/sentiment/FourHourSentiment";
import { MyContext } from "../../../types/MyContext";
import { fetchGTrends } from "../../../sentiment_modules/gTrends";

@Resolver()
export class GoogleTrendsResolver {
  @Query(() => [GoogleTrends])
  async fetchGoogleTrend(
    @Arg("currency") currency: string,
    @Arg("time") time: string,
    @Ctx() ctx: MyContext
  ): Promise<any | undefined> {
    if (!ctx.req.session!.userId) {
      return undefined;
    }
    //create connection from custom function
    // let gTrendsData = new GoogleTrends();
    // let endDate;
    // let startDate;
    if (time == "day") {
      let endDate = new Date();
      let startDate = new Date();
      startDate.setDate(startDate.getDate() - 1);
      return await fetchGTrends(startDate, endDate, currency);
    }
    if (time == "week") {
      let endDate = new Date();
      let startDate = new Date();
      startDate.setDate(startDate.getDate() - 300);
      return await fetchGTrends(startDate, endDate, currency);
    }
    // // let dat: any;
    // if (!startDate && !endDate) {
    //   return false;
    // }
  }
}
