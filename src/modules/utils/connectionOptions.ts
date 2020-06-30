import { createConnection, Connection, createConnections } from "typeorm";

export const createConn = (name: string): Promise<Connection> => {
  return new Promise<Connection>(async (resolve, reject) => {
    if (process.env.NODE_ENV! === "production") {
      const connection: Connection = await createConnection({
        name: name,
        type: "postgres",
        host:
          "db-postgresql-tor1-31102-do-user-3307088-0.a.db.ondigitalocean.com",
        port: 25061,
        username: "doadmin",
        password: "n4g3a8kcay2rmu8c",
        database: "newpool",
        ssl: { rejectUnauthorized: false },
        logging: true,
        synchronize: false,
        entities: [
          __dirname + "/../../entity/*.*",
          __dirname + "/../../entity/instagram/*.*",
          __dirname + "/../../entity/sentiment/*.*",
        ],
      });
      console.log(`created connection ${name}`);
      resolve(connection);
    } else if (process.env.NODE_ENV! === "development") {
      const connection: Connection = await createConnection({
        name: name,
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "manx",
        password: "jakeadelman",
        database: "instagauge",
        logging: false,
        entities: [
          __dirname + "/../../entity/*.*",
          __dirname + "/../../entity/instagram/*.*",
          __dirname + "/../../entity/sentiment/*.*",
        ],
      });
      console.log(`created connection ${name}`);
      resolve(connection);
    } else {
      reject(new Error("env not known"));
    }
  });
};
export const createConns = (name: string): Promise<Connection[]> => {
  return new Promise<Connection[]>(async (resolve, reject) => {
    if (process.env.NODE_ENV! === "production") {
      const connections: Connection[] = await createConnections([
        {
          name: `${name}1`,
          type: "postgres",
          host:
            "db-postgresql-tor1-31102-do-user-3307088-0.a.db.ondigitalocean.com",
          port: 25061,
          username: "doadmin",
          password: "n4g3a8kcay2rmu8c",
          database: "newpool",
          ssl: { rejectUnauthorized: false },
          logging: true,
          synchronize: false,
          entities: [
            __dirname + "/../../entity/*.*",
            __dirname + "/../../entity/instagram/*.*",
            __dirname + "/../../entity/sentiment/*.*",
          ],
        },
        {
          name: `${name}2`,
          type: "postgres",
          host:
            "db-postgresql-tor1-31102-do-user-3307088-0.a.db.ondigitalocean.com",
          port: 25061,
          username: "doadmin",
          password: "n4g3a8kcay2rmu8c",
          database: "newpool",
          synchronize: false,
          ssl: { rejectUnauthorized: false },
          logging: true,
          entities: [
            __dirname + "/../../entity/*.*",
            __dirname + "/../../entity/instagram/*.*",
            __dirname + "/../../entity/sentiment/*.*",
          ],
        },
      ]);
      console.log(`created connections ${name}1 and ${name}2`);
      resolve(connections);
    } else if (process.env.NODE_ENV! === "development") {
      const connections: Connection[] = await createConnections([
        {
          name: `${name}1`,
          type: "postgres",
          host: "localhost",
          port: 5432,
          username: "manx",
          password: "jakeadelman",
          database: "instagauge",
          logging: false,
          entities: [
            __dirname + "/../../entity/*.*",
            __dirname + "/../../entity/instagram/*.*",
            __dirname + "/../../entity/sentiment/*.*",
          ],
        },
        {
          name: `${name}2`,
          type: "postgres",
          host: "localhost",
          port: 5432,
          username: "manx",
          password: "jakeadelman",
          database: "instagauge",
          logging: false,
          entities: [
            __dirname + "/../../entity/*.*",
            __dirname + "/../../entity/instagram/*.*",
            __dirname + "/../../entity/sentiment/*.*",
          ],
        },
      ]);
      console.log(`created connections ${name}1 and ${name}2`);
      resolve(connections);
    } else {
      reject(new Error("env not known"));
    }
  });
};
