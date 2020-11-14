import User from '../models/User.js';
import Jwt from './jwt.js';

export default function authorization(roles) {
  return async (ctx, next) => {
    const token = ctx.cookies.get('token');

    if (Jwt.verify(token)) {
      const payload = Jwt.decode(token);

      if (typeof roles === 'string') {
        roles = [roles];
      }

      let roleHaveAccess;

      switch (typeof roles) {
        case 'undefined':
          roleHaveAccess = true;
          break;
        case 'object':
          if (roles.includes(payload.role)) {
            roleHaveAccess = true;
          } else {
            roleHaveAccess = false;
          }
          break;
        default:
          roleHaveAccess = false;
          break;
      }

      if (roleHaveAccess) {
        ctx.state.user = await User.findOne({ _id: payload.id });
        await next();
      } else {
        ctx.throw(403, 'Forbidden');
      }
    } else {
      ctx.throw(401, 'Unauthorized');
    }
  };
}
