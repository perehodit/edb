<template>
  <div class="admin-edit">
    <PrivateModal @close="modals.private = false" v-if="modals.private">
      <template v-slot:header>
        Выбор приватных полей
      </template>
      <template v-slot:body>
        <div v-if="!isEmpty" class="admin-add__info-text small-text">
          Для отображения элементов задайте им имя
        </div>
        <div
          class="admin-add__private-checkbox"
          v-for="(field, index) in table.fields"
          :key="index"
        >
          <input
            v-if="field.name"
            v-model="field.private"
            :id="`private-checkbox-${index}`"
            type="checkbox"
          />
          <label :for="`private-checkbox-${index}`">{{ field.name }}</label>
        </div>
      </template>
    </PrivateModal>
    <EditModal @close="modals.edit = false" v-if="modals.edit">
      <template v-slot:header>Добавление таблицы</template>
      <template v-slot:body>
        Вы уверены что хотите изменить эту таблицу?
      </template>
      <template v-slot:footer>
        <button @click="updateTable">Да</button>
        <button @click="modals.edit = false">Отмена</button>
      </template>
    </EditModal>
    <div class="container">
      <a @click.prevent="$router.push('/admin/database')" href="">&laquo; Назад</a>
      <h1>Редактирование таблицы</h1>
      <h2 v-if="role !== 'administrator'">Нет доступа</h2>
      <div class="clear-wrapper" v-if="role === 'administrator'">
        <Loader v-if="loading"></Loader>
        <form v-show="!loading" @submit.prevent class="admin-add__form">
          <div class="admin-add__item">
            <input type="text" v-model="table.name" placeholder="Название таблицы" />
          </div>
          <div
            v-for="(field, index) in table.fields"
            :key="index"
            class="admin-add__item"
            :class="field.type === 'list' ? 'admin-add__item_list' : ''"
          >
            <div class="admin-add__item__first">
              <input v-model="field.name" placeholder="Название поля" type="text" />
              <select
                @change="handleFieldTypeChange(index, field.type)"
                v-model="field.type"
                name=""
                id=""
                class="admin-add__type-select"
                :disabled="cardsExist"
              >
                <option value="">Тип данных</option>
                <option value="string">Текст</option>
                <option value="number">Число</option>
                <option value="list">Список</option>
                <option value="file">Файл</option>
              </select>
              <IconBase v-if="!cardsExist" @click="deleteField(index)" class="icon_button">
                <IconClose></IconClose>
              </IconBase>
            </div>
            <div class="admin-add__options" v-if="field.type === 'list'">
              <div
                v-for="(option, optionIndex) in field.options"
                :key="optionIndex"
                class="admin-add__options__option"
              >
                <input
                  :disabled="cardsExist"
                  v-model.number="option.value"
                  :type="option.type"
                  placeholder="Значение"
                />

                <select
                  :disabled="cardsExist"
                  v-model="option.type"
                  name=""
                  id=""
                  class="admin-add__type-select"
                >
                  <option value="">Тип данных</option>
                  <option value="string">Текст</option>
                  <option value="number">Число</option>
                </select>
                <IconBase
                  v-if="!cardsExist"
                  @click="deleteOption(index, optionIndex)"
                  class="icon_button"
                >
                  <IconClose></IconClose>
                </IconBase>
              </div>
              <div
                class="admin-add__options__option admin-add__options__option_spirit small-text"
                @click="addOption(index)"
                v-if="!cardsExist"
              >
                Добавить элемент
              </div>
            </div>
          </div>
          <div
            @click="addField"
            v-if="!cardsExist"
            class="admin-add__item admin-add__item_spirit small-text"
          >
            Добавить поле
          </div>
          <div class="form__error" v-if="errors.tableName">
            Не задано имя таблицы.
          </div>
          <div class="form__error" v-if="errors.fieldName">
            Не задано имя поля.
          </div>
          <div class="form__error" v-if="errors.option">
            Не добавлены значения в список.
          </div>
          <div class="form__error" v-if="errors.type">
            Не указан тип данных.
          </div>
          <div class="form__error" v-if="errors.count">
            Нет добавленных полей.
          </div>
          <div class="form__error" v-if="errors.internal">
            Внутренняя ошибка сервера
          </div>
          <div class="admin-add__item">
            <button @click="modals.private = true">Выбрать приватные поля</button>
            <button @click="modals.edit = true">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, reactive, ref } from 'vue';
import IconBase from '../../components/icons/IconBase';
import IconClose from '../../components/icons/IconClose';
import PrivateModal from '../../components/modals/Modal';
import EditModal from '../../components/modals/Modal';
import { useRoute } from 'vue-router';

import api from '../../services/api';
import cookie from 'js-cookie';
import router from '@/router';
import useFetchData from '../../use/tables/useFetchData';
import Loader from '../../components/loader/Loader';

