"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const googleTrends = require("google-trends-api");
exports.fetchGTrends = (startDate, endDate, currency) => {
    return new Promise((resolve, reject) => {
        console.log(startDate);
        console.log(endDate);
        googleTrends
            .interestOverTime({
            keyword: currency,
            granularTimeResolution: true,
            startTime: startDate,
            endTime: endDate
        })
            .then(function (results) {
            let res = JSON.parse(results);
            resolve(res.default.timelineData);
        })
            .catch(function (err) {
            console.error("Oh no there was an error", err);
            reject(err);
        });
    });
};
//# sourceMappingURL=gTrends.js.map