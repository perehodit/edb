import Router from '@koa/router';

import auth from './auth.js';
import users from './users.js';
import slides from './slides.js';
import tables from './tables.js';
import cards from './cards.js';

const router = new Router().prefix('/api');

router.use(auth, users, slides, tables, cards);

export default router;
