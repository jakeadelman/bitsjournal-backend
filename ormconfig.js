if (process.env.NODE_ENV === "production") {
  module.exports = {
    name: "default",
    type: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false },
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
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [
      "src/entity/*.*",
      "src/entity/instagram/*.*",
      "src/entity/sentiment/*.*"
    ]
  };
}
