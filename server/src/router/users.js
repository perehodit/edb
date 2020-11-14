import Router from '@koa/router';
import User from '../models/User.js';
import authorization from '../libraries/auth.js';

const users = new Router().prefix('/users');

users.post('/', authorization(['administrator']), async ctx => {
  const userData = ctx.request.body;
  const alreadyExist = await User.findOne({ username: userData.username });

  if (!alreadyExist) {
    ctx.body = await new User(userData).save();
    ctx.status = 200;
  } else {
    ctx.body = {
      success: false,
      message: 'This username already exist.',
    };
    ctx.status = 400;
  }
});

users.get('/', async ctx => {
  const { id, skip, limit, sort } = ctx.query;

  const query = id ? { _id: id.split(',') } : id;

  ctx.set('x-total-count', await User.countDocuments(query));

  ctx.body = await User.find(query)
    .sort(sort)
    .skip(+skip)
    .limit(+limit);
});

users.post('/delete', authorization(['administrator']), async ctx => {
  const users = ctx.request.body;
  users.forEach(async _id => {
    await User.deleteOne({ _id });
  });
  ctx.status = 200;
});

users.put('/', authorization(['administrator']), async ctx => {
  const updates = ctx.request.body;
  const user = await User.findOne({ username: updates.username });

  if (user && user._id.toString() !== updates._id) {
    ctx.throw(400, 'Bad Request');
  } else {
    await User.updateOne({ _id: updates._id }, updates);
    ctx.status = 200;
  }
});

export default users.routes();
