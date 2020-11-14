<template>
  <div class="admin-add">
    <AddModal @close="modals.add = false" v-if="modals.add">
      <template v-slot:header>Добавление таблицы</template>
      <template v-slot:body>
        Вы уверены что хотите добавить эту карточку?
      </template>
      <template v-slot:footer>
        <button @click="addCard">Да</button>
        <button @click="modals.add = false">Отмена</button>
      </template>
    </AddModal>
    <AfterAddModal :closeButton="false" @close="modals.after = false" v-if="modals.after">
      <template v-slot:header>Дальнейшее действие</template>
      <template v-slot:body>
        Выберите дальнейшее действие.
      </template>
      <template v-slot:footer>
        <div class="modal-many-buttons">
          <button @click="$router.push(`/card/${addedCardId}`)">Открыть карточку на стайте</button>
          <button @click="$router.push(`/admin/table/${$route.params.id}`)">Назад к таблице</button>
          <button @click="addNewCard">
            Добавить ещё карточку
          </button>
        </div>
      </template>
    </AfterAddModal>
    <div class="container">
      <a @click.prevent="$router.push(`/admin/table/${$route.params.id}`)" href="">&laquo; Назад</a>
      <h1>Добавление карточки</h1>
      <Loader v-if="loading"></Loader>
      <form v-show="!loading" @submit.prevent class="admin-add__form">
        <div class="admin-add__item admin-add__item_card">
          <div class="admin-add__item_card__label">
            Название карточки
          </div>
          <input v-model="card.name" type="text" placeholder="Название карточки" />
        </div>
        <div
          class="admin-add__item admin-add__item_card"
          v-for="(field, index) in table.fields"
          :key="index"
        >
          <div class="admin-add__item_card__label">
            {{ field.name }}
          </div>
          <input
            v-model.number="card.data[index]"
            type="number"
            v-if="field.type === 'number'"
            placeholder="Введите значение"
          />
          <select v-model="card.data[index]" name="" v-if="field.type === 'list'" id="">
            <option value="">Выберите значение</option>
            <option :value="option.value" v-for="(option, index) in field.options" :key="index">
              {{ option.value }}
            </option>
          </select>
          <textarea
            v-model="card.data[index]"
            placeholder="Введите значение"
            name=""
            id=""
            cols="30"
            rows="10"
            v-if="field.type === 'string'"
          ></textarea>
          <input
            @change="handleChangeFile($event, index)"
            type="file"
            name=""
            v-if="field.type === 'file'"
            :id="`file-${index}`"
          />
          <label
            :class="fileChanged(index) ? 'file-input_changed' : ''"
            :for="`file-${index}`"
            v-if="field.type === 'file'"
          >
            {{ fileChanged(index) ? 'Выбрать другой файл' : 'Прикрепить файл' }}
          </label>
        </div>
        <div class="form__error" v-if="errors.name">
          Не задано имя карточки.
        </div>
        <div class="form__error" v-if="errors.file">
          Не добавлен файл.
        </div>
        <div class="form__error" v-if="errors.data">
          Не добавлено значение.
        </div>
        <div class="form__error" v-if="errors.internal">
          Внутренняя ошибка сервера.
        </div>
        <div class="admin-add__item">
          <button @click="modals.add = true">Добавить карточку</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue';
import api from '../../services/api';
import Loader from '../../components/loader/Loader';
import { useRoute } from 'vue-router';
import AddModal from '../../components/modals/Modal';
import AfterAddModal from '../../components/modals/Modal';

export default {
  components: {
    Loader,
    AddModal,
    AfterAddModal,
  },
  setup() {
    const table = ref({});
    const loading = ref(true);
    const route = useRoute();
    const card = reactive({
      name: undefined,
      data: [],
    });
    const files = ref([]);

    const modals = reactive({
      add: false,
      after: false,
    });

    const errors = reactive({
      name: false,
      files: false,
      data: false,
      internal: false,
    });

    function validate() {
      let currentError = false;

      errors.name = false;
      errors.file = false;
      errors.data = false;

      if (!card.name) {
        errors.name = true;
        currentError = true;
      }

      table.value.fields.forEach((field, index) => {
        if (field.type === 'file') {
          if (!fileChanged(index)) {
            errors.file = true;
            currentError = true;
          }
        } else {
          if (
            card.data[index] === '' ||
            card.data[index] === null ||
            card.data[index] === undefined
          ) {
            console.log(field, card.data[index]);
            errors.data = true;
            currentError = true;
          }
        }
      });

      return !currentError;
    }

    function getTable() {
      api.get(`/tables/${route.params.id}`).then(result => {
        table.value = result.data;
        table.value.fields.forEach(field => {
          card.data.push('');
        });
        setTimeout(() => {
          loading.value = false;
        }, 600);
      });
    }

    function handleChangeFile(event, index) {
      let file = event.target.files[0];
      file.index = index;
      if (fileChanged(index)) {
        files.value.forEach((el, j) => {
          if (el.index === index) {
            files.value[j] = file;
          }
        });
      } else {
        files.value.push(file);
      }
      files.value = files.value.sort((a, b) => a.index - b.index);
      files.value = files.value.filter(file => {
        return file !== undefined && file !== null;
      });
    }

    function fileChanged(index) {
      for (let file of files.value) {
        if (index === file.index) {
          return true;
        } else {
          continue;
        }
      }

      return false;
    }

    function addNewCard() {
      modals.after = false;
      card.data.forEach((value, index) => {
        card.data[index] = '';
      });

      card.name = '';

      files.value = [];
    }

    const addedCardId = ref(null);

    function addCard() {
      modals.add = false;

      if (validate()) {
        const data = new FormData();
        data.append('name', card.name);
        const sendingData = card.data.filter(value => {
          return value !== '';
        });
        sendingData.forEach((value, index) => {
          data.append('data', value);
          if (typeof value === 'number') {
            data.append('numbers', index);
          }
        });
        files.value.forEach(file => {
          data.append('files', file);
        });
        data.append('table', route.params.id);

        api
          .post('/cards', data, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(result => {
            errors.internal = false;
            modals.after = true;
            addedCardId.value = result.data.id;
          })
          .catch(() => {
            errors.internal = true;
          });
      }
    }

    onMounted(() => {
      getTable();
    });

    return {
      handleChangeFile,
      addedCardId,
      getTable,
      loading,
      table,
      card,
      fileChanged,
      addNewCard,
      modals,
      addCard,
      files,
      errors,
    };
  },
};
</script>

<style lang="scss">
.admin-add__item_card {
  display: flex;
  flex-direction: column;

  input[type='file'] {
    display: none;
  }

  input[type='file']:disabled + label {
    background: $disabled-gray-color;
  }

  .file-input_changed {
    background: $secondary-color !important;
  }

  input[type='file'] + label {
    background: rgba($primary-color, 0.6);
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

  &__label {
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
}

.modal-many-buttons {
  display: flex;
  flex-direction: column;
  width: 100%;

  button {
    width: 100%;
    margin-bottom: 1rem;
  }
}
</style>
