import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { initializeRedis } from './infra/redis.js';
import { initializeDB } from './infra/db.js';

await initializeRedis();
await initializeDB();

const app = express();

// import webhookRoute from './src/routes/webhooks.js';
// app.use('/webhooks', webhookRoute);

app.use(express.json());

const corsConfig = process.env.ENVIRONMENT?.toLowerCase() === 'production'

app.use(cors({
    origin: corsConfig ? process.env.CLIENT_URL : "*",
    credentials: corsConfig
}));

const port = process.env.PORT || 3001;

// import openRoutes from './src/routes/openRoutes.js';
// app.use('/v1', openRoutes);

import userRoutes from './src/routes/userRoutes.js';
app.use('/v1/users', userRoutes);

// import adminRoutes from './src/routes/adminRoutes.js';
// app.use('/api/admin', adminRoutes);

app.listen(port, () => console.log("Server Running On Port: ", port));
