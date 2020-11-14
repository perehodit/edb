import Router from '@koa/router';
import Card from '../models/Card.js';
import Table from '../models/Table.js';
import authorization from '../libraries/auth.js';
import koaBody from 'koa-body';
import path from 'path';
import fs from 'fs';
import Jwt from '../libraries/jwt.js';

const cards = new Router().prefix('/cards');

cards.post(
  '/',
  authorization(['administrator', 'moderator']),
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: './uploads',
      keepExtensions: true,
      multiples: true,
      maxFileSize: 5242880,
    },
  }),
  async ctx => {
    const multipart = ctx.request.files;
    const { name, table } = ctx.request.body;
    let { numbers, data } = ctx.request.body;

    if (typeof numbers !== 'object') {
      numbers = [numbers];
    }

    numbers.forEach((value, index) => {
      numbers[index] = Number(numbers[index]);
    });

    if (typeof data !== 'object') {
      data = [data];
    }

    data.forEach((value, index) => {
      if (numbers.indexOf(index) !== -1) {
        data[index] = Number(data[index]);
      }
    });

    const card = {
      name,
      data,
      table,
    };

    const cardTable = await Table.findOne({ _id: card.table });

    const fileIndexes = [];

    cardTable.fields.forEach((field, index) => {
      if (field.type === 'file') {
        fileIndexes.push(index);
      }
    });

    if (multipart.files) {
      if (multipart.files.length) {
        let multipartIndex = 0;

        for (let i of fileIndexes) {
          card.data.splice(i, 0, {
            name: path.parse(multipart.files[multipartIndex].name).name,
            path: multipart.files[multipartIndex].path,
          });
          multipartIndex++;
        }
      } else {
        card.data.splice(fileIndexes[0], 0, {
          name: path.parse(multipart.files.name).name,
          path: multipart.files.path,
        });
      }
    }

    const addedCard = await new Card(card).save();
    ctx.body = { id: addedCard._id };
    ctx.status = 200;
  }
);

cards.get('/', async ctx => {
  const { skip, limit, sort, search, table } = ctx.query;

  if (search) {
    const totalCount = (
      await Card.find({ table: table }).fuzzySearch({ query: search, prefixOnly: true })
    ).length;
    ctx.set('x-total-count', totalCount);

    const result = await Card.find({ table: table })
      .fuzzySearch({ query: search, prefixOnly: true })
      .sort(sort)
      .skip(+skip)
      .limit(+limit);

    ctx.body = await handlePrivatePaths(ctx, table, result);
  } else {
    ctx.set('x-total-count', await Card.countDocuments({ table: table }));

    const result = await Card.find({ table: table })
      .sort(sort)
      .skip(+skip)
      .limit(+limit);

    ctx.body = await handlePrivatePaths(ctx, table, result);
    ctx.status = 200;
  }
});

cards.get('/:id', async ctx => {
  const result = await Card.find({ _id: ctx.params.id });
  const resultAfterCheking = await handlePrivatePaths(ctx, result[0].table, result);
  ctx.body = resultAfterCheking[0];
  ctx.status = 200;
});

async function handlePrivatePaths(ctx, table, cards) {
  const token = ctx.cookies.get('token');

  if (Jwt.verify(token)) {
  } else {
    const tableFull = await Table.findOne({ _id: table });
    tableFull.fields.forEach((field, index) => {
      if (field.private === true) {
        cards.forEach((card, cardIndex) => {
          cards[cardIndex].data.splice(index, 1);
        });
      }
    });
  }

  return cards;
}

cards.put(
  '/',
  authorization(['administrator', 'moderator']),
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: './uploads',
      keepExtensions: true,
      multiples: true,
      maxFileSize: 5242880,
    },
  }),
  async ctx => {
    const multipart = ctx.request.files;
    const { name, _id, table } = ctx.request.body;
    let { numbers, data } = ctx.request.body;
    const cardCopy = await Card.findOne({ _id });

    if (typeof numbers !== 'object') {
      numbers = [numbers];
    }

    numbers.forEach((value, index) => {
      numbers[index] = Number(numbers[index]);
    });

    if (typeof data !== 'object') {
      data = [data];
    }

    data.forEach((value, index) => {
      if (numbers.indexOf(index) !== -1) {
        data[index] = Number(data[index]);
      }
    });

    const card = {
      name,
      data,
    };

    const cardTable = await Table.findOne({ _id: table });

    const fileIndexes = [];

    cardTable.fields.forEach((field, index) => {
      if (field.type === 'file') {
        fileIndexes.push(index);
      }
    });

    if (multipart.files !== undefined) {
      if (multipart.files.length) {
        let multipartIndex = 0;

        for (let i of fileIndexes) {
          fs.unlinkSync(`./${cardCopy.data[i].path}`);
          card.data.splice(i, 1, {
            name: path.parse(multipart.files[multipartIndex].name).name,
            path: multipart.files[multipartIndex].path,
          });
          multipartIndex++;
        }
      } else {
        fs.unlinkSync(`./${cardCopy.data[fileIndexes[0]].path}`);
        card.data.splice(fileIndexes[0], 1, {
          name: path.parse(multipart.files.name).name,
          path: multipart.files.path,
        });
      }
    } else {
      fileIndexes.forEach(index => {
        card.data.splice(index, 1, cardCopy.data[index]);
      });
    }

    await Card.updateOne({ _id }, card);
    ctx.status = 200;
  }
);

cards.post('/delete', authorization(['administrator', 'moderator']), async ctx => {
  const indexes = ctx.request.body;

  indexes.forEach(async _id => {
    const card = await Card.findOne({ _id });
    await Card.deleteOne({ _id });
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

  ctx.status = 200;
});

export default cards.routes();
