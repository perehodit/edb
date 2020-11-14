import mongoose from 'mongoose';
import { dataValidator } from './validators/card.validators.js';
import fuzzySearch from 'mongoose-fuzzy-searching';

const Card = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    data: {
      type: Array,
      required: true,
      validate: {
        validator: dataValidator,
        message: 'Bad Request',
      },
    },
    // author: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true
    // },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Table',
    },
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: 'created',
      updatedAt: 'updated',
    },
  }
);

Card.plugin(fuzzySearch, {
  fields: ['name', 'data'],
});

export default mongoose.model('cards', Card);
