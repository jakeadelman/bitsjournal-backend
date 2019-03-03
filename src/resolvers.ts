import { RegisterResolver } from "./modules/user/Register";
import { LoginResolver } from "./modules/user/Login";
import { MeResolver } from "./modules/user/Me";
import { ConfirmUserResolver } from "./modules/user/ConfirmUser";
import { FetchTweetResolver } from "./modules/tweet/getTweets";
import { AddSearchTermResolver } from "./modules/tweet/addSearchTerm";
import { GetDailyTweet } from "./modules/tweet/tweetByHour";
import { ConfirmCardResolver } from "./modules/user/ConfirmCard";
import { FourHourSentResolver } from "./modules/tweet/fourHourSent";
import { AddCurrencyResolver } from "./modules/tweet/addCurrency";
import { AddAdditionalTermResolver } from "./modules/tweet/addAdditionalTerm";

export const resolverArray = [
  RegisterResolver,
  LoginResolver,
  MeResolver,
  ConfirmUserResolver,
  FetchTweetResolver,
  AddSearchTermResolver,
  GetDailyTweet,
  ConfirmCardResolver,
  FourHourSentResolver,
  AddCurrencyResolver,
  AddAdditionalTermResolver
];
