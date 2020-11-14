import { createRouter, createWebHistory } from 'vue-router';
import cookie from 'js-cookie';

import About from '../views/About.vue';
import Database from '../views/Database';
import Contacts from '../views/Contacts';
import Table from '../views/Table';
import Card from '../views/Card';

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
    component: () => import('../views/admin/AdminMain'),
    meta: {
      layout: 'AdminLayout',
    },
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('../views/admin/AdminUsers'),
    meta: {
      layout: 'AdminLayout',
    },
  },
  {
    path: '/admin/slider',
    name: 'AdminSlider',
    component: () => import('../views/admin/AdminSlider'),
    meta: {
      layout: 'AdminLayout',
    },
  },
  {
    path: '/admin/database',
    name: 'AdminDatabase',
    component: () => import('../views/admin/AdminDatabase'),
    meta: {
      layout: 'AdminLayout',
    },
  },
  {
    path: '/admin/add-table',
    name: 'AdminAddTable',
    component: () => import('../views/admin/AdminAddTable'),
    meta: {
      layout: 'FullpageLayout',
    },
  },
  {
    path: '/admin/edit-table/:id',
    name: 'AdminEditTable',
    component: () => import('../views/admin/AdminEditTable'),
    meta: {
      layout: 'FullpageLayout',
    },
  },
  {
    path: '/admin/table/:id',
    name: 'AdminTable',
    component: () => import('../views/admin/AdminTable'),
    meta: {
      layout: 'FullpageLayout',
    },
  },
  {
    path: '/admin/add-card/:id',
    name: 'AdminAddCard',
    component: () => import('../views/admin/AdminAddCard'),
    meta: {
      layout: 'FullpageLayout',
    },
  },
  {
    path: '/admin/edit-card/:id',
    name: 'AdminEditCard',
    component: () => import('../views/admin/AdminEditCard'),
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
