<template>
  <div class="login">
    <FullpageError v-if="logged" :error="loggedError"></FullpageError>
    <form v-if="!logged" class="form" @submit.prevent>
      <div class="form__header">
        <h1>Авторизация</h1>
      </div>
      <div class="form__body">
        <div class="form__body__item">
          <input
            :disabled="status === 'PENDING'"
            v-model.trim="form.username"
            type="text"
            placeholder="Логин"
          />
        </div>
        <div class="form__body__item">
          <input
            :disabled="status === 'PENDING'"
            v-model.trim="form.password"
            type="password"
            placeholder="Пароль"
          />
        </div>
      </div>
      <div class="form__footer">
        <button :disabled="status === 'PENDING'" @click="handleSubmit">Войти</button>
        <router-link
          :class="status === 'PENDING' ? 'a-disabled' : null"
          class="small-text"
          style="text-align: right; font-size: 0.8rem;"
          to="/"
          >Вернуться на главную страницу</router-link
        >
      </div>
      <div class="form__error" v-if="status === 'FAILURE'">
        Ошибка авторизации. В случае, если вы не помните пароль обратитесь к главному
        администратору.
      </div>
    </form>
  </div>
</template>

<script>
import router from '@/router';
import store from '@/store';
import { reactive, ref, computed } from 'vue';
import FullpageError from '../components/errors/FullpageError';

export default {
  components: {
    FullpageError,
  },
  setup() {
    const form = reactive({
      username: null,
      password: null,
    });

    const loggedError = reactive({
      title: 'Вы уже авторизированны',
      message: 'Нажмите, чтобы вернуться на главную страницу',
      link: '/',
    });

    const logged = computed(() => store.state.auth.logged);

    const status = ref(null);

    function handleSubmit() {
      status.value = 'PENDING';
      store
        .dispatch('auth/login', form)
        .then(() => {
          router.push('/admin');
          status.value = 'SUCCESS';
        })
        .catch(() => {
          status.value = 'FAILURE';
        });
    }

    return {
      form,
      status,
      handleSubmit,
      loggedError,
      logged,
    };
  },
};
</script>

<style lang="scss">
.login {
  display: flex;
  height: 100%;
  justify-content: center;
  // align-items: center;

  form {
    margin-top: 30vh;
    width: 300px;
    h1 {
      margin-top: 0;
    }
  }

  input {
    width: 100%;
  }
}
</style>
