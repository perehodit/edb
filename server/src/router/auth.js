import authorization from '../libraries/auth.js';
import Jwt from '../libraries/jwt.js';
import User from '../models/User.js';
import Router from '@koa/router';

const auth = new Router().prefix('/auth');

auth.post('/login', async ctx => {
  const { username, password } = ctx.request.body;
  const user = await User.findOne({ username });

  if (!user || !user.comparePassword(password)) {
    ctx.throw(400, 'Wrong login or password.');
  }

  const expires = new Date();
  expires.setDate(expires.getDate() + 7);

  const token = Jwt.sign(user);
  ctx.cookies.set('token', token, { expires, overwrite: true });
  ctx.body = token;
});

auth.post('/logout', authorization(), async ctx => {
  ctx.cookies.set('token', null);
  ctx.status = 200;
});

export default auth.routes();
