import { Tweet } from "../../../src/entity/Tweet";
import { FourHourSentiment } from "../../../src/entity/sentiment/FourHourSentiment";

export const sendToDb = (
  begH: any,
  theHour: any,
  connection: any,
  term: any
) => {
  return new Promise(resolve => {
    let count = 0;
    getMinusHours(begH, theHour)
      .then(async (array: any) => {
        let twRepo = connection.getRepository(Tweet);
        let allTweets = await twRepo.find({
          where: [
            { query: term.term, hour: array[0] },
            { query: term.term, hour: array[1] },
            { query: term.term, hour: array[2] },
            { query: term.term, hour: array[3] }
          ]
        });
        console.log(allTweets.length, count);
        mapAndGetSentiment(allTweets)
          .then(async (r: any) => {
            let fourHourSentimentRepo = connection.getRepository(
              FourHourSentiment
            );
            let newFourHourSent = new FourHourSentiment();
            newFourHourSent.hour = parseInt(array[0]);
            newFourHourSent.sentiment = parseFloat(r);
            newFourHourSent.term = term.term;
            await fourHourSentimentRepo.save(newFourHourSent);
            count += 1;
            if (count == allTweets.length) {
              resolve(true);
            }
          })
          .catch(async r => {
            console.log(r);
            count += 1;
            if (count == allTweets.length) {
              resolve(true);
            }
          });
      })
      .catch((err: any) => console.log(err, "error getting minus hours"));
  });
};

const getMinusHours = (begH: boolean, theHour: string) => {
  return new Promise(resolve => {
    let theHourMinus1: string;
    let theHourMinus2: string;
    let theHourMinus3: string;
    let theHourMinus4: string;

    if (!begH) {
      theHourMinus1 = (parseInt(theHour) - 1).toString();
      theHourMinus2 = (parseInt(theHour) - 2).toString();
      theHourMinus3 = (parseInt(theHour) - 3).toString();
      theHourMinus4 = (parseInt(theHour) - 4).toString();
      resolve([theHourMinus1, theHourMinus2, theHourMinus3, theHourMinus4]);
    } else if (!!begH) {
      theHourMinus1 = (parseInt(theHour) - 76).toString();
      theHourMinus2 = (parseInt(theHour) - 77).toString();
      theHourMinus3 = (parseInt(theHour) - 77).toString();
      theHourMinus4 = (parseInt(theHour) - 78).toString();
      resolve([theHourMinus1, theHourMinus2, theHourMinus3, theHourMinus4]);
    }
  });
};

const mapAndGetSentiment = (allTweets: any[]) => {
  return new Promise(resolve => {
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
      resolve(overallSentiment);
    }
  });
};
