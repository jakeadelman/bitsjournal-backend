"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Register_1 = require("./modules/user/Register");
const Login_1 = require("./modules/user/Login");
const Me_1 = require("./modules/user/Me");
const ConfirmUser_1 = require("./modules/user/ConfirmUser");
const getTweets_1 = require("./modules/tweet/getTweets");
const addSearchTerm_1 = require("./modules/tweet/addSearchTerm");
const tweetByHour_1 = require("./modules/tweet/tweetByHour");
const ConfirmCard_1 = require("./modules/user/ConfirmCard");
const fourHourSent_1 = require("./modules/tweet/fourHourSent");
const hourlySentiment_1 = require("./modules/tweet/hourlySentiment");
const addCurrency_1 = require("./modules/tweet/addCurrency");
const addAdditionalTerm_1 = require("./modules/tweet/addAdditionalTerm");
const allCurrencies_1 = require("./modules/tweet/allCurrencies");
const gtrends_1 = require("./modules/tweet/google_trends/gtrends");
const addApiKey_1 = require("./modules/bitmex/addApiKey");
const tradeHistory_1 = require("./modules/bitmex/tradeHistory");
const fiveMinuteCandles_1 = require("./modules/bitmex/fiveMinuteCandles");
const oneMinuteCandles_1 = require("./modules/bitmex/oneMinuteCandles");
const hourCandles_1 = require("./modules/bitmex/hourCandles");
const dayCandles_1 = require("./modules/bitmex/dayCandles");
const addNotes_1 = require("./modules/bitmex/addNotes");
const addHashtag_1 = require("./modules/bitmex/addHashtag");
const removeHashtag_1 = require("./modules/bitmex/removeHashtag");
const populate_1 = require("./modules/bitmex/populate");
const checkApiKey_1 = require("./modules/bitmex/checkApiKey");
exports.resolverArray = [
    Register_1.RegisterResolver,
    Login_1.LoginResolver,
    Me_1.MeResolver,
    ConfirmUser_1.ConfirmUserResolver,
    getTweets_1.FetchTweetResolver,
    addSearchTerm_1.AddSearchTermResolver,
    tweetByHour_1.GetDailyTweet,
    ConfirmCard_1.ConfirmCardResolver,
    fourHourSent_1.FourHourSentResolver,
    addCurrency_1.AddCurrencyResolver,
    addAdditionalTerm_1.AddAdditionalTermResolver,
    hourlySentiment_1.HourSentimentResolver,
    allCurrencies_1.AllCurrenciesResolver,
    gtrends_1.GoogleTrendsResolver,
    addApiKey_1.AddApiKeyResolver,
    tradeHistory_1.TradeHistoryResolver,
    populate_1.PopulateResolver,
    oneMinuteCandles_1.OneMinuteCandleHistoryResolver,
    fiveMinuteCandles_1.FiveMinuteCandleHistoryResolver,
    dayCandles_1.OneDayCandleHistoryResolver,
    hourCandles_1.OneHourCandleHistoryResolver,
    addNotes_1.AddNotesResolver,
    addHashtag_1.AddHashtagResolver,
    checkApiKey_1.CheckApiResolver,
    removeHashtag_1.RemoveHashtagResolver,
];
//# sourceMappingURL=resolvers.js.map