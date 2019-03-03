// import { Resolver, Ctx, Query, Arg } from "type-graphql";
// // import { createConnection } from "typeorm";
// import { createConn } from "../utils/connectionOptions";

// import { Currency } from "../../entity/Currency";
// import { HourSentiment } from "../../entity/sentiment/HourSentiment";
// import { MyContext } from "../../types/MyContext";
// const dateFormat = require("dateformat");

// @Resolver()
// export class HourSentimentResolver {
//   @Query(() => [HourSentiment])
//   async hourSentiment(
//     @Arg("currency") currency: string,
//     @Arg("hoursBack") hoursBack: number,
//     @Ctx() ctx: MyContext
//   ): Promise<any | undefined> {
//     if (!ctx.req.session!.userId) {
//       return undefined;
//     }
//     let uidStr = ctx.req.session!.userId.toString();
//     //create connection from custom function
//     let connection = await createConn("hoursentconn" + "-uid-" + uidStr);
//     let currencyRepo = connection.getRepository(Currency);
//     let sentimentRepo = connection.getRepository(HourSentiment);

//     let currencyFind = await currencyRepo.findOne({
//       where: { name: currency },
//       relations: ["terms"]
//     });
//     if (!currencyFind) {
//       return false;
//     }

//     currencyFind.terms.map(async term => {
//       let sentis = await sentimentRepo.find({
//         where: { term: term.term },
//         take: hoursBack
//       });
//       sent += sentis.sentiment;
//     });

//     connection.close();

//     return findings;
//   }
// }
