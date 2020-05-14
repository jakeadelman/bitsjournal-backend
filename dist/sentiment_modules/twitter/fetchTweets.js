var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const twit = require("scrape-twitter");
const fetchTweets = () => {
    return new Promise(() => {
        let stream = new twit.TimelineStream("ai_thought_rt", {
            retweets: true,
            replies: false,
            count: 10
        });
        stream.on("error", err => {
            console.log(err);
        });
        stream.on("data", (data) => __awaiter(this, void 0, void 0, function* () {
            console.log(data);
        }));
        stream.on("end", () => __awaiter(this, void 0, void 0, function* () {
            console.log("the end");
        }));
    });
};
fetchTweets();
//# sourceMappingURL=fetchTweets.js.map