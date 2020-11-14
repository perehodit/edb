import { createRouter, createWebHistory } from 'vue-router';
import cookie from 'js-cookie';

import About from '../views/About.vue';
import Database from '../views/Database';
import Contacts from '../views/Contacts';
import Table from '../views/Table';
import Card from '../views/Card';

import AdminMain from '../views/admin/AdminMain';
import AdminUsers from '../views/admin/AdminUsers';
import AdminSlider from '../views/admin/AdminSlider';
import AdminDatabase from '../views/admin/AdminDatabase';
import AdminAddTable from '../views/admin/AdminAddTable';
import AdminEditTable from '../views/admin/AdminEditTable';
import AdminTable from '../views/admin/AdminTable';
import AdminAddCard from '../views/admin/AdminAddCard';
import AdminEditCard from '../views/admin/AdminEditCard';

const routes = [
  {
    path: '/',
    name: 'About',
    component: About,
    meta: {
      layout: 'DefaultLayout',
    },
  },
  {
    path: '/database',
    name: 'Database',
    component: Database,
    meta: {
      layout: 'DefaultLayout',
    },
  },
  {
    path: '/database/:id',
    name: 'Table',
    component: Table,
    meta: {
      layout: 'DefaultLayout',
    },
  },
  {
    path: '/card/:id',
    name: 'Card',
    component: Card,
    meta: {
      layout: 'DefaultLayout',
    },
  },
  {
    path: '/contacts',
    name: 'Contacts',
    component: Contacts,
    meta: {
      layout: 'DefaultLayout',
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login'),
    meta: {
      layout: 'FullpageLayout',
    },
  },
  {
    path: '/admin',
    name: 'AdminMain',
    component: AdminMain,
    meta: {
      layout: 'AdminLayout',
    },
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: AdminUsers,
    meta: {
      layout: 'AdminLayout',
    },
  },
  {
    path: '/admin/slider',
    name: 'AdminSlider',
    component: AdminSlider,
    meta: {
      layout: 'AdminLayout',
    },
  },
  {
    path: '/admin/database',
    name: 'AdminDatabase',
    component: AdminDatabase,
    meta: {
      layout: 'AdminLayout',
    },
  },
  {
    path: '/admin/add-table',
    name: 'AdminAddTable',
    component: AdminAddTable,
    meta: {
      layout: 'FullpageLayout',
    },
  },
  {
    path: '/admin/edit-table/:id',
    name: 'AdminEditTable',
    component: AdminEditTable,
    meta: {
      layout: 'FullpageLayout',
    },
  },
  {
    path: '/admin/table/:id',
    name: 'AdminTable',
    component: AdminTable,
    meta: {
      layout: 'FullpageLayout',
    },
  },
  {
    path: '/admin/add-card/:id',
    name: 'AdminAddCard',
    component: AdminAddCard,
    meta: {
      layout: 'FullpageLayout',
    },
  },
  {
    path: '/admin/edit-card/:id',
    name: 'AdminEditCard',
    component: AdminEditCard,
    meta: {
      layout: 'FullpageLayout',
    },
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: () => import('../views/NotFound'),
    meta: {
      layout: 'FullpageLayout',
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const privatePages = ['/admin', '/admin/slider', '/admin/users'];
  const authRequired = privatePages.includes(to.path);
  const logged = cookie.get('id');

  if (authRequired && !logged) {
    next('/login');
  } else {
    next();
  }
});

export default router;
