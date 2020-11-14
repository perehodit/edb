import { errors, errorsMongoose } from './errors.js';
import bodyparser from './bodyparser.js';
import serve from './serve.js';

const middlewares = [bodyparser, errors, errorsMongoose, serve];

export default middlewares;
