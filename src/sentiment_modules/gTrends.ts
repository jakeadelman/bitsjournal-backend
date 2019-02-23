const googleTrends = require("google-trends-api");

let startDate = new Date("2019-02-20T00:00:00.000");
let endDate = new Date("2019-02-21T00:00:00.000");
// console.log(theDate);

googleTrends
  .interestOverTime({
    keyword: "bitcoin",
    granularTimeResolution: true,
    startTime: startDate,
    endTime: endDate
  })
  .then(function(results) {
    console.log("These results are awesome", results);
  })
  .catch(function(err) {
    console.error("Oh no there was an error", err);
  });
