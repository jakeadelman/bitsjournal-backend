const googleTrends = require("google-trends-api");
// const dateFormat = require("dateformat");

let startDate = new Date("2019-02-20T00:00:00.000");
let endDate = new Date();
endDate = dateFormat(endDate, "");
// console.log(theDate);

googleTrends
  .interestOverTime({
    keyword: "bitcoin",
    granularTimeResolution: true,
    startTime: startDate,
    endTime: endDate
  })
  .then(function(results) {
    let res = JSON.parse(results);
    // console.log(res.default.timelineData.length);
    res.default.timelineData.map(val => {
      // console.log(val.value);
      console.log(val);
    });
  })
  .catch(function(err) {
    console.error("Oh no there was an error", err);
  });
