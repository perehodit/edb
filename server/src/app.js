import Koa from 'koa';
import router from './router/index.js';
import middlewares from './middlewares/index.js';
import config from './config.js';
import mongoose from 'mongoose';

class App {
  constructor(config, router, middlewares) {
    this.app = new Koa();
    this.config = config;
    this.router = router;
    this.middlewares = middlewares;
  }

  setupMiddlewares() {
    this.middlewares.forEach(m => {
      this.app.use(m);
    });
  }

  setupRouter() {
    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());
  }

  startListening() {
    this.app.listen(this.config.port, () => {
      console.log(`Server running on port: ${this.config.port}`);
    });
  }

  connectToDatabase() {
    mongoose
      .connect(this.config.mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
      .then(() => console.log('MongoDB has been connected'))
      .catch(error => console.log(error.message));
  }

  start() {
    this.setupMiddlewares();
    this.setupRouter();
    this.startListening();
    this.connectToDatabase();
  }
}

export default new App(config, router, middlewares);
