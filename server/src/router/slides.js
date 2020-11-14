import authorization from '../libraries/auth.js';
import Router from '@koa/router';
import Slide from '../models/Slide.js';
import koaBody from 'koa-body';
import fs from 'fs';

const slides = new Router().prefix('/slides');

slides.post(
  '/',
  authorization(['administrator', 'moderator']),
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: './uploads',
      keepExtensions: true,
      multiples: true,
      maxFileSize: 5242880,
      onFileBegin: async (name, file) => {
        const order = (await Slide.countDocuments()) + 1;
        await new Slide({
          path: file.path,
          order,
        }).save();
      },
    },
  }),
  async ctx => {
    ctx.status = 200;
  }
);

slides.get('/', async ctx => {
  ctx.body = await Slide.find().sort('order');
  ctx.status = 200;
});

slides.post('/delete', authorization(['administrator', 'moderator']), async ctx => {
  ctx.request.body.forEach(async _id => {
    const slide = await Slide.findOne({ _id });
    await Slide.deleteOne({ _id: slide._id });
    await Slide.updateOne({ order: slide.order + 1 }, { order: slide.order });
    try {
      fs.unlinkSync(`./${slide.path}`);
    } catch {
      console.log('Files not found');
    }
  });
  ctx.status = 200;
});

slides.put('/', authorization(['administrator', 'moderator']), async ctx => {
  const updates = ctx.request.body;
  for (let update of updates) {
    await Slide.updateOne({ _id: update._id }, { order: update.order });
  }
  ctx.status = 200;
});

export default slides.routes();
