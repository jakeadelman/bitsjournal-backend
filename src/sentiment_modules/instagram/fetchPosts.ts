import { InstaUser } from "../../entity/instagram/instaUser";
import { createConnection } from "typeorm";
// import { removeEmojis } from "./removeEmojis";
// const chalk = require("chalk");
export const fetchDan = (
  // connection: Connection,
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
        .spread(async (session, results) => {
          // results.map(async (res: any) => {
          // for (let i = 0; i < 4; i++) {
          let res = results[0];
          let id = res.id;
          // console.log(res.comments, "THIS RES");
          let comments = new Client.Feed.MediaComments(session, id);
          comments.iteration = 2;
          // console.log(comments.keys());
          // let newcoms = await comments.get();
          // console.log(newcoms[0].keys());
          // console.log(newcoms);
          comments.get().then(r => {
            r.map(comm => {
              console.log(comm);
              // removeEmojis(comm._params.text).then(r => {
              //   console.log(r);
              // });
            });
          });
          // console.log(connection);
          resolve(true);
        });
    }
  );
};

const startMain = async () => {
  const user = "momo_52_mo";
  const pass = "jakeadelman";
  let entLo1 = __dirname + "/../../entity/*.*";
  let entLo2 = __dirname + "/../../entity/instagram/*.*";
  const connection = await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "manx",
    password: "jakeadelman",
    database: "instagauge",
    entities: [entLo1, entLo2]
  });
  let instaUserRepo = await connection.getRepository(InstaUser);
  let instaUserList = await instaUserRepo.find({ select: ["name"] });
  // let userList = ["danlok"];
  let mappedList: any[] = await mapToList(instaUserList);
  console.log(mappedList);
  setInterval(function() {
    mappedList.map(instaUser => {
      fetchDan(instaUser, user, pass);
    });
  }, 10000);
  // console.log(instaUserList[0].name);
};

const mapToList = list => {
  return new Promise<any>(resolve => {
    let arr: any[] = [];
    list.map(u => {
      arr.push(u.name);
    });
    resolve(arr);
  });
};

startMain();
