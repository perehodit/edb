<template>
  <div id="admin-layout">
    <Sidebar></Sidebar>
    <div id="admin-layout-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Sidebar from '../components/admin/sidebar/Sidebar';

export default {
  components: {
    Sidebar,
  },
};
</script>

<style lang="scss">
#admin-layout {
  display: flex;

  h1:first-child {
    margin-top: 0;
  }
}

#admin-layout-content {
  padding: 20px 40px;
  overflow-x: hidden;
  width: 100%;
}

@media (max-width: 670px) {
  #admin-layout-content {
    padding: 20px 15px;
  }
}
</style>
