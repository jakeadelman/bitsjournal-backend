import { RegisterResolver } from "./modules/user/Register";
import { LoginResolver } from "./modules/user/Login";
import { MeResolver } from "./modules/user/Me";
import { ConfirmUserResolver } from "./modules/user/ConfirmUser";
import { ConfirmCardResolver } from "./modules/user/ConfirmCard";
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
  ConfirmCardResolver,
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
