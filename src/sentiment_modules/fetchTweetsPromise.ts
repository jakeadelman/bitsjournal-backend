import twit from "scrape-twitter";
import { Tweet } from "../entity/Tweet";
import { SearchTerm } from "../entity/SearchTerm";
import { Currency } from "../entity/Currency";
import { checkTweet, format, getSentiment } from "./tweetFunctions";
import { createConns } from "../modules/utils/connectionOptions";

// const schedule = require("node-schedule");
const dateFormat = require("dateformat");
const chalk = require("chalk");

const getTweets = (word: string, by: string, searchTermRepository: any) => {
  return new Promise(async (resolve, reject) => {
    let arr: any[] = [];
    let st = word + " lang:en";
    // create stream
    const stream = new twit.TweetStream(st, by, { count: 50 });
    let conns = await createConns(word);
    const tweetRepository = conns[0].getRepository(Tweet);

    stream.on("error", (r: any) => {
      console.log("got error");
      return `here is err: ${r}`;
    });

    // test return
    stream.on("data", async (data: any) => {
      let daty = JSON.stringify(data);
      let dat = JSON.parse(daty);
      console.log(data);

      // format
      let userMentions = format(dat.userMentions);
      let hashtags = format(dat.hashtags);
      let images = format(dat.images);
      let urls = format(dat.urls);

      //get current time and format to hour
      let now = new Date();
      let currHour = dateFormat(now, "yymmddHH");

      // format hour
      let concatHour = dat.time;
      let str1 = concatHour.substring(2, 4);
      let str2 = concatHour.substring(5, 7);
      let str3 = concatHour.substring(8, 10);
      let str4 = concatHour.substring(11, 13);
      concatHour = str1 + str2 + str3 + str4;

      const variables = {
        tweetId: dat.id,
        query: word,
        timestamp: dat.time,
        currHour: currHour,
        hour: concatHour,
        screenName: dat.screenName,
        isRetweet: dat.isRetweet,
        isPinned: dat.isPinned,
        isReplyTo: dat.isReplyTo,
        text: dat.text,
        userMentions: userMentions,
        hashtags: hashtags,
        images: images,
        urls: urls,
        replyCount: parseInt(dat.replyCount),
        retweetCount: parseInt(dat.retweetCount),
        favoriteCount: parseInt(dat.favoriteCount)
      };
      arr.push(variables);
    });

    stream.on("end", async () => {
      console.log(`found ${arr.length} tweets for ${word}`);
      if (arr.length == 0) {
        await conns[0].close();
        await conns[1].close();
        reject("no new tweets");
      } else {
        let theTerm = await searchTermRepository.findOne({
          where: { term: word },
          relations: ["currency"]
        });
        let currRepo = await conns[0].getRepository(Currency);
        let curr = await currRepo.findOne({
          where: { name: theTerm.currency.name },
          relations: ["terms"]
        });
        let terms: any[] = [];
        for (let r = 0; r < curr!.terms.length; r++) {
          terms.push(curr!.terms[r].term);
        }
        if (curr && curr.additional_terms) {
          for (let i = 0; i < curr.additional_terms.length; i++) {
            terms.push(curr.additional_terms[i]);
          }
        }
        checkTweet(arr, tweetRepository, terms)
          .then(async (r: any) => {
            // let ans = await checkNer(r);
            // if (typeof ans == "boolean") {
            //   reject("no new tweets for " + arr[0].query);
            // }
            // console.log(ans);
            return r;
          })
          .then((r: any) => {
            getSentiment(r)
              .then(async r => {
                await conns[0].close();
                await conns[1].close();
                resolve(r);
              })
              .catch(async err => {
                await conns[0].close();
                await conns[1].close();
                reject(new Error(err));
              });
          })
          .catch(async (r: any) => {
            await conns[0].close();
            await conns[1].close();
            reject(chalk.red(`>> ${r}`));
          });
      }
    });
  });
};

setInterval(async function() {
  // schedule.scheduleJob("09 * * * * *", async function() {
  let connections = await createConns("fetchtws");
  console.log(
    `[` + chalk.blue(`PG`) + `]:` + chalk.green(` opened connections`)
  );
  let searchTermRepository = connections[0].getRepository(SearchTerm);
  let terms: any[] = await searchTermRepository.find({ select: ["term"] });
  let count = 0;

  terms.map(term => {
    console.log(
      `[` +
        chalk.green(`FETCH`) +
        `]` +
        `: fetching tweets for term ` +
        chalk.underline.bold.green(`${term.term}`)
    );
    getTweets(term.term, "latest", searchTermRepository)
      .then((r: any) => {
        console.log(r);
        count += 1;
        if (count == terms.length) {
          connections[1].close();
          connections[0].close();
          console.log(
            `[` + chalk.blue(`PG`) + `]:` + chalk.red(` closed connections`)
          );
        }
      })
      .catch((r: any) => {
        count += 1;
        console.log(`${r}`);
        if (count == terms.length) {
          connections[1].close();
          connections[0].close();
          console.log(
            `[` + chalk.blue(`PG`) + `]:` + chalk.red(` closed connections`)
          );
        }
      });
  });
}, 3000);
// });
