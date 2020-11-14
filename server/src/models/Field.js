import mongoose from 'mongoose';
import Option from './Option.js';
import { typeValidator, optionsValidator } from './validators/field.validators.js';

const Field = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      validate: {
        validator: typeValidator,
        message: 'Bad request',
      },
    },
    private: {
      type: Boolean,
      required: true,
    },
    options: {
      type: [Option],
      default: undefined,
      validate: {
        validator: optionsValidator,
        message: 'Bad request',
      },
    },
  },
  {
    versionKey: false,
    _id: false,
  }
);

export default Field;
