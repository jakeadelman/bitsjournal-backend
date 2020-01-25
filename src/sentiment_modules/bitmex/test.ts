export function newDate() {
  let dt: any = new Date(new Date().toUTCString());
  dt = dt.toISOString();
  console.log(dt);
}
newDate();
