import { createConnections, createConnection } from "typeorm";
import { SearchTerm } from "../../entity/SearchTerm";
import { Tweet } from "../../../src/entity/Tweet";
import { FourHourSentiment } from "../../../src/entity/sentiment/FourHourSentiment";
const chalk = require("chalk");
const dateFormat = require("dateformat");

setInterval(async function() {
  let now = new Date();
  now = dateFormat(now, "HHMM");
  let theHour = dateFormat(new Date(), "yymmddHH");

  let theGoodHours = ["0401", "0801", "1201", "1601", "2001", "0001"];
  let yesOrNo = false;
  let begH = false;
  theGoodHours.map(hour => {
    if (hour == now.toString() && hour == "0001") {
      yesOrNo = true;
      begH = true;
    } else if (hour == now.toString()) {
      yesOrNo = true;
    }
  });
  if (!!yesOrNo) {
    let entLo1 = __dirname + "/../../entity/*.*";
    let entLo2 = __dirname + "/../../entity/instagram/*.*";
    let entLo3 = __dirname + "/../../entity/sentiment/*.*";
    const connections = await createConnections([
      {
        name: "hourly-agg-1",
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "manx",
        password: "jakeadelman",
        database: "instagauge",
        logging: false,
        entities: [entLo1, entLo2]
      },
      {
        name: "hourly-agg-2",
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "manx",
        password: "jakeadelman",
        database: "instagauge",
        logging: false,
        entities: [entLo1, entLo2]
      }
    ]);
    console.log(
      `[` + chalk.blue(`PG`) + `]:` + chalk.green(` opened connections`)
    );
    let searchTermRepository = connections[0].getRepository(SearchTerm);
    let terms: any[] = await searchTermRepository.find({ select: ["term"] });

    terms.map(async term => {
      console.log(
        `[` +
          chalk.green(`AGG`) +
          `]` +
          `: aggregating for term ` +
          chalk.underline.bold.green(`${term.term}`)
      );
      const connection = await createConnection({
        name: term.term + "the",
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "manx",
        password: "jakeadelman",
        database: "instagauge",
        logging: false,
        entities: [entLo1, entLo2, entLo3]
      });

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
          console.log(allTweets.length);
          mapAndGetSentiment(allTweets)
            .then(async (r: any) => {
              let fourHourSentimentRepo = connection.getRepository(
                FourHourSentiment
              );

              // let theTerm = await searchTermRepository.findOne({
              //   where: { term: term.term }
              // });
              // console.log(theTerm);
              // if (!!theTerm) {
              let newFourHourSent = new FourHourSentiment();
              newFourHourSent.hour = parseInt(array[0]);
              newFourHourSent.sentiment = parseFloat(r);
              newFourHourSent.term = term.term;
              await fourHourSentimentRepo.save(newFourHourSent);
              setTimeout(async function() {
                await connections[0].close();
                await connections[1].close();
                await connection.close();
              }, 7500);
              // } else {
              // console.log("no fucking term bro..");
              // setTimeout(async function() {
              //   await connections[0].close();
              //   await connections[1].close();
              //   await connection.close();
              // }, 3500);
              // }
            })
            .catch(async r => {
              connections[0].close();
              connections[1].close();
              connection.close();
              console.log(r);
            });
        })
        .catch((err: any) => console.log(err, "error getting minus hours"));

      //   allTweets.map(tw => {});
    });
  } else {
    console.log("not 01");

    return;
  }
}, 59000);

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
