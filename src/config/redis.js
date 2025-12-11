const { createClient } = require('redis');

// import { createClient } from 'redis';

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-19524.crce263.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 19524
    }
});

module.exports = redisClient;