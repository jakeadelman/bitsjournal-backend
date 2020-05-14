import { Resolver, Ctx, Query, Arg } from "type-graphql";
// import { createConnection } from "typeorm";
import { createConn } from "../utils/connectionOptions";
// import { Between } from "typeorm";
import { getRepository } from "typeorm";

// import { User } from "../../entity/User";
import { Candle } from "../../entity/Candle";
import { MyContext } from "../../types/MyContext";
import { makeid } from "../../bitmex/bitmexHelpers";
// import { MoreThanDate, LessThanDate } from "./helpers";

@Resolver()
export class OneHourCandleHistoryResolver {
  @Query(() => [Candle])
  async fetchOneHourCandleHistory(
    @Arg("start") start: string,
    @Arg("end") end: string,
    @Ctx() ctx: MyContext
  ): Promise<any | undefined> {
    if (!ctx.req.session!.userId) {
      return undefined;
    }

    let randId = makeid(10);
    //create connection from custom function
    let connection = await createConn(randId);
    // let candleRepo = connection.getRepository(Candle);
    // let userRepo = connection.getRepository(User);
    // let thisUser = await userRepo.find({
    //   where: { id: ctx.req.session!.userId }
    // });
    // console.log(start, end);
    // console.log(thisUser[0]);
    let newStart: any = new Date(start);
    let newEnd: any = new Date(end);
    // var diffMs = newStart - newEnd; // milliseconds between now & Christmas
    // // var diffDays = Math.floor(diffMs / 86400000); // days
    // // var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours

    // var diffSecs = diffMs / 1000;
    // var diffMins = Math.round(diffSecs / 60); // minutes
    // var diffHrs = Math.round(diffMins / 60); // hours
    // console.log(diffMs, diffSecs, diffMins, diffHrs);
    // var diffHours = Math.abs(diffMins / 60);
    var MS_PER_MINUTE = 60000;
    let timeframe: string = "1h";
    // if (diffFiveMins < 10) {
    newStart = new Date(newStart - 4 * 60 * MS_PER_MINUTE);
    newEnd = new Date(newEnd.getTime() + 4 * 60 * MS_PER_MINUTE);
    // timeframe = "5m";
    const findings = await getRepository(Candle)
      .createQueryBuilder("candle")
      .where(
        "timestamp >= :timestamp AND timestamp < :timestamptwo AND timeframe = :timeframe",
        {
          timestamp: newStart.toISOString(),
          timestamptwo: newEnd.toISOString(),
          timeframe: timeframe,
        }
      )
      .orderBy("candle.timestamp", "DESC")
      .getMany();

    connection.close();
    // console.log(findings);
    console.log(newStart, newEnd, timeframe);
    return findings;
  }
}
