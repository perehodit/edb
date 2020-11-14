<template>
  <div class="admin-header small-text" v-if="logged">
    <div class="container">
      <router-link to="/admin" class="admin-header__item">Панель администратора</router-link>
      <a class="admin-header__item" @click="logout">Выйти</a>
    </div>
  </div>
</template>

<script>
import store from '@/store';
import { computed } from 'vue';

export default {
  setup() {
    const logged = computed(() => store.state.auth.logged);

    function logout() {
      store.dispatch('auth/logout');
    }

    return { logged, logout };
  },
};
</script>

<style lang="scss">
.admin-header {
  background: $dark-background-color;

  a {
    color: $light-text-color;
    cursor: pointer;
    text-decoration: none;
  }

  .container {
    display: flex;
    justify-content: flex-end;
  }

  &__item {
    margin-right: 10px;
  }
}
</style>
