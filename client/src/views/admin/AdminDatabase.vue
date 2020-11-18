<template>
  <div class="admin-database">
    <h1>База данных</h1>
    <DeleteModal v-if="modals.delete" @close="modals.delete = false">
      <template v-slot:header>
        Подтверждение
      </template>
      <template v-slot:body>
        Вы действительно хотите удалить {{ batches.length }} {{ getWord() }}?
      </template>
      <template v-slot:footer>
        <button @click="deleteTables">Да</button
        ><button @click="modals.delete = false">Отмена</button>
      </template>
    </DeleteModal>
    <TableControl
      v-if="role === 'administrator'"
      :nameSortFieldName="'username'"
      @changeSort="changeSort($event)"
      :batched="batched"
      @toggleBatches="toggleBatches"
      :search="true"
      @changeSearch="changeSearch($event)"
      @add="$router.push('/admin/add-table')"
      @delete="modals.delete = true"
      :batchesCount="batches.length"
      @edit="$router.push(`/admin/edit-table/${batches[0]}`)"
      :download="batches.length === 1"
      @download="downloadExcel"
    ></TableControl>
    <TableControl
      v-if="role !== 'administrator'"
      :nameSortFieldName="'username'"
      @changeSort="changeSort($event)"
      :batched="batched"
      @toggleBatches="toggleBatches"
      :search="true"
      @changeSearch="changeSearch($event)"
      :add="false"
      :batchesCount="batches.length"
      :edit="false"
      :deleteIcon="false"
      :download="batches.length === 1"
      @download="downloadExcel"
    ></TableControl>
    <Loader v-if="load"></Loader>
    <Table v-show="!load" :batch="true" :batched="batched" @toggleBatches="toggleBatches">
      <template v-slot:thead>
        <th>Название</th>
        <th>Дата обновления</th>
        <th>Дата создания</th>
      </template>
      <template v-slot:tbody>
        <tr v-for="table in data" :key="table._id">
          <td>
            <input v-model="batches" :value="table._id" type="checkbox" :id="table._id" />
            <label :for="table._id"></label>
          </td>
          <td>
            <router-link :to="`/admin/table/${table._id}`">{{ table.name }}</router-link>
          </td>
          <td>{{ new Date(table.updated).toLocaleString('ru-RU') }}</td>
          <td>{{ new Date(table.created).toLocaleString('ru-RU') }}</td>
        </tr>
      </template>
    </Table>
    <TablePagination
      ref="tablePagination"
      v-show="!load"
      :count="count"
      :totalCount="+totalCount"
      @changePagination="changePagination($event)"
    ></TablePagination>
  </div>
</template>

<script>
import Table from '../../components/table/Table';
import TableControl from '../../components/table/TableControl';
import TablePagination from '../../components/table/TablePagination';
import Loader from '../../components/loader/Loader';
import DeleteModal from '../../components/modals/Modal';

import api from '../../services/api';

import useFetchData from '../../use/tables/useFetchData';
import useBatchData from '../../use/tables/useBatchData';
import { reactive, ref } from 'vue';
import cookie from 'js-cookie';

export default {
  components: {
    Table,
    TableControl,
    TablePagination,
    Loader,
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
    } = useFetchData('/tables', 'tables');
    const { batches, batched, toggleBatches } = useBatchData(data);

    const role = ref(cookie.get('role'));

    const modals = reactive({
      delete: false,
    });

    function deleteTables() {
      load.value = true;
      api.post('/tables/delete', batches.value).then(() => {
        modals.delete = false;
        batches.value = [];
        fetchData();
      });
    }
    // http://localhost:8080/api/excel?tableID=5fafb9e1f96b7204f2943a06&cardsID[]=qweqwe&cardsID[]=qweqweqw
    function downloadExcel() {
      window.open(`${location.origin}/api/excel?tableID=${batches.value[0]}`);
    }

    function getWord() {
      return batches.value.length % 10 === 1 && batches.value.length < 10
        ? 'таблицу'
        : batches.value.length % 10 > 1 && batches.value.length % 10 < 5
        ? 'таблицу'
        : 'таблиц';
    }

    return {
      data,
      load,
      downloadExcel,
      fetchData,
      count,
      totalCount,
      batches,
      batched,
      toggleBatches,
      changeSort,
      changePagination,
      changeSearch,
      tablePagination,
      deleteTables,
      getWord,
      modals,
      role,
    };
  },
};
</script>
