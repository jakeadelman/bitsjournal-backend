import { RegisterResolver } from "./modules/user/Register";
import { LoginResolver } from "./modules/user/Login";
import { MeResolver } from "./modules/user/Me";
import { ConfirmUserResolver } from "./modules/user/ConfirmUser";
import { FetchTweetResolver } from "./modules/tweet/getTweets";
import { AddSearchTermResolver } from "./modules/tweet/addSearchTerm";
import { GetDailyTweet } from "./modules/tweet/tweetByHour";
import { ConfirmCardResolver } from "./modules/user/ConfirmCard";
import { FourHourSentResolver } from "./modules/tweet/fourHourSent";
import { HourSentimentResolver } from "./modules/tweet/hourlySentiment";
import { AddCurrencyResolver } from "./modules/tweet/addCurrency";
import { AddAdditionalTermResolver } from "./modules/tweet/addAdditionalTerm";
import { AllCurrenciesResolver } from "./modules/tweet/allCurrencies";
import { GoogleTrendsResolver } from "./modules/tweet/google_trends/gtrends";
import { AddApiKeyResolver } from "./modules/bitmex/addApiKey";
import { TradeHistoryResolver } from "./modules/bitmex/tradeHistory";
import { FiveMinuteCandleHistoryResolver } from "./modules/bitmex/fiveMinuteCandles";
import { OneMinuteCandleHistoryResolver } from "./modules/bitmex/oneMinuteCandles";
import { OneHourCandleHistoryResolver } from "./modules/bitmex/hourCandles";
import { OneDayCandleHistoryResolver } from "./modules/bitmex/dayCandles";
import { AddNotesResolver } from "./modules/bitmex/addNotes";
import { AddHashtagResolver } from "./modules/bitmex/addHashtag";
import { RemoveHashtagResolver } from "./modules/bitmex/removeHashtag";
import { PopulateResolver } from "./modules/bitmex/populate";
import { CheckApiResolver } from "./modules/bitmex/checkApiKey";

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
  AddAdditionalTermResolver,
  HourSentimentResolver,
  AllCurrenciesResolver,
  GoogleTrendsResolver,
  AddApiKeyResolver,
  TradeHistoryResolver,
  PopulateResolver,
  OneMinuteCandleHistoryResolver,
  FiveMinuteCandleHistoryResolver,
  OneDayCandleHistoryResolver,
  OneHourCandleHistoryResolver,
  AddNotesResolver,
  AddHashtagResolver,
  CheckApiResolver,
  RemoveHashtagResolver,
];
