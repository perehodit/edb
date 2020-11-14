<template>
  <div id="default-layout">
    <AdminHeader></AdminHeader>
    <Header></Header>
    <Slider></Slider>
    <div class="content">
      <slot></slot>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from '../components/header/Header';
import Slider from '../components/slider/Sldier';
import Footer from '../components/footer/Footer';
import AdminHeader from '../components/admin/header/Header';

export default {
  components: {
    Header,
    Slider,
    Footer,
    AdminHeader,
  },
};
</script>

<style lang="scss">
#default-layout {
  height: 100%;
  display: flex;
  flex-direction: column;

  .table-control {
    margin-top: 2rem;
  }

  .admin-header {
    flex: 0 0 auto;
  }

  .header {
    flex: 0 0 auto;
  }

  .content {
    flex: 1 0 auto;
  }

  .footer {
    flex: 0 0 auto;
  }

  .container {
    max-width: 1200px;
    width: 90%;
    margin: 0 auto;
  }
}
</style>
