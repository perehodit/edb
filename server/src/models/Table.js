import mongoose from 'mongoose';
import Field from './Field.js';
import fuzzySearch from 'mongoose-fuzzy-searching';

const Table = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    // author: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true
    // },
    fields: {
      type: [Field],
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created',
      updatedAt: 'updated',
    },
    versionKey: false,
  }
);

Table.plugin(fuzzySearch, { fields: ['name'] });

export default mongoose.model('tables', Table);
