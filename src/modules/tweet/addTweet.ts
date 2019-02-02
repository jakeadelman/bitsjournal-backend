// import { Resolver, Mutation, Arg } from "type-graphql";

// import { Tweet } from "../../entity/Tweet";

// @Resolver()
// export class AddTweetResolver {
//   @Mutation(() => Boolean)
//   async addTweet(
//     @Arg("query") query: string,
//     @Arg("tweetId") tweetId: number,
//     @Arg("timestamp") timestamp: string,
//     @Arg("currHour") currHour: string,
//     @Arg("hour") hour: string,
//     @Arg("screenName") screenName: string,
//     @Arg("isPinned") isPinned: boolean,
//     @Arg("isRetweet") isRetweet: boolean,
//     @Arg("isReplyTo") isReplyTo: boolean,
//     @Arg("text") text: string,
//     @Arg("userMentions") userMentions: string,
//     @Arg("hashtags") hashtags: string,
//     @Arg("images") images: string,
//     @Arg("urls") urls: string,
//     @Arg("replyCount") replyCount: number,
//     @Arg("retweetCount") retweetCount: number,
//     @Arg("favoriteCount") favoriteCount: number
//   ): Promise<null | boolean> {
//     const tweet = new Tweet();

//     tweet.query = query;
//     tweet.tweetId = tweetId;
//     tweet.timestamp = timestamp;
//     tweet.currHour = currHour;
//     tweet.hour = hour;
//     tweet.screenName = screenName;
//     tweet.isPinned = isPinned;
//     tweet.isRetweet = isRetweet;
//     tweet.isReplyTo = isReplyTo;
//     tweet.text = text;
//     tweet.userMentions = userMentions;
//     tweet.hashtags = hashtags;
//     tweet.images = images;
//     tweet.urls = urls;
//     tweet.replyCount = replyCount;
//     tweet.retweetCount = retweetCount;
//     tweet.favoriteCount = favoriteCount;

//     await tweet.save();

//     return true;
//   }
// }
