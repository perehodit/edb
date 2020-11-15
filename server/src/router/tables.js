import Router from '@koa/router';
import authorization from '../libraries/auth.js';
import Table from '../models/Table.js';
import Card from '../models/Card.js';
import fs from 'fs';

const tables = new Router().prefix('/tables');

tables.post('/', authorization(['administrator']), async ctx => {
  const table = ctx.request.body;
  await new Table(table).save();
  ctx.status = 200;
});

tables.get('/', async ctx => {
  const { skip, limit, sort, search } = ctx.query;

  if (search) {
    const totalCount = (await Table.fuzzySearch({ query: search, exact: true, prefixOnly: true }))
      .length;
    ctx.set('x-total-count', totalCount);

    ctx.body = await Table.fuzzySearch({ query: search, exact: true, prefixOnly: true })
      .sort(sort)
      .skip(+skip)
      .limit(+limit);
  } else {
    ctx.set('x-total-count', await Table.countDocuments());

    ctx.body = await Table.find()
      .sort(sort)
      .skip(+skip)
      .limit(+limit);
  }
});

tables.get('/:id', async ctx => {
  const table = await Table.findOne({ _id: ctx.params.id });
  table.created = undefined;
  table.updated = undefined;
  ctx.body = table;
  ctx.status = 200;
});

tables.post('/delete', authorization(['administrator']), async ctx => {
  const tables = ctx.request.body;
  tables.forEach(async _id => {
    const cards = await Card.find({ table: _id });
    if (typeof cards === 'object') {
      cards.forEach(async card => {
        await Card.deleteOne({ _id: card._id });
        try {
          card.data.forEach(value => {
            if (typeof value === 'object') {
              fs.unlinkSync(`./${value.path}`);
            }
          });
        } catch {
          console.log('Files not found');
        }
      });
    }
    await Table.deleteOne({ _id });
  });

  ctx.status = 200;
});

tables.put('/', authorization(['administrator']), async ctx => {
  const updates = ctx.request.body;
  await Table.updateOne({ _id: updates._id }, updates);
  ctx.status = 200;
});

export default tables.routes();
