import { SearchTerm } from "../../entity/SearchTerm";

import { createConns, createConn } from "../../modules/utils/connectionOptions";
import { sendToDb } from "./aggregateFunctions";

const chalk = require("chalk");
const dateFormat = require("dateformat");

setInterval(async function() {
  let now = new Date();
  now = dateFormat(now, "HHMM");
  let theHour = dateFormat(new Date(), "yymmddHH");

  let theGoodHours = [
    "0401",
    "0801",
    "1201",
    "1601",
    "1901",
    "2401",
    "0101",
    "0201",
    "0301",
    "2001",
    "0001"
  ];
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
    // let count = 0;
    // console.log(count, terms.length);

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

    setTimeout(async function() {
      await connections[0].close();
      await connections[1].close();
    }, 15000);
  } else {
    console.log("not 01");
  }
}, 24000);
