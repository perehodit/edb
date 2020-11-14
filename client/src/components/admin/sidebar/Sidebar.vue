<template>
  <div class="sidebar" ref="sidebar">
    <div class="sidebar__menu">
      <router-link
        v-for="(item, index) in menuItems"
        :key="index"
        :to="item.path"
        class="sidebar__menu__item small-text"
      >
        <IconBase
          v-if="$route.path === item.path"
          :width="12"
          :height="12"
          style="margin-bottom: -1px;"
          :iconColor="'#4a9866'"
          ><IconNext
        /></IconBase>
        {{ item.name }}
      </router-link>
    </div>
    <div class="sidebar__button" ref="sidebarButton" @click="toggleSidebar">
      <IconBase><IconNext /></IconBase>
    </div>
    <router-link to="/" class="small-text">Назад на сайт</router-link>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue';
import IconBase from '../../icons/IconBase';
import IconNext from '../../icons/IconNext';
import cookie from 'js-cookie';

export default {
  components: {
    IconBase,
    IconNext,
  },
  setup() {
    const menuItems = ref([
      {
        name: 'Главная',
        path: '/admin',
      },
      {
        name: 'Слайдер',
        path: '/admin/slider',
      },
      {
        name: 'Пользователи',
        path: '/admin/users',
      },
      {
        name: 'База данных',
        path: '/admin/database',
      },
    ]);

    const sidebar = ref(null);
    const sidebarButton = ref(null);

    onMounted(() => {
      const role = cookie.get('role');

      if (role !== 'administrator') {
        const adminLinks = ['/admin/slider', '/admin/users'];

        menuItems.value = menuItems.value.filter(link => {
          return adminLinks.indexOf(link.path) === -1;
        });
      }

      if (
        localStorage.getItem('sidebarOpened') === 'false' ||
        localStorage.getItem('sidebarOpened') === null
      ) {
        sidebar.value.style.transition = 'none';
        sidebar.value.style.marginLeft = `-${sidebar.value.clientWidth}px`;
        sidebarButton.value.children[0].style.transform = 'scale(1, 1)';
      } else {
        sidebar.value.style.marginLeft = 0;
        sidebarButton.value.children[0].style.transform = 'scale(-1, 1)';
      }
    });

    function toggleSidebar() {
      if (
        localStorage.getItem('sidebarOpened') === 'false' ||
        localStorage.getItem('sidebarOpened') === null
      ) {
        sidebar.value.style.transition = '1s';
        localStorage.setItem('sidebarOpened', 'true');
        sidebar.value.style.marginLeft = 0;
        sidebarButton.value.children[0].style.transform = 'scale(-1, 1)';
      } else {
        localStorage.setItem('sidebarOpened', 'false');
        sidebar.value.style.marginLeft = `-${sidebar.value.clientWidth}px`;
        sidebarButton.value.children[0].style.transform = 'scale(1, 1)';
      }
    }

    return {
      menuItems,
      toggleSidebar,
      sidebar,
      sidebarButton,
    };
  },
};
</script>

<style lang="scss">
.sidebar {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: auto;
  height: 100vh;
  background: $light-background-color;
  padding: 20px 40px;
  min-width: 290px;
  transition: 1s;
  z-index: 1500;

  a {
    color: $dark-text-color;
  }

  a.router-link-exact-active {
    color: $primary-color;
  }

  &__menu {
    display: flex;
    flex-direction: column;
  }

  &__button {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: absolute;
    width: 60px;
    height: 60px;
    border-radius: 100px;
    right: -30px;
    top: 46%;
    background: $light-background-color;

    svg {
      margin-right: 12px;
      transition: 1s;
      path {
        transition: 0.2s;
      }
    }

    &:hover {
      cursor: pointer;
      svg {
        path {
          fill: $secondary-color;
        }
      }
    }
  }
}
</style>
