<template>
  <div class="not-found">
    <FullpageError :error="error">
      <template v-slot:image>
        <img src="../assets/images/logo.svg" alt="" />
      </template>
    </FullpageError>
  </div>
</template>

<script>
import { reactive } from 'vue';
import FullpageError from '../components/errors/FullpageError';

export default {
  components: {
    FullpageError,
  },
  setup() {
    const error = reactive({
      title: '404 - Страница не найдена',
      message: 'Перейти на главную страницу',
      link: '/',
    });

    return {
      error,
    };
  },
};
</script>

<style lang="scss">
.not-found {
  height: 100%;

  h1 {
    margin-top: 1rem;
  }

  img {
    max-width: 260px;
  }
}
</style>
