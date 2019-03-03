import { Tweet } from "../../../src/entity/Tweet";
import { HourSentiment } from "../../../src/entity/sentiment/HourSentiment";
const dateFormat = require("dateformat");

export const sendToDb = (theHour: any, connection: any, term: any) => {
  return new Promise(resolve => {
    getMinusH(theHour)
      .then(async (endHour: string) => {
        console.log(endHour);
        let twRepo = connection.getRepository(Tweet);
        let allTweets = await twRepo.find({
          where: [{ query: term.term, hour: endHour }]
        });
        console.log(
          `found ${allTweets.length} tweets for ${term.term} from ${endHour}`
        );
        mapAndGetSentiment(allTweets)
          .then(async (r: any) => {
            let hourSentimentRepo = await connection.getRepository(
              HourSentiment
            );
            let newHourSentiment = new HourSentiment();
            newHourSentiment.hour = parseInt(endHour);
            newHourSentiment.sentiment = parseFloat(r);
            newHourSentiment.term = term.term;
            newHourSentiment.num_tweets = parseInt(allTweets.length);
            await hourSentimentRepo
              .save(newHourSentiment)
              .then(() => console.log("saved correctly"))
              .catch(() => {
                console.log("sentiment not saved");
              });
            let res = await connection
              .createQueryBuilder()
              .delete()
              .from(Tweet)
              .where("query = :query AND hour = :hour", {
                query: term.term,
                hour: endHour
              })
              .execute();

            console.log(res);
            resolve(true);
          })
          .catch(async r => {
            console.log(r);
            resolve(false);
          });
      })
      .catch((err: any) => console.log(err, "error getting minus hours"));
  });
};

const getMinusH = (theHour: string) => {
  return new Promise<string>(resolve => {
    console.log(`starting hour is ${theHour}`);
    let utcHour = dateFormat(new Date(), "UTC:yymmddHH");
    let utcHourString = utcHour.toString();
    let endTwoHours = utcHourString[6] + utcHourString[7];
    let newUtc;
    if (endTwoHours == "00") {
      newUtc = parseInt(utcHour) - 77;
      console.log(`ending hour is ${newUtc}`);
      resolve(newUtc.toString());
    } else {
      newUtc = parseInt(utcHour) - 1;
      console.log(`ending hour is ${newUtc}`);
      resolve(newUtc.toString());
    }
  });
};

const mapAndGetSentiment = (allTweets: any[]) => {
  return new Promise(resolve => {
    // console.log(allTweets);
    let total = 0;
    let sentiment = 0;
    let done = false;
    let overallSentiment;
    allTweets.map(tw => {
      if (parseInt(tw.polarity) == 4) {
        sentiment += 1;
        total += 1;
        if (total == allTweets.length) {
          overallSentiment = sentiment / total;
          done = true;
        }
      } else if (parseInt(tw.polarity) == 0) {
        total += 1;
        if (total == allTweets.length) {
          overallSentiment = sentiment / total;
          done = true;
        }
      }
    });
    if (!!done) {
      console.log("we are done bitch");
      console.log(`overall sentiment is ${overallSentiment}`);
      console.log(`number of tweets is ${allTweets.length}`);
      resolve(overallSentiment);
    }
  });
};
