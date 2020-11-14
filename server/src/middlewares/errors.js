import mongoose from 'mongoose';

export async function errors(ctx, next) {
  try {
    await next();
  } catch (e) {
    ctx.throw(e.status || 500, e.message || 'Internal Server Error');
  }
}

export async function errorsMongoose(ctx, next) {
  try {
    await next();
  } catch (e) {
    console.log(e);
    e instanceof mongoose.Error ? ctx.throw(400, 'Bad Request') : ctx.throw(e);
  }
}
