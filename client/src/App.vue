<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script>
import DefaultLayout from './layouts/DefaultLayout';
import FullpageLayout from './layouts/FullpageLayout';
import AdminLayout from './layouts/AdminLayout';

export default {
  computed: {
    layout() {
      return this.$route.meta.layout;
    },
  },
  components: {
    DefaultLayout,
    FullpageLayout,
    AdminLayout,
  },
};
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

html {
  height: 100%;
}

body {
  height: 100%;
  overflow-y: scroll;
  margin: 0;
}

#app {
  height: 100%;
}
</style>
