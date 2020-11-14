import Table from '../Table.js';

export async function dataValidator(value) {
  const { fields } = await Table.findOne({ _id: this.table });

  let i = 0;

  for (let field of fields) {
    if (field.type === 'list') {
      if (getOptionsValues(fields[i].options).indexOf(value[i]) === -1 && value[i]) {
        return false;
      }
    } else if (field.type === 'file') {
      if (typeof value[i] !== 'object') {
        return false;
      }
    } else if (field.type !== typeof value[i] || value[i] === '') {
      return false;
    }

    i++;
  }

  if (fields.length !== this.data.length) {
    return false;
  }

  return true;
}

function getOptionsValues(options) {
  const arrayOfValues = [];

  for (let option of options) {
    arrayOfValues.push(option.value);
  }

  return arrayOfValues;
}
