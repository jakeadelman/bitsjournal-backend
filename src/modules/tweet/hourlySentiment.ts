import { Resolver, Ctx, Query, Arg } from "type-graphql";
// import { createConnection } from "typeorm";
import { createConn } from "../utils/connectionOptions";

import { Currency } from "../../entity/Currency";
import { HourSentiment } from "../../entity/sentiment/HourSentiment";
import { MyContext } from "../../types/MyContext";
// const dateFormat = require("dateformat");
import { Sentiment } from "../../entity/sentiment/Sentiment";

@Resolver()
export class HourSentimentResolver {
  @Query(() => Sentiment)
  async hourSentiment(
    @Arg("currency") currency: string,
    @Arg("hoursBack") hoursBack: string,
    @Ctx() ctx: MyContext
  ): Promise<any | undefined> {
    console.log("ok");
    if (!ctx.req.session!.userId) {
      return undefined;
    }
    let hoursBackInt = parseInt(hoursBack);
    let uidStr = ctx.req.session!.userId.toString();
    //create connection from custom function
    let connection = await createConn("hoursentconn" + "-uid-" + uidStr);
    let currencyRepo = connection.getRepository(Currency);
    let sentimentRepo = connection.getRepository(HourSentiment);
    // let sentRepo = connection.getRepository(Sentiment);
    // const utcHourMinusOne = await getUtcHour();

    let currencyFind = await currencyRepo.findOne({
      where: { name: currency },
      relations: ["terms"]
    });
    if (!currencyFind) {
      return false;
    }
    // let sentis: any[] = [];
    let thisSenti: any;
    let newSent = new Sentiment();
    newSent.currency = currency;
    newSent.time = [];
    newSent.num_tweets = [];
    newSent.sentiment = [];
    for (let i = 0; i < currencyFind.terms.length; i++) {
      thisSenti = await sentimentRepo.find({
        where: { term: currencyFind.terms[i].term },
        order: { id: "DESC" },
        take: hoursBackInt
      });
      console.log(thisSenti);
      for (let r = 0; r < thisSenti.length; r++) {
        if (i == 0) {
          console.log(thisSenti[r].hour);
          newSent.time.push(parseInt(thisSenti[r].hour));
          newSent.sentiment.push(parseFloat(thisSenti[r].sentiment));
          newSent.num_tweets.push(thisSenti[r].num_tweets);
        } else {
          newSent.sentiment[r] =
            newSent.sentiment[r] + parseFloat(thisSenti[r].sentiment);
          newSent.num_tweets[r] =
            newSent.num_tweets[r] + thisSenti[r].num_tweets;
        }
      }
      console.log(newSent);
      //   if (sentis.length == currencyFind.terms.length) {
      //     connection.close();
      //     return sentis;
      //   }
    }
    console.log(currencyFind.terms.length, thisSenti.length);
    let num = currencyFind.terms.length;
    for (let o = 0; o < newSent.sentiment.length; o++) {
      newSent.sentiment[o] = newSent.sentiment[o] / num;
    }

    connection.close();
    return newSent;
  }
}

// const getUtcHour = () => {
//   return new Promise<string>(resolve => {
//     console.log(`starting hour is ${theHour}`);
//     let utcHour = dateFormat(new Date(), "UTC:yymmddHH");
//     let utcHourString = utcHour.toString();
//     let endTwoHours = utcHourString[6] + utcHourString[7];
//     let newUtc;
//     if (endTwoHours == "00") {
//       newUtc = parseInt(utcHour) - 77;
//       console.log(`ending hour is ${newUtc}`);
//       resolve(newUtc.toString());
//     } else {
//       newUtc = parseInt(utcHour) - 1;
//       console.log(`ending hour is ${newUtc}`);
//       resolve(newUtc.toString());
//     }
//   });
// };
