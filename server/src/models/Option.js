import mongoose from 'mongoose';
import { typeValidator } from './validators/field.validators.js';
import { optionValueValidator } from './validators/option.validators.js';

const Option = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      validate: {
        validator: typeValidator,
        message: 'Bad request',
      },
    },
    value: {
      type: {},
      required: true,
      validate: {
        validator: optionValueValidator,
        message: 'Bad request',
      },
    },
  },
  {
    versionKey: false,
    _id: false,
  }
);

export default Option;
