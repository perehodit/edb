<template>
  <div class="image-modal" ref="modalElement" @mousemove="whileDrag($event)">
    <div class="image-modal__container" ref="containerElement">
      <IconBase
        @click="close"
        class="icon_button image-modal__close"
        :iconColor="'#ffffff'"
        :iconName="'Close'"
        ><IconClose
      /></IconBase>
      <img
        ref="imageElement"
        :src="src"
        alt="Изображение"
        @dragstart.prevent
        @mousedown="startDrag($event)"
        @wheel="handleScroll($event)"
      />
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import IconBase from '../icons/IconBase';
import IconClose from '../icons/IconClose';

export default {
  props: {
    src: String,
  },
  components: {
    IconBase,
    IconClose,
  },
  setup({ image }, { emit }) {
    const imageElement = ref(null);
    const modalElement = ref(null);
    const containerElement = ref(null);

    const drag = reactive({ element: null, position: { x: 0, y: 0 } });

    function close() {
      emit('close');
    }

    function handleScroll() {
      imageElement.value.width -= event.deltaY / 2;
      imageElement.value.style.maxHeight = 'none';
      imageElement.value.style.maxWidth = 'none';
    }

    function startDrag(event) {
      drag.position.x = event.x - parseInt(containerElement.value.style.marginLeft, 10);
      drag.position.y = event.y - parseInt(containerElement.value.style.marginTop, 10);
      drag.element = imageElement.value;

      modalElement.value.addEventListener('mouseup', stopDrag);
      imageElement.value.style.cursor = 'move';
    }

    function whileDrag(event) {
      if (drag.element) {
        containerElement.value.style.marginLeft = `${event.x - drag.position.x}px`;
        containerElement.value.style.marginTop = `${event.y - drag.position.y}px`;
      }
    }

    function stopDrag() {
      drag.element = null;
      modalElement.value.removeEventListener('mouseup', stopDrag);
      imageElement.value.style.cursor = 'default';
    }

    function disableScroll() {
      window.scrollTo(0, 0);
    }

    onMounted(() => {
      window.addEventListener('scroll', disableScroll);
      containerElement.value.style.marginLeft = '0px';
      containerElement.value.style.marginTop = '0px';
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', disableScroll);
    });

    return {
      imageElement,
      modalElement,
      containerElement,
      handleScroll,
      whileDrag,
      startDrag,
      close,
    };
  },
};
</script>

<style lang="scss">
.image-modal {
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.8);

  &__container {
    width: min-content;
    position: relative;
  }

  &__close {
    position: absolute;
    top: -30px;
    right: -30px;
  }

  img {
    min-width: 10vw;
    max-width: 70vw;
    max-height: 70vh;
    transition: 0.1s;
    border: 2px solid $light-background-color;
  }
}
</style>
