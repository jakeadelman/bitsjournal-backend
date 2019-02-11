import { PreformatTweetClass } from "./tweetClass";
import { Tweet } from "../entity/Tweet";
import { createConnection } from "typeorm";
const sentiment140 = require("sentiment140");
const chalk = require("chalk");
// const Sentiment = require("sentiment");
const fetch = require("node-fetch");

export const format = (subject: string) => {
  // format
  let subjStringified = JSON.stringify(subject);
  let subjParsed = JSON.parse(subjStringified);
  if (subjParsed[0]) {
    return subjParsed.toString();
  } else {
    return "null";
  }
};

export const checkTweet = (array: any[], repository: any) => {
  return new Promise((resolve, reject) => {
    console.log("in check tweet");
    let newRay: any[] = [];
    let count: number = 0;
    array.map(async (r: any) => {
      let id = await repository.findOne({
        tweetId: r.tweetId
      });
      if (typeof id == "undefined") {
        // console.log("was undefined");
        newRay.push(r);
        count += 1;
        // console.log(count, array.length);
        if (count == array.length) {
          console.log(
            chalk.green(`>> ${newRay.length} new tweets for term `) +
              chalk.underline.bold.blue(`${r.query}`)
          );
          resolve(newRay);
        }
      } else {
        count += 1;
        if (count == array.length && !!newRay[0]) {
          console.log(
            chalk.green(`>> ${newRay.length} new tweets for term `) +
              chalk.underline.bold.blue(`${r.query}`)
          );
          resolve(newRay);
        } else if (count == array.length && !newRay[0]) {
          reject(`no new tweets for term ` + chalk.green(`${r.query}`));
        }
      }
    });
  });
};

export const fetchSentiment = (
  array: any[],
  repository: any,
  email: string
) => {
  return new Promise((resolve, reject) => {
    console.log("in sentiment");
    let senti = new sentiment140({
      auth: email
    });
    let dat = { data: array };
    senti.sentiment(dat, async (error: any, result: any) => {
      if (result) {
        let reso = JSON.stringify(result);
        let resi = JSON.parse(reso);
        let count = 0;
        resi.map(async (r: PreformatTweetClass) => {
          const tweet = new Tweet();
          tweet.query = r.query;
          tweet.tweetId = r.tweetId;
          tweet.timestamp = r.timestamp;
          tweet.currHour = r.currHour;
          tweet.hour = r.hour;
          tweet.screenName = r.screenName;
          tweet.isPinned = r.isPinned;
          tweet.isRetweet = r.isRetweet;
          tweet.isReplyTo = r.isReplyTo;
          tweet.text = r.text;
          tweet.userMentions = r.userMentions;
          tweet.hashtags = r.hashtags;
          tweet.images = r.images;
          tweet.urls = r.urls;
          tweet.replyCount = r.replyCount;
          tweet.retweetCount = r.retweetCount;
          tweet.favoriteCount = r.favoriteCount;

          // save tweet
          await repository.save(tweet);
          count += 1;
          if (array.length == count) {
            resolve(
              `[` +
                chalk.green(`ADD`) +
                `]` +
                `: added ${array.length} tweets to database for` +
                chalk.underline.green(`${r.query}`)
            );
          }
        });
      } else if (error) {
        reject(new Error(`error retreiving sentiment data`));
      }
    });
  });
};

export const getSentiment = (array: any[]) => {
  return new Promise(resolve => {
    let dict = {};
    dict["data"] = array;
    // let count = 0

    fetch("http://127.0.0.1:5000/post", {
      method: "post",
      body: JSON.stringify(dict),
      headers: { "Content-Type": "application/json" }
    })
      .then((res: any) => res.json())
      .then(async (res: any) => {
        let entLo1 = __dirname + "/../entity/*.*";
        let entLo2 = __dirname + "/../entity/instagram/*.*";
        const newconn = await createConnection({
          name: "word0",
          type: "postgres",
          host: "instagauge.cmxxymh53lj2.us-east-1.rds.amazonaws.com",
          port: 5432,
          username: "manx",
          password: "jakeadelman",
          database: "instagauge",
          logging: false,
          entities: [entLo1, entLo2]
        });
        let twRepo = newconn.getRepository(Tweet);
        for (let i = 0; i < array.length; i++) {
          let r = res[i.toString()];
          let tweet = new Tweet();
          tweet.query = r.query;
          tweet.tweetId = r.tweetId;
          tweet.timestamp = r.timestamp;
          tweet.currHour = r.currHour;
          tweet.hour = r.hour;
          tweet.screenName = r.screenName;
          tweet.isPinned = r.isPinned;
          tweet.isRetweet = r.isRetweet;
          tweet.isReplyTo = r.isReplyTo;
          tweet.text = r.text;
          tweet.userMentions = r.userMentions;
          tweet.hashtags = r.hashtags;
          tweet.images = r.images;
          tweet.urls = r.urls;
          tweet.replyCount = r.replyCount;
          tweet.retweetCount = r.retweetCount;
          tweet.favoriteCount = r.favoriteCount;
          tweet.polarity = r.polarity;
          await twRepo.save(tweet);
          console.log(i + 1, array.length);
          if (i + 1 == array.length) {
            console.log(`saved ${array.length} new tweets`);
            await newconn.close();
            resolve(true);
          }
        }
      });

    // console.log(repository);
    // resolve(true);
  });
};

// export const getSentiment = (array: any[], repository: any) => {
//   return new Promise(resolve => {
//     let sentiment = new Sentiment();
//     let count = 0;
//     array.map(async (r: PreformatTweetClass) => {
//       const tweet = new Tweet();
//       tweet.query = r.query;
//       tweet.tweetId = r.tweetId;
//       tweet.timestamp = r.timestamp;
//       tweet.currHour = r.currHour;
//       tweet.hour = r.hour;
//       tweet.screenName = r.screenName;
//       tweet.isPinned = r.isPinned;
//       tweet.isRetweet = r.isRetweet;
//       tweet.isReplyTo = r.isReplyTo;
//       tweet.text = r.text;
//       tweet.userMentions = r.userMentions;
//       tweet.hashtags = r.hashtags;
//       tweet.images = r.images;
//       tweet.urls = r.urls;
//       tweet.replyCount = r.replyCount;
//       tweet.retweetCount = r.retweetCount;
//       tweet.favoriteCount = r.favoriteCount;
//       let result = sentiment.analyze(r.text);
//       tweet.score = result.score;
//       tweet.comparative = result.comparative.toString();
//       tweet.positiveWords = result.positive.toString();
//       tweet.negativeWords = result.negative.toString();

//       // save tweet
//       await repository.save(tweet);
//       count += 1;
//       if (array.length == count) {
//         resolve(
//           `[` +
//             chalk.green(`ADD`) +
//             `]` +
//             `: added ${array.length} tweets to database for term ` +
//             chalk.green(`${r.query}`)
//         );
//       } else {
//         return;
//       }
//     });
//   });
// };
