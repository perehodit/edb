<template>
  <div ref="menu" class="menu">
    <IconBase :iconName="'Menu'" @click="toggleMenu" class="icon_button menu__button"
      ><IconMenu
    /></IconBase>
    <MenuItem v-for="(item, index) of items" :key="index" :item="item"></MenuItem>
  </div>
</template>

<script>
import MenuItem from './MenuItem';
import IconBase from '../../icons/IconBase';
import IconMenu from '../../icons/IconMenu';
import { reactive, ref } from 'vue';

export default {
  setup() {
    const items = reactive([
      {
        name: 'О проекте',
        path: '/',
      },
      {
        name: 'База данных',
        path: '/database',
      },
      {
        name: 'Контакты',
        path: '/contacts',
      },
    ]);

    const menu = ref(null);

    function toggleMenu() {
      menu.value.classList.toggle('menu_opened');
    }

    return { items, menu, toggleMenu };
  },
  components: {
    MenuItem,
    IconBase,
    IconMenu,
  },
};
</script>

<style lang="scss">
.menu {
  z-index: 1000;

  &__button {
    display: none;
  }
}

@media (max-width: 980px) {
  .menu {
    &__button {
      display: inline-block;
    }
  }
  .menu_opened {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-end;
    padding: 32px 5%;

    .menu__button {
      margin-bottom: 8px;
    }
  }
}
</style>
