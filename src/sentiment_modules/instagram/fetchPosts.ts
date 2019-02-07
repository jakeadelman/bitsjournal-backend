// import { User } from "../../entity/User";
// import { createConnection, Connection } from "typeorm";
// const chalk = require("chalk");
export const fetchDan = (
  //   connection: Connection,
  instaUser: string,
  instaUsername: string,
  instaPassword: string
) => {
  var Client = require("instagram-private-api").V1;
  var device = new Client.Device(instaUsername);
  var storage = new Client.CookieFileStorage(
    __dirname + `/cookies/${instaUsername}.json`
  );
  return new Promise(
    (resolve): any => {
      console.log("about to create session");
      Client.Session.create(device, storage, instaUsername, instaPassword)
        .then(function(session: any) {
          return [session, Client.Account.searchForUser(session, instaUser)];
        })
        .spread(async function(session, account) {
          var feed = new Client.Feed.UserMedia(session, account.id);
          var getty = feed.get();

          return [session, getty];
        })
        .spread((session, results) => {
          // results.map(async (res: any) => {
          // for (let i = 0; i < 4; i++) {
          let res = results[0];
          let id = res.id;
          // console.log(res.comments, "THIS RES");
          let comments = new Client.Feed.MediaComments(session, id);
          comments.get().then(r => console.log(r));
          resolve(true);
        });
    }
  );
};

const startMain = async () => {
  const user = "momo_52_mo";
  const pass = "jakeadelman";
  //   const connection = await createConnection({
  //     type: "postgres",
  //     host: "localhost",
  //     port: 5432,
  //     username: "manx",
  //     password: "jakeadelman",
  //     database: "danlok",
  //     entities: [__dirname + "/entity/*.*"]
  //   });
  let userList = ["danlok"];
  setInterval(function() {
    userList.map(instaUser => {
      fetchDan(instaUser, user, pass);
    });
  }, 6000);
};

startMain();
