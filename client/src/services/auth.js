import api from './api';
import cookie from 'js-cookie';
import jwt from 'jsonwebtoken';

class AuthService {
  login(user) {
    return api.post('/auth/login', user).then(result => {
      const token = result.data.slice(7);
      const payload = jwt.decode(token);

      cookie.set('id', payload.id, { expires: 7 });
      cookie.set('role', payload.role, { expires: 7 });
    });
  }
  logout() {
    cookie.remove('id');
    cookie.remove('role');
    api.post('/auth/logout');
  }
}

export default new AuthService();
