const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { initializeRedis } = require('./infra/redis');
const { initializeDB } = require('./infra/db');

await initializeRedis();
await initializeDB();

const app = express();

const webhookRoute = require('./src/routes/webhooks');
app.use('/webhooks', webhookRoute);

app.use(express.json());

const corsConfig = process.env.ENVIRONMENT?.toLowerCase() === 'production'

app.use(cors({
    origin: corsConfig ? process.env.CLIENT_URL : "*",
    credentials: corsConfig
}));

const port = process.env.PORT || 3001;

const openRoutes = require('./src/routes/openRoutes');
app.use('/v1', openRoutes);

const userRoutes = require('./src/routes/userRoutes');
app.use('/v1/users', userRoutes);

const adminRoutes = require('./src/routes/adminRoutes');
app.use('/api/admin', adminRoutes);

app.listen(port, () => console.log("Server Running On Port: ", port));
