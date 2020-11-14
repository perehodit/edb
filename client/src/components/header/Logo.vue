<template>
  <div @click="handleLogoClick" class="logo">
    <img src="../../assets/images/logo.svg" alt="" />
    <div class="logo__text">
      <div class="logo__top">
        Электронная база данных
      </div>
      <div class="logo__bottom small-text">
        &laquo;Общественные организации Сибири в деле помощи жертвам войн начала XX в.&raquo;
      </div>
    </div>
  </div>
</template>

<script>
import router from '@/router';

export default {
  setup() {
    function handleLogoClick() {
      router.push('/');
    }

    return { handleLogoClick };
  },
};
</script>

<style lang="scss">
.logo {
  cursor: pointer;
  display: flex;
  align-items: center;
  padding-right: 30px;
  text-align: left;

  img {
    height: 70px;
    margin-right: 15px;
  }

  &__top {
    color: $primary-color;
    font-size: 1.2em;
  }

  &__bottom {
    transition: 0.2s;
  }

  &:hover {
    .logo__bottom {
      color: $secondary-color;
    }
  }
}
</style>
