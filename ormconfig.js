if (process.env.NODE_ENV === "production") {
  module.exports = {
    name: "default",
    type: "postgres",
    host: "tradrr-psql-do-user-3307088-0.db.ondigitalocean.com",
    port: 25060,
    username: "doadmin",
    password: "i3px3pqqw3h11uh1",
    database: "defaultdb",
    ssl: { ca: "/etc/ssl/certs/ca-certificates.crt" },
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
