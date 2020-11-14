<template>
  <div class="admin-users">
    <h1>Пользователи</h1>
    <h2 v-if="role !== 'administrator'">Нет доступа</h2>
    <div class="clear-wrapper" v-if="role === 'administrator'">
      <UserAddModal @close="modals.userAdd = false" v-if="modals.userAdd">
        <template v-slot:header>
          Добавление пользователя
        </template>
        <template v-slot:body>
          <div class="admin-users__add-form">
            <input v-model="user.surname" placeholder="Фамилия" type="text" />
            <input v-model="user.name" placeholder="Имя" type="text" />
            <input v-model="user.patronymic" placeholder="Отчество" type="text" />
            <input v-model="user.username" placeholder="Логин" type="text" />
            <select v-model="user.role" name="" id="">
              <option value="">Роль</option>
              <option value="moderator">Модератор</option>
              <option value="administrator">Администратор</option>
            </select>
            <input v-model="user.password" placeholder="Пароль" type="password" />
            <input
              v-model="user.confirmPassword"
              placeholder="Подтвердите пароль"
              type="password"
            />
          </div>
        </template>
        <template v-slot:footer>
          <div class="admin-users__add-form__footer">
            <div class="form__error" v-if="userErrors.validateError">
              Проверьте правильность введённых данных.
            </div>
            <div class="form__error" v-if="userErrors.existError">
              Пользователь с таким логином уже существует.
            </div>
            <div>
              <button @click="addUser">Добавить</button>
              <button @click="modals.userAdd = false">Отмена</button>
            </div>
          </div>
        </template>
      </UserAddModal>
      <UserDeleteModal v-if="modals.userDelete" @close="modals.userDelete = false">
        <template v-slot:header>
          Подтверждение
        </template>
        <template v-slot:body>
          Вы действительно хотите удалить {{ batches.length }} {{ getWord() }}?
        </template>
        <template v-slot:footer>
          <button @click="deleteUsers">Да</button
          ><button @click="modals.userDelete = false">Отмена</button>
        </template>
      </UserDeleteModal>
      <UserEditModal v-if="modals.userEdit" @close="modals.userEdit = false">
        <template v-slot:header>Редактирование пользователя</template>
        <template v-slot:body>
          <div class="admin-users__add-form">
            <input v-model="user.surname" placeholder="Фамилия" type="text" />
            <input v-model="user.name" placeholder="Имя" type="text" />
            <input v-model="user.patronymic" placeholder="Отчество" type="text" />
            <input v-model="user.username" placeholder="Логин" type="text" />
            <select v-model="user.role" name="" id="">
              <option value="">Роль</option>
              <option value="moderator">Модератор</option>
              <option value="administrator">Администратор</option>
            </select>
            <input v-model="user.password" placeholder="Новый пароль" type="password" />
            <input
              v-model="user.confirmPassword"
              placeholder="Подтвердите пароль"
              type="password"
            />
          </div>
        </template>
        <template v-slot:footer>
          <div class="admin-users__add-form__footer">
            <div class="form__error" v-if="userErrors.validateError">
              Проверьте правильность введённых данных.
            </div>
            <div class="form__error" v-if="userErrors.existError">
              Пользователь с таким логином уже существует.
            </div>
            <div>
              <button @click="updateUser">Сохранить</button>
              <button @click="modals.userEdit = false">Отмена</button>
            </div>
          </div>
        </template>
      </UserEditModal>
      <TableControl
        :nameSortFieldName="'username'"
        @changeSort="changeSort($event)"
        :batched="batched"
        @toggleBatches="toggleBatches"
        @delete="modals.userDelete = true"
        @add="handleUserAdd"
        :search="false"
        :batchesCount="batches.length"
        @edit="handleUserEdit"
      ></TableControl>
      <Loader v-if="load"></Loader>
      <Table v-show="!load" :batch="true" :batched="batched" @toggleBatches="toggleBatches">
        <template v-slot:thead>
          <th>Логин</th>
          <th>Роль</th>
          <th>ФИО</th>
          <th>Дата регистрации</th>
        </template>
        <template v-slot:tbody>
          <tr v-for="user in data" :key="user._id">
            <td>
              <input v-model="batches" :value="user._id" type="checkbox" :id="user._id" />
              <label :for="user._id"></label>
            </td>
            <td>
              {{ user.username }}
            </td>
            <td>
              {{
                user.role == 'administrator'
                  ? 'Администратор'
                  : user.role == 'moderator'
                  ? 'Модератор'
                  : 'Неверное значение'
              }}
            </td>
            <td>
              {{ `${user.surname} ${user.name} ${user.patronymic}` }}
            </td>
            <td>{{ new Date(user.created).toLocaleString('ru-RU') }}</td>
          </tr>
        </template>
      </Table>
    </div>
  </div>
</template>

