import twit from "scrape-twitter";
const dateFormat = require("dateformat");
const sentiment140 = require("sentiment140");
import { Tweet } from "../entity/Tweet";
// const fetch = require("node-fetch");

export const getTweets = (word, by, email) => {
  return new Promise((resolve, reject) => {
    let senti = new sentiment140({
      auth: email
    });
    let arr: any[] = [];

    // create stream
    const stream = new twit.TweetStream(word, by, { count: 50 });
    stream.on("error", reject);
    // test return
    stream.on("data", async data => {
      let daty = JSON.stringify(data);
      let dat = JSON.parse(daty);

      // format userMentions
      let userMentions = JSON.stringify(dat.userMentions);
      let userMentionsParse = JSON.parse(userMentions);
      if (userMentionsParse[0]) {
        userMentions = userMentions.toString();
      } else {
        userMentions = "null";
      }

      // format hashtags
      let hashtags = JSON.stringify(dat.hashtags);
      let hashtagsParse = JSON.parse(hashtags);
      if (hashtagsParse[0]) {
        hashtags = hashtags.toString();
      } else {
        hashtags = "null";
      }

      // format imgs
      let images = JSON.stringify(dat.images);
      let imagesParse = JSON.parse(images);
      if (imagesParse[0]) {
        images = images.toString();
      } else {
        images = "null";
      }

      // format urls
      let urls = JSON.stringify(dat.urls);
      let urlsParse = JSON.parse(urls);
      if (urlsParse[0]) {
        urls = urls.toString();
      } else {
        urls = "null";
      }

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

      const isTweet = Tweet.findOne({ tweetId: variables.tweetId });
      if (isTweet) {
        console.log("tweet already in db");
        return null;
      } else {
        return (arr as any).push(variables);
      }
    });

    stream.on("end", () => {
      let dat0 = {};
      dat0["data"] = arr;

      try {
        senti.sentiment(dat0, function(error, result) {
          if (result) {
            let reso = JSON.stringify(result);
            let resi = JSON.parse(reso);
            resi.map(async r => {
              const tweet = new Tweet();
              tweet.query = r.query;
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
              console.log("adding tweet in db");
              await tweet.save();
            });
            resolve(true);
          } else if (error) {
            reject(new Error("there was err"));
          } else {
            reject(new Error("error fetching sentiment data"));
          }
        });
      } catch (err) {
        reject(new Error("there was err"));
      }
    });
  });
};

getTweets("bitcoin", "top", "jacobzadelman@gmail.com").then(r =>
  console.log(r)
);
