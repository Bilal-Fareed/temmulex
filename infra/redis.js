import Redis from 'ioredis';

const redisClient = { instance: null };

const initializeRedis = async () => {
    try {
        const redisInstance = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: Number(process.env.REDIS_PORT || 6379),
            password: process.env.REDIS_PASSWORD || undefined,
            maxRetriesPerRequest: process.env.REDIS_MAX_RETRIES || null,
        });

        // Log runtime errors (e.g., Redis server crashes after initial connection)
        redisInstance.on('error', (error) => {
            console.error('\x1b[31m[REDIS RUNTIME ERROR]\x1b[0m', error.message || error);
        });

        redisInstance.on('end', () => {
            console.warn('\x1b[33m[REDIS DISCONNECTED]\x1b[0m Redis connection closed.');
        });

        redisInstance.on('reconnecting', () => {
            console.info('\x1b[34m[REDIS RECONNECTING]\x1b[0m Attempting to reconnect to Redis...');
        });

        // Test connection
        await redisInstance.ping();
        redisClient.instance = redisInstance;
        console.log('\x1b[32m[REDIS CONNECTED]\x1b[0m Redis connection successful.');
    } catch (error) {
        console.error('\x1b[31m[REDIS ERROR]\x1b[0m Failed to connect to Redis.');
        console.error(error.message || error);
        process.exit(1);
    }
}

export {
    initializeRedis,
    redisClient
}