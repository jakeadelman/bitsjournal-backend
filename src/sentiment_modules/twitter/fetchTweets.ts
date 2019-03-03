const twit = require("scrape-twitter");
const fetchTweets = () => {
  return new Promise(() => {
    let stream = new twit.ListStream("ai_thought_rt", "CT", { count: 10 });
    stream.on("error", err => {
      console.log(err);
    });
    stream.on("data", async data => {
      console.log(data);
    });
    stream.on("end", async () => {
      console.log("the end");
    });
  });
};

fetchTweets();

// NODE_ENV=development TWITTER_USERNAME=ai_thought_rt TWITTER_PASSWORD=jakeadelman yarn fetch-tweet-list
