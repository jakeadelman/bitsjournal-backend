import twit from "scrape-twitter";
import { Tweet } from "../entity/Tweet";
import { SearchTerm } from "../entity/SearchTerm";
import { PreformatTweetClass, SearchTermClass } from "./tweetClass";
import { createConnections } from "typeorm";

const dateFormat = require("dateformat");
const sentiment140 = require("sentiment140");

const getTweets = async (
  connections: any,
  word: string,
  by: string,
  email: string
) => {
  let senti = new sentiment140({
    auth: email
  });
  let arr: any[] = [];
  console.log(email);

  const tweetRepository = connections[1].getRepository(Tweet);
  // create stream
  const stream = new twit.TweetStream(word, by, { count: 50 });
  console.log("just made stream");

  stream.on("error", r => {
    console.log("got error");
    return `here is err: ${r}`;
  });

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
    // console.log("VARS BRUH");

    try {
      let r = await tweetRepository.findOne({
        tweetId: variables.tweetId
      });
      if (r) {
        console.log("was r ");
        return;
      }
    } catch {
      //   (arr as any).push(variables);
      console.log("caught you bro");
    }
  });

  stream.on(
    "end",
    (): boolean | undefined => {
      let dat0 = {};

      dat0["data"] = arr;
      console.log(arr.length, "THIS LENGTH");

      try {
        senti.sentiment(dat0, async function(error: any, result: any) {
          if (result) {
            let reso = JSON.stringify(result);
            let resi = JSON.parse(reso);
            let count = 0;
            console.log(result);

            resi.map(async (r: PreformatTweetClass) => {
              //   try {
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
              //   console.log(tweet);
              try {
                await tweetRepository.save(tweet);
                console.log("added tweet to db");
                count += 1;
                console.log(count, arr.length);
                if (arr.length == count) {
                  console.log("the end");
                }
                return true;
              } catch (err) {
                console.log("there was an err");
                return false;
              }
            });
            return true;
            //   } catch (err) {
            //     console.log("catch");
            //     return false;
            //   }
          } else if (error) {
            return false;
          } else {
            return false;
          }
        });
        console.log(`length was ${arr.length}`);
      } catch (err) {
        console.log(`length was ${arr.length}`);
        return false;
      }
      return false;
    }
  );
};

const wordListFetch = async () => {
  const connections = await createConnections([
    {
      name: "default",
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "manx",
      password: "jakeadelman",
      database: "senti-crypt",
      logging: false,
      entities: [__dirname + "/../entity/*.*"]
    },
    {
      name: "test2",
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "manx",
      password: "jakeadelman",
      database: "senti-crypt",
      logging: false,
      entities: [__dirname + "/../entity/*.*"]
    }
  ]);

  const searchTermRepository = connections[0].getRepository(SearchTerm);

  const emailList = ["jacobzadelman@gmail.com"];

  let r: SearchTermClass[] = await searchTermRepository.find({
    select: ["id", "term"]
  });

  //map and push
  r.map((r: SearchTermClass) => {
    getTweets(connections, r.term, "top", emailList[0]);
  });
  //   connections[0].close();
  //   connections[1].close();
};

setInterval(function() {
  wordListFetch();
}, 30000);