export default {
  components: {
    IconBase,
    IconClose,
    PrivateModal,
    EditModal,
    Loader,
  },
  setup() {
    const route = useRoute();

    const loading = ref(true);
    const role = ref(cookie.get('role'));

    const modals = reactive({
      private: false,
      edit: false,
    });
    const table = ref({
      fields: [],
    });

    function addField() {
      table.value.fields.push({
        name: undefined,
        type: '',
        private: false,
      });
    }

    const errors = reactive({
      tableName: false,
      fieldName: false,
      type: false,
      option: false,
      internal: false,
      count: false,
    });

    function validate() {
      let currentError = false;

      errors.tableName = false;
      errors.fieldName = false;
      errors.type = false;
      errors.option = false;
      errors.count = false;

      if (!table.value.name) {
        errors.tableName = true;
        currentError = true;
      }

      if (table.value.fields.length === 0) {
        errors.count = true;
        currentError = true;
      }

      table.value.fields.forEach(field => {
        if (!field.name) {
          errors.fieldName = true;
          currentError = true;
        }
        if (!field.type) {
          errors.type = true;
          currentError = true;
        }
        if (field.type === 'list' && !field.options[0]) {
          errors.option = true;
          currentError = true;
        }
      });

      return !currentError;
    }

    function deleteField(index) {
      table.value.fields.splice(index, 1);
    }

    function addOption(index) {
      if (table.value.fields[index].options) {
        table.value.fields[index].options.push({
          type: '',
          value: undefined,
        });
      } else {
        table.value.fields[index].options = [
          {
            type: '',
            value: undefined,
          },
        ];
      }
    }

    function deleteOption(index, optionIndex) {
      table.value.fields[index].options.splice(optionIndex, 1);
    }

    function handleFieldTypeChange(index, type) {
      if (type !== 'list') {
        delete table.value.fields[index].options;
      }
    }

    const isEmpty = computed(() => {
      return table.value.fields.find(el => el.name !== undefined && el.name !== '');
    });

    const cardsExist = ref(false);

    function getTable() {
      api.get(`/tables/${route.params.id}`).then(result => {
        table.value = result.data;
        api.get(`/cards`, { params: { table: table.value._id, limit: 1 } }).then(result => {
          setTimeout(() => {
            if (result.data.length > 0) {
              cardsExist.value = true;
            }
            loading.value = false;
          }, 600);
        });
      });
    }

    function updateTable() {
      modals.edit = false;

      if (validate()) {
        api
          .put('/tables', table.value)
          .then(() => {
            errors.internal = false;
            router.push('/admin/database');
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
      table,
      addField,
      deleteField,
      addOption,
      deleteOption,
      handleFieldTypeChange,
      modals,
      cardsExist,
      role,
      updateTable,
      isEmpty,
      errors,
      loading,
    };
  },
};
</script>

.<style lang="scss">
.admin-edit {
  input,
  select {
    border-bottom: 1px solid white;

    &:disabled {
      border-bottom: 1px solid $light-background-color;
    }
  }

  &__info-text {
    color: $disabled-gray-color;
    text-align: center;
  }

  &__private-checkbox {
    label {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      text-overflow: ellipsis;
      max-width: 500px;
      overflow: hidden;

      &::before {
        flex: 0 0 auto;
      }
    }
  }

  .container {
    padding-top: 2rem;
    h1 {
      margin-top: 0;
      padding-top: 1rem;
    }

    margin: 0 auto;
  }

  &__form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  &__type-select {
    width: 150px;
    margin-left: 20px;
  }

  &__item {
    background: $light-background-color;
    width: 100%;
    display: flex;
    padding: 20px 20px;
    margin-bottom: 1rem;
    border-radius: 5px;

    &__first {
      display: flex;
      width: 100%;
    }

    &_list {
      flex-wrap: wrap;

      .admin-add__options {
        display: flex;
        width: 100%;
        margin-top: 1rem;
        flex-direction: column;
        align-items: flex-end;
        padding-left: 30%;

        svg {
          flex: 0 0 auto;
        }

        &__option {
          width: 100%;
          display: flex;
          padding: 5px 0;

          &_spirit {
            margin-top: 10px;
            background: transparent;
            border: 1px dashed $disabled-gray-color;
            display: flex;
            justify-content: center;
            color: $disabled-gray-color;
            cursor: pointer;
            transition: 0.5s;

            &:hover {
              border: 1px dashed $secondary-color;
              color: $secondary-color;
            }
          }
        }
      }
    }

    .icon_button {
      margin-left: 20px;
      align-self: center;
      margin-top: -6px;
    }

    &_spirit {
      margin-top: 40px;
      background: transparent;
      border: 1px dashed $disabled-gray-color;
      display: flex;
      justify-content: center;
      color: $disabled-gray-color;
      cursor: pointer;
      transition: 0.5s;

      &:hover {
        border: 1px dashed $secondary-color;
        color: $secondary-color;
      }
    }

    input,
    select {
      padding-left: 10px;
    }

    input,
    button {
      flex: 1 0 auto;
    }

    &:last-child {
      justify-content: space-evenly;
      background: transparent;

      button {
        width: 40%;
        flex: 0 0 auto;
        padding: 10px 0;
      }
    }
  }
}
</style>
