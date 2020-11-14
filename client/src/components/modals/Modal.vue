<template>
  <div class="modal-wrapper">
    <div class="modal">
      <div class="modal__header">
        <h1>
          <slot name="header"></slot>
        </h1>
        <IconBase v-if="closeButton" class="icon_button" @click="close">
          <IconClose></IconClose>
        </IconBase>
      </div>
      <div class="modal__body">
        <slot name="body"></slot>
      </div>
      <div class="modal__footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import IconBase from '../icons/IconBase';
import IconClose from '../icons/IconClose';
import { onMounted, onUnmounted } from 'vue';

export default {
  props: {
    closeButton: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    IconBase,
    IconClose,
  },
  setup(props, { emit }) {
    function close() {
      emit('close');
    }

    // function disableScroll() {
    //   window.scrollTo(0, 0);
    // }

    // onMounted(() => {
    //   window.addEventListener('scroll', disableScroll);
    // });

    // onUnmounted(() => {
    //   window.removeEventListener('scroll', disableScroll);
    // });

    return { close };
  },
};
</script>

<style lang="scss">
.modal-wrapper {
  position: fixed;
  height: 100vh;
  width: 100vw;
  display: flex;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  z-index: 2000;
  overflow: scroll;
}

.modal {
  min-height: 250px;
  min-width: 320px;
  border-radius: 5px;
  background: $light-text-color;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 30px;
  margin-top: -10%;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h1 {
      margin-bottom: 0;
      padding-right: 20px;
      margin-top: 0 !important;
    }
  }

  &__body {
    overflow-y: auto;
    max-height: 50vh;
    min-height: 100px;
    max-width: 700px;
    overflow-x: auto;
  }

  &__footer {
    display: flex;
    justify-content: space-around;

    button {
      width: 120px;
    }
  }
}
</style>
