// import { PreformatTweetClass } from "./tweetClass";
import { Tweet } from "../entity/Tweet";
import { createConn } from "../modules/utils/connectionOptions";
const chalk = require("chalk");
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

export const checkTweet = (
  array: any[],
  repository: any,
  theTerms: string[]
) => {
  return new Promise((resolve, reject) => {
    console.log("in check tweet");
    let newRay: any[] = [];
    let count: number = 0;
    array.map(async (r: any) => {
      let isNotSpam = await checkSpam(r, repository, theTerms);
      if (isNotSpam == true) {
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

export const getSentiment = (array: any[]) => {
  return new Promise(resolve => {
    let dict = {};
    dict["data"] = array;
    // let count = 0
    console.log("about to fetch sentiment");

    fetch("http://127.0.0.1:5000/post", {
      method: "post",
      body: JSON.stringify(dict),
      headers: { "Content-Type": "application/json" }
    })
      .then((res: any) => res.json())
      .then(async (res: any) => {
        let newconn = await createConn(res[0].query);

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
          await twRepo
            .save(tweet)
            .catch(() => console.log("tweet may have already been added "));
          // console.log(i + 1, array.length);
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

export const checkNer = (array: any[]) => {
  return new Promise<any[] | boolean>(resolve => {
    let dict = {};
    dict["data"] = array;
    // let count = 0
    console.log("about to perform check2");

    fetch("http://127.0.0.1:5001/post", {
      method: "post",
      body: JSON.stringify(dict),
      headers: { "Content-Type": "application/json" }
    })
      .then((res: any) => res.json())
      .then(async (res: any) => {
        console.log(res);
        let i = 0;
        console.log(typeof res[i.toString()]);
        if (typeof res[i.toString()] == "undefined") {
          resolve(false);
        }
        let fullRay: any[] = [];
        let thisOne: any;
        let done = false;
        while (done == false) {
          if (typeof res[i.toString()] == "undefined") {
            console.log(fullRay);
            resolve(fullRay);
            done = true;
          } else {
            thisOne = res[i.toString()];
            fullRay.push(thisOne);
          }
        }

        // for (let r = 0; r < res.length; r++) {
        //   thisOne = res[r.toString()];
        //   fullRay.push(thisOne);
        //   if (r == res.length - 1) {
        //     resolve(fullRay);
        //   }
        // }
        // let newconn = await createConn(res[0].query);
        // resolve(res);

        // for (let i = 0; i < array.length; i++) {
        //   let r = res[i.toString()];
        //   console.log(r)

        //   // console.log(i + 1, array.length);
        //   if (i + 1 == array.length) {
        //     console.log(`saved ${array.length} new tweets`);
        //     await newconn.close();
        //     resolve(true);
        //   }
        // }
      });
  });
};

const checkSpam = (tweet: any, repository: any, theTerms: string[]) => {
  return new Promise(async resolve => {
    let id = await repository.findOne({
      tweetId: tweet.tweetId
    });

    if (typeof id !== "undefined") {
      resolve(false);
    }

    if (tweet.text.includes("https://") && tweet.favoriteCount < 2) {
      resolve(false);
    }

    if (tweet.text.includes("http://") && tweet.favoriteCount < 2) {
      resolve(false);
    }

    if (tweet.text.includes(".com") && tweet.favoriteCount < 2) {
      resolve(false);
    }

    if (tweet.text.includes(".ly") && tweet.favoriteCount < 2) {
      resolve(false);
    }

    let includes = await checkIncludes(tweet.text, theTerms);
    if (includes == false) {
      resolve(false);
    } else {
      resolve(true);
    }

    // resolve(true);
  });
};

const checkIncludes = (checkString, terms) => {
  return new Promise(resolve => {
    let string = checkString;
    for (let i = 0; i < terms.length; i++) {
      let ans = string.search(new RegExp(terms[i], "i"));
      if (ans !== -1) {
        resolve(true);
      }
      if (i == terms.length - 1) {
        resolve(false);
      }
    }
  });
};
