<template>
  <div class="admin-edit">
    <EditModal @close="modals.edit = false" v-if="modals.edit">
      <template v-slot:header>Добавление таблицы</template>
      <template v-slot:body>
        Вы уверены что хотите изменить эту карточку?
      </template>
      <template v-slot:footer>
        <button @click="updateCard">Да</button>
        <button @click="modals.edit = false">Отмена</button>
      </template>
    </EditModal>
    <div class="container">
      <a @click.prevent="$router.push(`/admin/table/${card.table}`)" href="">&laquo; Назад</a>
      <h1>Редактирование карточки</h1>
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
            {{ fileChanged(index) ? 'Выбрать другой файл' : 'Изменить файл' }}
          </label>
        </div>
        <div class="form__error" v-if="errors.name">
          Не задано имя карточки.
        </div>
        <div class="form__error" v-if="errors.data">
          Не добавлено значение.
        </div>
        <div class="form__error" v-if="errors.internal">
          Внутренняя ошибка сервера.
        </div>
        <div class="admin-add__item">
          <button @click="modals.edit = true">Сохранить изменения</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, reactive } from 'vue';
import api from '../../services/api';
import { useRoute, useRouter } from 'vue-router';

import EditModal from '../../components/modals/Modal';
import Loader from '../../components/loader/Loader';
export default {
  components: {
    EditModal,
    Loader,
  },
  setup() {
    const card = ref({});
    const table = ref({});
    const files = ref([]);
    const route = useRoute();
    const loading = ref(true);

    const modals = reactive({
      edit: false,
    });

    const errors = reactive({
      name: false,
      files: false,
      data: false,
      internal: false,
    });

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

    function getCard() {
      api.get(`/cards/${route.params.id}`).then(result => {
        card.value = result.data;
        api.get(`/tables/${card.value.table}`).then(result => {
          table.value = result.data;
          setTimeout(() => {
            loading.value = false;
          }, 600);
        });
      });
    }

    function validate() {
      let currentError = false;

      errors.name = false;
      errors.data = false;

      if (!card.value.name) {
        errors.name = true;
        currentError = true;
      }

      table.value.fields.forEach((field, index) => {
        if (field.type !== 'file') {
          if (
            card.value.data[index] === '' ||
            card.value.data[index] === null ||
            card.value.data[index] === undefined
          ) {
            console.log(field, card.data[index]);
            errors.data = true;
            currentError = true;
          }
        }
      });

      return !currentError;
    }

    const router = useRouter();

    function updateCard() {
      modals.edit = false;

      if (validate()) {
        const data = new FormData();
        data.append('name', card.value.name);
        const sendingData = card.value.data.filter(value => {
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
        data.append('_id', route.params.id);
        data.append('table', card.value.table);

        api
          .put('/cards', data, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(result => {
            errors.internal = false;
            router.push(`/admin/table/${card.value.table}`);
          })
          .catch(() => {
            errors.internal = true;
          });
      }
    }

    onMounted(() => {
      getCard();
    });

    return {
      card,
      table,
      handleChangeFile,
      fileChanged,
      files,
      updateCard,
      loading,
      errors,
      modals,
    };
  },
};
</script>
