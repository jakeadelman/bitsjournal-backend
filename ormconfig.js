if (process.env.NODE_ENV === "production") {
  console.log("CONNECTING TO REMOTE PRODUCTION DB");
  module.exports = {
    name: "default",
    type: "postgres",
    host: "db-postgresql-tor1-31102-do-user-3307088-0.a.db.ondigitalocean.com",
    port: 25060,
    username: "doadmin",
    password: "n4g3a8kcay2rmu8c",
    database: "defaultdb",
    extra: { ssl: true },
    ssl: {
      rejectUnauthorized: false,
      // ca: "/etc/letsencrypt/live/sentwit.com/cert.pem"
    },
    synchronize: true,
    logging: true,
    entities: [
      "dist/entity/*.*",
      "dist/entity/instagram/*.*",
      "dist/entity/sentiment/*.*",
    ],
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
      "src/entity/sentiment/*.*",
    ],
  };
}
