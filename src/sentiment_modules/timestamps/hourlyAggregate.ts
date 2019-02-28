import { SearchTerm } from "../../entity/SearchTerm";
import { Tweet } from "../../../src/entity/Tweet";
import { FourHourSentiment } from "../../../src/entity/sentiment/FourHourSentiment";
import { createConns, createConn } from "../../modules/utils/connectionOptions";
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
    const connections = await createConns("hourly-agg");

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
      const connection = await createConn(`${term.term}-ok`);

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
              let newFourHourSent = new FourHourSentiment();
              newFourHourSent.hour = parseInt(array[0]);
              newFourHourSent.sentiment = parseFloat(r);
              newFourHourSent.term = term.term;
              await fourHourSentimentRepo.save(newFourHourSent);
              setTimeout(async function() {
                await connections[0].close();
                await connections[1].close();
                await connection.close();
              }, 4500);
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
