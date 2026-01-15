import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from '../src/models/index.js';

let dbInstance = null;

const initializeDB = async () => {
	try {
		const pool = new Pool({
			host: process.env.DB_HOST,
			database: process.env.DB_NAME,
			username: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			ssl: 'require',
		});

		dbInstance = drizzle(pool, {
			schema,
			logger: {
				logQuery: (query, params) => {
					console.log("\x1b[36m[QUERY] > \x1b[0m", query);
					if (params && params?.length) {
						console.log("\x1b[33m[PARAMS] > \x1b[0m", params);
					}
				},
			},
		});
		await pool.query("SELECT 1;");
		console.log("\x1b[32m[DB CONNECTED]\x1b[0m Database connection successful.");
	} catch (error) {
		console.error("\x1b[31m[DB ERROR]\x1b[0m Failed to connect to the database. \x1b[30m[ERROR MESSAGE]\x1b[0m", error.message || error);
		process.exit(1);
	}
}

export {
	initializeDB,
	dbInstance as db,
}
