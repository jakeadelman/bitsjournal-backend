"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const date_fns_1 = require("date-fns");
exports.MoreThanDate = (date) => typeorm_1.MoreThan(date_fns_1.format(date, "YYYY-MM-DD HH:MM:SS"));
exports.LessThanDate = (date) => typeorm_1.LessThan(date_fns_1.format(date, "YYYY-MM-DD HH:MM:SS"));
//# sourceMappingURL=helpers.js.map