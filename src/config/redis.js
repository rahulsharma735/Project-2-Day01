const { createClient } = require('redis');

// import { createClient } from 'redis';

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-15755.crce206.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 15755
    }
});

module.exports = redisClient;

