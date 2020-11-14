<template>
  <div id="fullpage-layout">
    <slot></slot>
  </div>
</template>

<style lang="scss">
#fullpage-layout {
  height: 100%;

  .container {
    max-width: 1200px;
    width: 90%;
    margin: 0 auto;
  }
}
</style>
