<template>
  <header class="header">
    <div class="container">
      <Logo></Logo>
      <Menu></Menu>
    </div>
  </header>
</template>

<script>
import Logo from './Logo';
import Menu from './menu/Menu';

export default {
  components: {
    Logo,
    Menu,
  },
};
</script>

<style lang="scss">
.header {
  min-height: 80px;
  padding-top: 20px;
  margin-bottom: 50px;

  .container {
    display: flex;
    height: 100%;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
