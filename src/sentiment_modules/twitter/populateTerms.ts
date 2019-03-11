const CoinMarketCap = require("coinmarketcap-api");

const apiKey = "f097b3b3-ad3c-4c2a-9d74-62f545c249c0";
const client = new CoinMarketCap(apiKey);

client
  .getTickers()
  .then(console.log)
  .catch(console.error);
// client
//   .getGlobal()
//   .then(console.log)
//   .catch(console.error);
