import { LessThan, MoreThan } from "typeorm";
import { format } from "date-fns";

// TypeORM Query Operators
export const MoreThanDate = (date: Date) =>
  MoreThan(format(date, "YYYY-MM-DD HH:MM:SS"));
export const LessThanDate = (date: Date) =>
  LessThan(format(date, "YYYY-MM-DD HH:MM:SS"));
// ...
