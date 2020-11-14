import serve from 'koa-static-server';

export default serve({
  rootDir: './uploads',
  rootPath: '/uploads',
});
