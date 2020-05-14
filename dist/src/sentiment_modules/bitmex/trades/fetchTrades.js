var cron = require("node-cron");
console.log("started");
cron.schedule("*/5 * * * *", () => {
    console.log("running every minute 3,5");
    console.log(new Date());
});
//# sourceMappingURL=fetchTrades.js.map