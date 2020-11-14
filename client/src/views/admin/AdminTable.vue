<template>
  <div class="admin-table">
    <DeleteModal v-if="modals.delete" @close="modals.delete = false">
      <template v-slot:header>
        Подтверждение
      </template>
      <template v-slot:body>
        Вы действительно хотите удалить {{ batches.length }} {{ getWord() }}?
      </template>
      <template v-slot:footer>
        <button @click="deleteCards">Да</button
        ><button @click="modals.delete = false">Отмена</button>
      </template>
    </DeleteModal>
    <div class="container">
      <a @click.prevent="$router.push('/admin/database')" href="">&laquo; Назад</a>
      <h1>Таблица</h1>
      <h2 v-if="table">{{ table.name }}</h2>
      <TableControl
        :nameSortFieldName="'name'"
        @changeSort="changeSort($event)"
        :batched="batched"
        @toggleBatches="toggleBatches"
        :search="true"
        @changeSearch="changeSearch($event)"
        :batchesCount="batches.length"
        @add="$router.push(`/admin/add-card/${$route.params.id}`)"
        @delete="modals.delete = true"
        @edit="$router.push(`/admin/edit-card/${batches[0]}`)"
      ></TableControl>
      <Loader v-if="load"></Loader>
      <Table
        v-show="!load"
        v-if="table"
        :batch="true"
        :batched="batched"
        @toggleBatches="toggleBatches"
      >
        <template v-slot:thead>
          <th>Название</th>
          <th v-for="(field, index) in table.fields" :key="index">{{ field.name }}</th>
          <th>Дата обновления</th>
          <th>Дата создания</th>
        </template>
        <template v-slot:tbody>
          <tr v-for="card in data" :key="card._id">
            <td>
              <input v-model="batches" :value="card._id" type="checkbox" :id="card._id" />
              <label :for="card._id"></label>
            </td>
            <td>
              <router-link :to="`/card/${card._id}`">{{ card.name }}</router-link>
            </td>
            <td v-for="(field, index) in table.fields" :key="index">
              <IconFileBase
                :ext="getFileExt(card.data[index].path)"
                v-if="isFile(card.data[index])"
              >
              </IconFileBase>
              {{ isFile(card.data[index]) ? '' : card.data[index] }}
              <a
                v-if="isFile(card.data[index])"
                target="blank"
                :href="`${path}/${card.data[index].path}`"
                >{{ card.data[index].name }}</a
              >
            </td>
            <td>{{ new Date(card.updated).toLocaleString('ru-RU') }}</td>
            <td>{{ new Date(card.created).toLocaleString('ru-RU') }}</td>
          </tr>
        </template>
      </Table>
      <TablePagination
        v-show="!load"
        :count="count"
        :totalCount="+totalCount"
        @changePagination="changePagination($event)"
        ref="tablePagination"
      ></TablePagination>
    </div>
  </div>
</template>

<script>
import Table from '../../components/table/Table';
import TableControl from '../../components/table/TableControl';
import TablePagination from '../../components/table/TablePagination';
import Loader from '../../components/loader/Loader';
import IconFileBase from '../../components/icons/IconFileBase';
import DeleteModal from '../../components/modals/Modal';

import api from '../../services/api';

import useFetchData from '../../use/tables/useFetchData';
import useBatchData from '../../use/tables/useBatchData';
import useFileExt from '../../use/useFileExt';
import { onMounted, ref, reactive } from 'vue';
import { useRoute } from 'vue-router';

export default {
  components: {
    Table,
    TableControl,
    TablePagination,
    Loader,
    IconFileBase,
    DeleteModal,
  },
  setup() {
    const {
      data,
      count,
      load,
      fetchData,
      totalCount,
      changeSort,
      changeSearch,
      changePagination,
      tablePagination,
    } = useFetchData('/cards', 'cards');
    const { batches, batched, toggleBatches } = useBatchData(data);

    const route = useRoute();
    const path = location.origin;
    const table = ref(undefined);

    const modals = reactive({
      delete: false,
    });

    function deleteCards() {
      load.value = true;
      api.post('/cards/delete', batches.value).then(() => {
        modals.delete = false;
        batches.value = [];
        fetchData();
      });
    }

    function isFile(data) {
      if (typeof data === 'object') {
        return true;
      } else {
        return false;
      }
    }

    function getWord() {
      return batches.value.length % 10 === 1 && batches.value.length < 10
        ? 'карточку'
        : batches.value.length % 10 > 1 && batches.value.length % 10 < 5
        ? 'карточки'
        : 'карточек';
    }

    onMounted(() => {
      api.get(`/tables/${route.params.id}`).then(result => {
        table.value = result.data;
      });
    });

    const { getFileExt } = useFileExt();

    return {
      getFileExt,
      isFile,
      data,
      deleteCards,
      count,
      getWord,
      load,
      fetchData,
      modals,
      totalCount,
      changeSort,
      changeSearch,
      changePagination,
      tablePagination,
      batches,
      batched,
      toggleBatches,
      table,
      path,
    };
  },
};
</script>

<style lang="scss">
.admin-table {
  .container {
    padding-top: 2rem;
    h1 {
      margin-top: 0;
      padding-top: 1rem;
    }

    margin: 0 auto;
  }
}
</style>
