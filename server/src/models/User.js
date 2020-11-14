import mongoosePrivatePathsPlugin from 'mongoose-private-paths';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const User = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      default: 'empty',
    },
    name: {
      type: String,
      default: 'empty',
    },
    patronymic: {
      type: String,
      default: 'empty',
    },
    role: {
      type: String,
      default: 'guest',
    },
    password: {
      type: String,
      required: true,
      private: true,
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

// Hash generation for password
User.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  try {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

User.pre('updateOne', function (next) {
  try {
    if (this._update.password) {
      const salt = bcrypt.genSaltSync(10);
      this._update.password = bcrypt.hashSync(this._update.password, salt);
      return next();
    } else {
      return next();
    }
  } catch (error) {
    return next(error);
  }
});

// Password check method
User.methods.comparePassword = function (value) {
  return bcrypt.compareSync(value, this.password);
};

User.plugin(mongoosePrivatePathsPlugin);

export default mongoose.model('users', User);
