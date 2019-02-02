export class PreformatTweetClass {
  query: string;
  tweetId: string;
  timestamp: string;
  currHour: string;
  hour: string;
  screenName: string;
  isPinned: boolean;
  isRetweet: boolean;
  isReplyTo: boolean;
  text: string;
  userMentions: string;
  hashtags: string;
  images: string;
  urls: string;
  replyCount: number;
  retweetCount: number;
  favoriteCount: number;
}

export class SearchTermClass {
  id: number;
  term: string;
}
