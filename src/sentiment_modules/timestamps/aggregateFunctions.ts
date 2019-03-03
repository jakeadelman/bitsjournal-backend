import { Tweet } from "../../../src/entity/Tweet";
import { HourSentiment } from "../../../src/entity/sentiment/HourSentiment";

export const sendToDb = (
  begH: any,
  theHour: any,
  connection: any,
  term: any
) => {
  return new Promise(resolve => {
    getMinusH(begH, theHour)
      .then(async (endHour: any) => {
        console.log(endHour);
        let twRepo = connection.getRepository(Tweet);
        let allTweets = await twRepo.find({
          where: [{ query: term.term, hour: endHour }]
        });
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
            await hourSentimentRepo.save(newHourSentiment);
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

const getMinusH = (begH: boolean, theHour: string) => {
  return new Promise(resolve => {
    console.log(`starting hour is ${theHour} and is ${begH}`);
    let utcHour;
    let intHour = parseInt(theHour);
    let endNum = theHour[7];
    let secondEndNum = theHour[6];
    let concatStr = secondEndNum + endNum;
    let intEndHour = parseInt(concatStr);
    if (intEndHour > 20) {
      utcHour = intHour + 100 - 20;
      resolve(utcHour);
    } else {
      utcHour = intHour + 4;
      resolve(utcHour);
    }
  });
};

// const getMinusHours = (begH: boolean, theHour: string) => {
//   return new Promise(resolve => {
//     let theHourMinus1: string;
//     let theHourMinus2: string;
//     let theHourMinus3: string;
//     let theHourMinus4: string;

//     if (!begH) {
//       theHourMinus1 = (parseInt(theHour) - 1).toString();
//       theHourMinus2 = (parseInt(theHour) - 2).toString();
//       theHourMinus3 = (parseInt(theHour) - 3).toString();
//       theHourMinus4 = (parseInt(theHour) - 4).toString();
//       console.log("minus hours are " + [theHourMinus1, theHourMinus4]);
//       resolve([theHourMinus1, theHourMinus2, theHourMinus3, theHourMinus4]);
//     } else if (!!begH) {
//       theHourMinus1 = (parseInt(theHour) - 76).toString();
//       theHourMinus2 = (parseInt(theHour) - 77).toString();
//       theHourMinus3 = (parseInt(theHour) - 77).toString();
//       theHourMinus4 = (parseInt(theHour) - 78).toString();
//       console.log("minus hours are " + [theHourMinus1, theHourMinus4]);
//       resolve([theHourMinus1, theHourMinus2, theHourMinus3, theHourMinus4]);
//     }
//   });
// };

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
