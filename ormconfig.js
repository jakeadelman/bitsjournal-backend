if (process.env.NODE_ENV === "production") {
  module.exports = {
    name: "default",
    type: "postgres",
    host: "bitsjournal-db-do-user-3307088-0.a.db.ondigitalocean.com",
    port: 25060,
    username: "doadmin",
    password: "xndvas26gehlgnn2",
    database: "newpool",
    extra: { ssl: true },
    ssl: {
      rejectUnauthorized: false
      // ca: "/etc/letsencrypt/live/sentwit.com/cert.pem"
    },
    synchronize: true,
    logging: true,
    entities: [
      "src/entity/*.*",
      "src/entity/instagram/*.*",
      "src/entity/sentiment/*.*"
    ]
  };
} else if (process.env.NODE_ENV === "development") {
  module.exports = {
    name: "default",
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "manx",
    password: "jakeadelman",
    database: "instagauge",
    synchronize: true,
    logging: true,
    entities: [
      "src/entity/*.*",
      "src/entity/instagram/*.*",
      "src/entity/sentiment/*.*"
    ]
  };
}
