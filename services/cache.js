const redis = require('redis');

// const redisUrl = process.env.UPSTASH_REDIS_REST_URL || "redis://127.0.0.1:6379"
// const redisClient = redis.createClient ({
//     url : redisUrl
// });

const client = redis.createClient({
    url: 'redis://127.0.0.1:6379'
});

client.connect().then(() => {
    console.log('Redis connected!')
})
// redisClient.on("error", function(err) {
//     throw err;
// });

module.exports = client