import Router from '@koa/router';
import Table from '../models/Table.js';
import Card from '../models/Card.js';
import textTranslit from 'cyrillic-to-translit-js';

import ExcelJS from 'exceljs';
const { Workbook } = ExcelJS;

const excel = new Router().prefix('/excel');

excel.get('/', async ctx => {
  const { tableID } = ctx.query;
  const cardsID = ctx.query['cardsID[]'];

  const table = await Table.findOne({ _id: tableID });
  let cards = [];

  if (typeof cardsID === 'string') {
    cards = await Card.find({ _id: cardsID });
  } else if (cardsID) {
    for (let _id of cardsID) {
      const card = await Card.findOne({ _id });
      cards.push(card);
    }
  } else {
    cards = await Card.find({ table: tableID });
  }

  ctx.set({
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'Content-Disposition': `attachment; filename=${textTranslit().transform(table.name, '_')}.xlsx`,
  });

  try {
    ctx.body = await createTable(table, cards);
    ctx.status = 200;
  } catch (e) {
    ctx.body = 'Internal Server Error';
    console.log(e);
    ctx.status = 500;
  }
});

async function createTable(table, cards) {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Данные');

  const columns = [
    { header: '№', key: 'number', width: 5 },
    { header: 'Название', key: 'name', width: 20 },
  ];

  table.fields.forEach((field, index) => {
    columns.push({
      header: field.name,
      key: `field_${index}`,
      width: 20,
    });
  });

  columns.push(
    ...[
      { header: 'Дата создания', key: 'created', width: 18 },
      { header: 'Дата изменения', key: 'updated', width: 18 },
    ]
  );

  worksheet.columns = columns;

  cards.forEach((card, index) => {
    const number = index + 1;
    const name = card.name;
    const fields = {};
    const created = new Date(card.created).toLocaleString('RU-ru');
    const updated = new Date(card.updated).toLocaleString('RU-ru');

    card.data.forEach((value, index) => {
      fields[`field_${index}`] = value;
    });

    worksheet.addRow({
      number,
      name,
      ...fields,
      created,
      updated,
    });
  });

  worksheet.getRow(1).eachCell(cell => {
    cell.font = { bold: true };
  });

  worksheet.getColumn(1).alignment = { horizontal: 'left' };

  return await workbook.xlsx.writeBuffer();
}

export default excel.routes();
