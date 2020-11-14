<template>
  <div class="fullpage-error">
    <slot name="image"></slot>
    <h1>{{ error.title }}</h1>
    <router-link :to="error.link">{{ error.message }}</router-link>
  </div>
</template>

<script>
export default {
  props: {
    error: Object,
  },
};
</script>

<style lang="scss">
.fullpage-error {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: -3%;

  h1 {
    color: $dark-text-color;
  }
}
</style>
