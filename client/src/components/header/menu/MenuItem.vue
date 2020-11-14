<template>
  <router-link class="menu__item small-text" :to="item.path">{{ item.name }}</router-link>
</template>

<script>
export default {
  props: {
    item: Object,
  },
};
</script>

<style lang="scss">
.menu {
  &__item {
    color: $dark-text-color;
    transition: 0.2s;
    margin-right: 10px;

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      color: $secondary-color;
    }
  }

  .router-link-exact-active {
    color: $primary-color;
  }
}

@media (max-width: 980px) {
  .menu {
    &__item {
      display: none;
      text-decoration: none;
    }
  }

  .menu_opened {
    .menu__item {
      display: inline;
      margin-right: 0;
    }
  }
}
</style>
