let USERNAMETOFIND;
let COMMENTTOFIND;

let postUrl =
  "https://www.instagram.com/p/BjU_XzGAQaW/?taken-by=kennethaharris";
// 1789333664312657558
// 15247386

let commentToFind = "Lmao I thought this was James and jaiden";
let usernameToFind = "izzybellah_";

var Client = require("instagram-private-api").V1;
const path = require("path");

const { urlSegmentToInstagramId } = require("instagram-id-to-url-segment");

let MediaComments;

function main(usernameToFind, commentToFind, postUrl) {
  return new Promise(async (resolve, reject) => {
    USERNAMETOFIND = usernameToFind;
    COMMENTTOFIND = commentToFind;
    console.log("at beginning");

    const Storage = new Client.CookieFileStorage(
      path.join(__dirname, "/cookies/test.json")
    );
    const Device = new Client.Device("test");

    const session = await Client.Session.create(
      Device,
      Storage,
      "momo_52_mo",
      "jakeadelman",
      null
    );

    let mediaId;

    const re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

    if (postUrl.match(re)) {
      mediaId = postUrl.split("/")[4];
      mediaId = urlSegmentToInstagramId(mediaId);
    } else return reject(new Error("Not a valid uri"));

    MediaComments = new Client.Feed.MediaComments(session, mediaId);

    loop(id => {
      if (id instanceof Error) reject(id);
      else resolve(id);
    });
  });
}

async function loop(cb) {
  const Comments = await get();

  if (!Comments) {
    // No more comments available
    cb(new Error("Could not find desired comment"));
  }

  const result = processIt(Comments);

  if (result) {
    return cb(result);
  }

  setTimeout(loop, 5000, cb);
}

async function get() {
  if (MediaComments.iteration == 0) {
    return await MediaComments.get();
  } else if (MediaComments.moreAvailable) {
    return await MediaComments.get();
  } else {
    return false;
  }
}

function processIt(Comments) {
  for (let idx = 0; idx < Comments.length; idx++) {
    if (Comments[idx]._params.user.username == USERNAMETOFIND) {
      if (Comments[idx]._params.text == COMMENTTOFIND) {
        return Comments[idx].id;
      }
    }
  }

  return false;
}

module.exports = main;
