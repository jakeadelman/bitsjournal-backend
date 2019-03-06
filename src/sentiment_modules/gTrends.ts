const googleTrends = require("google-trends-api");
// const dateF = require("dateformat");
// const addSubtractDate = require("add-subtract-date");

// let startDate = new Date("2019-02-20T00:00:00.000");
// let endDate = new Date();
// let startDate = new Date();
// startDate.setDate(startDate.getDate() - 1);
// console.log(startDate);
// let startDate = dateF(start, "isoUtcDateTime");

export const fetchGTrends = (startDate, endDate, currency) => {
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
      .then(function(results) {
        let res = JSON.parse(results);
        // console.log(res);
        resolve(res.default.timelineData);
        // console.log(res.default.timelineData.length);
        // res.default.timelineData.map(val => {
        //   // console.log(val.value);
        //   console.log(val);
        // });
      })
      .catch(function(err) {
        console.error("Oh no there was an error", err);
        reject(err);
      });
  });
};

// fetchGTrends(startDate, endDate).then(res => console.log(res));
