const dateFormat = require("dateformat");

let theHour = dateFormat(new Date(), "yymmddHH");
console.log(theHour);

// 19022720, 1;
// 19022716, 2;
// 19022712, 3;
// 19022708, 4;
// 19022704, 5;
// 19022700, 6;
// 19022620, 7;
// 19022616;
