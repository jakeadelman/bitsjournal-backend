"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const scrape_twitter_1 = __importDefault(require("scrape-twitter"));
require("dotenv").config();
const getTweets = () => {
    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
        console.log("at beginning");
        const stream = new scrape_twitter_1.default.TimelineStream("mjackson", {
            retweets: true,
            replies: true,
            count: 10
        });
        stream.on("error", (r) => {
            console.log(`got err ${r}`);
            return `here is err: ${r}`;
        });
        stream.on("data", (data) => __awaiter(this, void 0, void 0, function* () {
            console.log(data);
        }));
        stream.on("end", () => __awaiter(this, void 0, void 0, function* () {
            resolve(true);
        }));
    }));
};
getTweets();
//# sourceMappingURL=userTweetFetch.js.map