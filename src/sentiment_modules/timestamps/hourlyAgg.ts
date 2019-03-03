import { SearchTerm } from "../../entity/SearchTerm";
import { createConns, createConn } from "../../modules/utils/connectionOptions";
import { sendToDb } from "./aggregateFunctions";

const chalk = require("chalk");
const dateFormat = require("dateformat");
const schedule = require("node-schedule");

// schedule job to run on first minute of every hour
schedule.scheduleJob("01 01 * * * *", async function() {
  // find out if hour is first hour of day
  // if true, we need to subtract more to get correct hour for aggregations
  let begH = false;
  let now = new Date();
  now = dateFormat(now, "HH");
  let theHour = dateFormat(new Date(), "yymmddHH");
  if (now.toString() == "00") {
    begH = true;
  }

  //create connections
  let connections = await createConns("hourly-agg");
  console.log(
    `[` + chalk.blue(`PG`) + `]:` + chalk.green(` opened connections`)
  );

  // find all terms in searchterm table
  let searchTermRepository = connections[0].getRepository(SearchTerm);
  let terms: any[] = await searchTermRepository.find({ select: ["term"] });

  // send each term to sentiment and db functions
  terms.map(async term => {
    console.log(`aggregating for ${term.term}`);
    const connection = await createConn(`${term.term}-ok`);
    sendToDb(begH, theHour, connection, term)
      .then(r => {
        console.log(r);
        connection.close();
      })
      .catch(r => {
        console.log(r);
        connection.close();
      });
  });

  //close connections at end
  setTimeout(async function() {
    await connections[0].close();
    await connections[1].close();
  }, 15000);
});
