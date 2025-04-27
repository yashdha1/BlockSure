import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config(); 

export const redis = new Redis(process.env.UPSTASH_REDIS_URL);

redis.on('connect', () => {
  console.log('Redis is trying to connect SUCCESFULLY...');
});

redis.on('ready', () => {
  console.log('Redis connection established...');
});

redis.on('error', (err) => {
  console.error('Redis connection error...', err.message);
});

redis.on('end', () => {
  console.log('Redis connection closed...');
});