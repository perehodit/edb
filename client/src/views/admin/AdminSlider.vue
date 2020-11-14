<template>
  <div class="admin-slider">
    <h1>Слайдер</h1>
    <h2 v-if="role !== 'administrator'">Нет доступа</h2>
    <div class="clear-wrapper" v-if="role === 'administrator'">
      <DeleteModal v-if="modals.delete" @close="modals.delete = false">
        <template v-slot:header>Подтверждение</template>
        <template v-slot:body
          >Вы действительно хотите удалить {{ batched.length }}
          {{ getWord(batched.length, ['слайд', 'слайда', 'слайдов']) }}?</template
        >
        <template v-slot:footer>
          <button @click="deleteSlides">Да</button>
          <button @click="modals.delete = false">Отмена</button>
        </template>
      </DeleteModal>
      <div class="admin-slider__container">
        <div class="admin-slider__wrapper">
          <div v-if="loading" class="admin-slider__loader">
            <Loader></Loader>
          </div>
          <Draggable
            v-model="slides"
            v-bind="dragOptions"
            v-show="!loading"
            class="admin-slider__drag"
          >
            <transition-group type="transition" name="flip-list">
              <div v-for="slide of slides" :key="slide._id" class="admin-slider__drag__item">
                <img :src="`/${slide.path}`" alt="" />
                <input
                  :value="slide._id"
                  v-model="batched"
                  type="checkbox"
                  name=""
                  :id="slide._id"
                />
                <label :for="slide._id"></label>
              </div>
            </transition-group>
          </Draggable>
          <div class="admin-slider__control">
            <button :disabled="isRightOrder || loading" @click="sort">Восстановить порядок</button>
            <button @click="saveOrder" :disabled="isRightOrder || loading" v-if="!isBatched">
              Сохранить порядок
            </button>
            <button
              @click="modals.delete = true"
              class="admin-slider__control__delete-button"
              v-if="isBatched"
            >
              Удалить выбранное
            </button>
            <input
              multiple
              accept="image/*"
              :disabled="loading"
              type="file"
              name=""
              @change="addSlides"
              id="files-upload"
            />
            <label for="files-upload">Добавить изображения</label>
            <div class="info-text small-text">
              Максимальное количество слайдов - 20. <br />
              Максимальный размер файла - 1 мб. <br />
              Необходимо загрузить не менее 5 изображений.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { VueDraggableNext } from 'vue-draggable-next';
import Loader from '../../components/loader/Loader';
import { computed, onMounted, reactive, ref } from 'vue';
import api from '../../services/api';
import DeleteModal from '../../components/modals/Modal';
import useGetWord from '../../use/useGetWord';
import cookie from 'js-cookie';

export default {
  components: {
    Draggable: VueDraggableNext,
    Loader,
    DeleteModal,
  },
  setup() {
    const slides = ref([]);
    const loading = ref(true);
    const batched = ref([]);
    const modals = reactive({
      delete: false,
    });

    const role = ref(cookie.get('role'));

    onMounted(() => {
      getSlides();
    });

    const isBatched = computed(() => {
      if (batched.value.length > 0) {
        return true;
      } else {
        return false;
      }
    });

    const isRightOrder = computed(() => {
      let index = 1;

      for (let slide of slides.value) {
        if (slide.order !== index) {
          return false;
        }
        index++;
      }

      return true;
    });

    const dragOptions = computed(() => {
      return {
        ghostClass: 'ghost',
        animation: 400,
      };
    });

    function getSlides() {
      loading.value = true;
      api.get('/slides').then(result => {
        slides.value = result.data;
        setTimeout(() => {
          loading.value = false;
        }, 600);
      });
    }

    function sort() {
      slides.value = slides.value.sort((a, b) => a.order - b.order);
    }

    function addSlides(event) {
      const data = new FormData();

      event.target.files.forEach(file => {
        data.append('slides', file);
      });

      loading.value = true;
      api.post('/slides', data).then(() => {
        getSlides();
      });
    }

    function deleteSlides() {
      modals.delete = false;
      loading.value = true;
      api.post('/slides/delete', batched.value).then(() => {
        batched.value = [];
        getSlides();
      });
    }

    function saveOrder() {
      loading.value = true;
      const newOrders = slides.value;
      let index = 1;

      for (let el of newOrders) {
        el.order = index;
        index++;
      }

      api.put('/slides', newOrders).then(() => {
        getSlides();
      });
    }

    return {
      ...useGetWord(),
      slides,
      loading,
      saveOrder,
      isRightOrder,
      sort,
      role,
      modals,
      dragOptions,
      batched,
      isBatched,
      addSlides,
      deleteSlides,
    };
  },
};
</script>

<style lang="scss">
.info-text {
  color: $disabled-gray-color;
  text-align: center;
  width: max-content;
  margin: 0 auto;
}

.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
}

.admin-slider {
  &__container {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  &__wrapper {
    background: $light-background-color;
    display: flex;
    padding: 20px;
    max-width: 990px;
    width: 100%;
    min-width: 270px;
  }

  &__loader {
    flex: 1 0 auto;
  }

  &__drag {
    display: flex;
    max-width: 580px;
    flex-wrap: wrap;
    height: min-content;
    width: 100%;
    transition: opacity 0.5s;

    &__item {
      height: 110px;
      width: 110px;
      margin: 2px;
      border: 2px solid $disabled-gray-color;
      cursor: move;
      position: relative;

      label {
        position: absolute;
        bottom: 1px;
        left: 5px;
      }

      input[type='checkbox'] + label:before {
        background: rgba($light-text-color, 0.8);
      }

      img {
        height: 100%;
        width: 100%;
        object-fit: cover;
      }
    }
  }

  &__control {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-left: 50px;

    &__delete-button {
      background: $error-color;
    }

    input {
      display: none;
    }

    input:disabled + label {
      background: $disabled-gray-color;
    }

    label {
      background: $primary-color;
      color: $light-text-color;
      transition: 0.2s;
      cursor: pointer;
      font-size: 13.3333px;
      text-align: center;
      line-height: normal;
      padding: 10px 30px;

      &:hover {
        background: $secondary-color;
      }
    }

    button,
    label {
      margin-bottom: 15px;
    }
  }
}
@media (max-width: 1020px) {
  .admin-slider {
    &__container {
      flex: 0 1 auto;
    }
    &__wrapper {
      flex-direction: column;
      width: 100%;
    }

    &__control {
      padding-top: 40px;
      padding-left: 0;
      min-width: 0;
    }
  }
}
</style>
