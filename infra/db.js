const pgPromise = require("pg-promise");

let dbInstance = null;

const initializeDB = async () => {
  try {
    const pgp = pgPromise({
      query(e) {
        console.log("\x1b[36m[QUERY] > \x1b[0m", e.query);
        if (e.params && e.params.length) {
          console.log("\x1b[33m[PARAMS] > \x1b[0m", e.params);
        }
      },
    });

    const connection = {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    };

    const db = pgp(connection);

    // Test connection
    await db.one("SELECT 1");
    console.log("\x1b[32m[DB CONNECTED]\x1b[0m Database connection successful.");

    dbInstance = db;
  } catch (err) {
    console.error("\x1b[31m[DB ERROR]\x1b[0m Failed to connect to the database.");
    console.error(err.message || err);
    process.exit(1);
  }
}

module.exports = {
  initializeDB,
  db: dbInstance,
}
