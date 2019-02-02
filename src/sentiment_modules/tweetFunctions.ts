import { PreformatTweetClass } from "./tweetClass";
import { Tweet } from "../entity/Tweet";
const sentiment140 = require("sentiment140");
const chalk = require("chalk");
const Sentiment = require("sentiment");

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
    let newRay: any[] = [];
    let count: number = 0;
    array.map(async (r: any) => {
      let id = await repository.findOne({
        tweetId: r.tweetId
      });
      if (typeof id == "undefined") {
        newRay.push(r);
        count += 1;
        if (count == 50) {
          console.log(
            chalk.green(`>> ${newRay.length} new tweets for term `) +
              chalk.underline.bold.blue(`${r.query}`)
          );
          resolve(newRay);
        }
      } else {
        count += 1;
        if (count == 50 && !!newRay[0]) {
          console.log(
            chalk.green(`>> ${newRay.length} new tweets for term `) +
              chalk.underline.bold.blue(`${r.query}`)
          );
          resolve(newRay);
        } else if (count == 50 && !newRay[0]) {
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

export const getSentiment = (array: any[], repository: any) => {
  return new Promise(resolve => {
    let sentiment = new Sentiment();
    let count = 0;
    array.map(async (r: PreformatTweetClass) => {
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
      let result = sentiment.analyze(r.text);
      tweet.score = result.score;
      tweet.comparative = result.comparative.toString();
      tweet.positiveWords = result.positive.toString();
      tweet.negativeWords = result.negative.toString();

      // save tweet
      await repository.save(tweet);
      count += 1;
      if (array.length == count) {
        resolve(
          `[` +
            chalk.green(`ADD`) +
            `]` +
            `: added ${array.length} tweets to database for term ` +
            chalk.green(`${r.query}`)
        );
      } else {
        return;
      }
    });
  });
};
