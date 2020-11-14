import 'dotenv/config.js';

export default {
  mongoUri: process.env.MONGO_URI,
  secret: process.env.SECRET,
  port: process.env.PORT,
};
