import twit from "scrape-twitter";
import { Tweet } from "../entity/Tweet";
import { SearchTerm } from "../entity/SearchTerm";
import { createConnections } from "typeorm";
import { checkTweet, format, getSentiment } from "./tweetFunctions";
const dateFormat = require("dateformat");
const chalk = require("chalk");

const getTweets = (word: string, by: string, connections: any) => {
  return new Promise(async (resolve, reject) => {
    let arr: any[] = [];
    const tweetRepository = connections[1].getRepository(Tweet);

    // create stream
    const stream = new twit.TweetStream(word, by, { count: 50 });

    stream.on("error", (r: any) => {
      console.log("got error");
      return `here is err: ${r}`;
    });

    // test return
    stream.on("data", async (data: any) => {
      let daty = JSON.stringify(data);
      let dat = JSON.parse(daty);

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
      checkTweet(arr, tweetRepository)
        .then((r: any) => {
          return r;
        })
        .then((r: any[]) => {
          getSentiment(r, tweetRepository)
            .then(r => {
              resolve(r);
            })
            .catch(err => {
              reject(new Error(err));
            });
        })
        .catch((r: any) => {
          reject(chalk.red(`>> ${r}`));
        });
    });
  });
};

setInterval(async function() {
  const connections = await createConnections([
    {
      name: "default",
      type: "postgres",
      host: "instagauge.cmxxymh53lj2.us-east-1.rds.amazonaws.com",
      port: 5432,
      username: "manx",
      password: "jakeadelman",
      database: "instagauge",
      logging: false,
      entities: [__dirname + "/../entity/*.*"]
    },
    {
      name: "test2",
      type: "postgres",
      host: "instagauge.cmxxymh53lj2.us-east-1.rds.amazonaws.com",
      port: 5432,
      username: "manx",
      password: "jakeadelman",
      database: "instagauge",
      logging: false,
      entities: [__dirname + "/../entity/*.*"]
    }
  ]);
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
    getTweets(term.term, "top", connections)
      .then((r: any) => {
        console.log(r);
        count += 1;
        if (count == terms.length) {
          connections[1].close();
          connections[0].close();
          console.log(
            `[` + chalk.blue(`PG`) + `]:` + chalk.red(` closed connections`)
          );
        } else {
          return;
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
        } else {
          return;
        }
      });
  });
}, 60000);
