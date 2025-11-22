import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: './src/models/index.js',
    dialect: 'postgresql',
    dbCredentials: {
        host: process.env.DB_HOST || '0.0.0.0',
        port: Number(process.env.DB_PORT) || 7778,
        user: process.env.DB_USER || 'docker',
        password: process.env.DB_PASSWORD || 'docker',
        database: process.env.DB_NAME || 'temmulex',
        ssl: process.env.DB_SSL === 'true',
    },
    verbose: true,
    strict: true,
});
