import { genDatesList } from "./bitmexHelpers";

async function hello() {
  let list = await genDatesList();
  console.log(list);
}
hello();
