import config from '../config.js';
import jwt from 'jsonwebtoken';

class Jwt {
  constructor(config) {
    this.secret = config.secret;
  }

  sign(user) {
    const payload = {
      id: user.id,
      role: user.role,
    };

    const token = jwt.sign(payload, this.secret, { expiresIn: '7d' });

    return `Bearer ${token}`;
  }

  verify(token) {
    try {
      jwt.verify(token.slice(7), this.secret);
      return true;
    } catch {
      return false;
    }
  }

  decode(token) {
    return jwt.decode(token.slice(7));
  }
}

export default new Jwt(config);