<script>
import Table from '../../components/table/Table';
import TableControl from '../../components/table/TableControl';
import TablePagination from '../../components/table/TablePagination';
import Loader from '../../components/loader/Loader';
import UserAddModal from '../../components/modals/Modal';
import UserDeleteModal from '../../components/modals/Modal';
import UserEditModal from '../../components/modals/Modal';

import api from '../../services/api';
import cookie from 'js-cookie';

import useFetchData from '../../use/tables/useFetchData';
import useBatchData from '../../use/tables/useBatchData';
import { reactive, ref } from 'vue';

export default {
  components: {
    Table,
    TableControl,
    TablePagination,
    Loader,
    UserAddModal,
    UserDeleteModal,
    UserEditModal,
  },
  setup() {
    const modals = reactive({
      userAdd: false,
      userDelete: false,
      userEdit: false,
    });

    const role = ref(cookie.get('role'));

    const { data, count, load, fetchData, totalCount, changeSort, changePagination } = useFetchData(
      '/users',
      'users'
    );
    const { batches, batched, toggleBatches } = useBatchData(data);

    const user = reactive({
      surname: undefined,
      name: undefined,
      patronymic: undefined,
      role: '',
      username: undefined,
      password: undefined,
      confirmPassword: undefined,
    });

    const userValidateError = ref(false);

    const userErrors = reactive({
      validateError: false,
      existError: false,
    });

    function validateUserData() {
      if (
        user.surname &&
        user.name &&
        user.patronymic &&
        user.role !== '' &&
        user.username &&
        user.password
      ) {
        if (user.password === user.confirmPassword) {
          userErrors.validateError = false;
          return true;
        } else {
          userErrors.validateError = true;
        }
      } else {
        userErrors.validateError = true;
        return false;
      }
    }

    function validateUserDataForUpdate() {
      if (user.surname && user.name && user.patronymic && user.role !== '' && user.username) {
        if (user.password === user.confirmPassword) {
          userErrors.validateError = false;
          return true;
        } else {
          userErrors.validateError = true;
        }
      } else {
        userErrors.validateError = true;
        return false;
      }
    }

    function clearUserData() {
      user.surname = undefined;
      user.name = undefined;
      user.patronymic = undefined;
      user.role = '';
      user.username = undefined;
      user.password = undefined;
      user.confirmPassword = undefined;
      userErrors.validateError = false;
      userErrors.existError = false;
    }

    function addUser() {
      if (validateUserData()) {
        api
          .post('/users', user)
          .then(() => {
            fetchData();
            clearUserData();
            userErrors.existError = false;
            modals.userAdd = false;
          })
          .catch(() => {
            userErrors.existError = true;
          });
      }
    }

    function deleteUsers() {
      load.value = true;
      api.post('/users/delete', batches.value).then(() => {
        modals.userDelete = false;
        batches.value = [];
        fetchData();
      });
    }

    function getWord() {
      return batches.value.length % 10 === 1 && batches.value.length < 10
        ? 'пользователя'
        : batches.value.length % 10 > 1 && batches.value.length % 10 < 5
        ? 'пользователя'
        : 'пользователей';
    }

    function handleUserAdd() {
      clearUserData();
      modals.userAdd = true;
    }

    function updateUser() {
      if (validateUserDataForUpdate()) {
        const updates = user;
        updates._id = batches.value[0];
        if (updates.confirmPassword) {
          delete updates.confirmPassword;
        }
        api
          .put('/users', updates)
          .then(() => {
            modals.userEdit = false;
            batches.value = [];
            fetchData();
            clearUserData();
          })
          .catch(() => {
            userErrors.existError = true;
          });
      }
    }

    function handleUserEdit() {
      clearUserData();
      api
        .get('/users', {
          params: {
            id: batches.value[0],
          },
        })
        .then(result => {
          console.log(result.data);
          user.surname = result.data[0].surname;
          user.name = result.data[0].name;
          user.patronymic = result.data[0].patronymic;
          user.role = result.data[0].role;
          user.username = result.data[0].username;
          user.password = undefined;
          user.confirmPassword = undefined;
          console.log(user);
          modals.userEdit = true;
        });
    }

    return {
      getWord,
      modals,
      role,
      data,
      load,
      fetchData,
      count,
      totalCount,
      batches,
      batched,
      toggleBatches,
      changeSort,
      changePagination,
      deleteUsers,
      user,
      addUser,
      userErrors,
      handleUserEdit,
      handleUserAdd,
      updateUser,
    };
  },
};
</script>

<style lang="scss">
.admin-users {
  &__add-form {
    margin: 1rem 0;
    display: flex;
    flex-direction: column;

    &__footer {
      display: flex;
      flex-direction: column;
      width: 100%;

      div {
        display: flex;
        justify-content: space-around;
        width: 100%;
      }
    }

    input,
    select {
      margin-bottom: 0.5rem;
    }
  }
}
</style>
