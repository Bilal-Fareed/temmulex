import http from "http";
import "dotenv/config";
import cors from "cors";
import express from "express";
import { initializeDB } from "./infra/db.js";
import { SocketServer } from "./socketServer.js";
import { initializeRedis } from "./infra/redis.js";
import { initializeMailer } from './src/helpers/mailer.js';

await initializeRedis();
await initializeDB();
if (process.env.ENVIRONMENT?.toLowerCase() === 'production') await initializeMailer();

const server = express();
const _server = http.createServer(server);
await SocketServer(_server);

// import webhookRoute from "./src/routes/webhooks.js";
// server.use("/webhooks", webhookRoute);

server.use(express.json());
const corsConfig = process.env.ENVIRONMENT?.toLowerCase() === "production"

server.use(cors({
    origin: corsConfig ? process.env.CLIENT_URL : "*",
    credentials: corsConfig
}));

const port = process.env.PORT || 3001;

// import openRoutes from "./src/routes/openRoutes.js";
// server.use("/v1", openRoutes);

import userRoutes from "./src/routes/userRoutes.js";
server.use("/v1/users", userRoutes);

// import adminRoutes from "./src/routes/adminRoutes.js";
// server.use("/api/admin", adminRoutes);

_server.listen(port, () => console.log("Server Running On Port: ", port));
