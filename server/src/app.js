import Koa from 'koa';
import router from './router/index.js';
import middlewares from './middlewares/index.js';
import config from './config.js';
import mongoose from 'mongoose';
import fs from 'fs';
import User from './models/User.js';

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

  checkUploadFolders() {
    const dirs = ['./uploads'];

    for (let dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
    }
  }

  connectToDatabase() {
    mongoose
      .connect(this.config.mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
      .then(async () => {
        console.log('MongoDB has been connected');
        const adminIsExist = await User.findOne({ role: 'administrator' });
        if (!adminIsExist) {
          await new User({
            username: 'root',
            password: 'root',
            role: 'administrator',
          }).save();
        }
      })
      .catch(error => console.log(error.message));
  }

  start() {
    this.checkUploadFolders();
    this.setupMiddlewares();
    this.setupRouter();
    this.startListening();
    this.connectToDatabase();
  }
}

export default new App(config, router, middlewares);
