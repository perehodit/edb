import Router from '@koa/router';

import auth from './auth.js';
import users from './users.js';
import slides from './slides.js';
import tables from './tables.js';
import cards from './cards.js';
import excel from './excel.js';

const router = new Router().prefix('/api');

router.use(auth, users, slides, tables, cards, excel);

export default router;
