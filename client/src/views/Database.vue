<template>
  <div class="database">
    <div class="container">
      <h1>База данных</h1>
      <TableControl
        @changeSort="handlechangeSort"
        @changeSearch="handleChangeSearch"
        :add="false"
        :search="true"
      ></TableControl>
      <Loader v-if="loading"></Loader>
      <div v-if="!loading" class="database__tables">
        <div class="info-text" v-if="!loading && tables.length === 0">
          Данные не найдены
        </div>
        <div class="database__table" v-for="table in tables" :key="table._id">
          <div class="database__table__name">
            <router-link :to="`/database/${table._id}`">{{ table.name }}</router-link>
          </div>
          <div class="database__table__date small-text">
            Последние изменения: {{ new Date(table.updated).toLocaleString('ru-RU') }}
          </div>
        </div>
      </div>
      <div class="database__pagination small-text" v-if="pages > 1" v-show="!loading">
        <div class="database__pagination__wrapper" v-for="i in pages" :key="i">
          <div v-if="Math.abs(i - control.page) < 3 || i === pages || i === 1">
            <div
              class="database__pagination__wrapper__page"
              @click="changePage(i)"
              :class="{
                database__pagination__wrapper__page_current: control.page === i,
                database__pagination__wrapper__page_last:
                  i === pages && Math.abs(i - control.page) > 3,
                database__pagination__wrapper__page_first:
                  i === 1 && Math.abs(i - control.page) > 3,
              }"
            >
              {{ i }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, reactive, ref } from 'vue';
import api from '../services/api';
import Loader from '../components/loader/Loader';
import TableControl from '../components/table/TableControl';

export default {
  components: {
    Loader,
    TableControl,
  },
  setup() {
    const tables = ref([]);
    const loading = ref(true);

    const control = reactive({
      total: undefined,
      skip: undefined,
      limit: 5,
      search: undefined,
      sort: '-updated',
      page: 1,
    });

    const pages = computed(() => {
      return Math.ceil(control.total / control.limit);
    });

    function getTables() {
      api
        .get('/tables', {
          params: {
            skip: control.skip,
            limit: control.limit,
            search: control.search,
            sort: control.sort,
          },
        })
        .then(result => {
          tables.value = result.data;
          setTimeout(() => {
            control.total = result.headers['x-total-count'];
            loading.value = false;
          }, 600);
        });
    }

    function handleChangeSearch(search) {
      control.search = search;
      changePage(1);
    }

    function handlechangeSort(sort) {
      control.sort = sort;
      changePage(1);
    }

    function changePage(page) {
      loading.value = true;
      control.page = page;
      control.skip = control.limit * (page - 1);
      getTables();
    }

    onMounted(() => {
      getTables();
    });

    return {
      tables,
      loading,
      pages,
      control,
      changePage,
      handleChangeSearch,
      handlechangeSort,
    };
  },
};
</script>

<style lang="scss">
.database {
  .sort-box {
    left: -335%;
  }

  &__pagination {
    display: flex;
    margin-bottom: 3.5rem;
    justify-content: center;

    &__wrapper {
      &__page {
        height: 20px;
        width: 18px;
        border-radius: 3px;
        border: 1px solid $dark-text-color;
        display: flex;
        justify-content: center;
        align-items: center;
        background: $light-text-color;
        color: $dark-text-color;
        margin: 0 5px;
        transition: background 0.2s;
        position: relative;

        &_first {
          margin-right: 25px;
        }

        &_last {
          margin-left: 25px;
        }

        &_first::after {
          content: ' ...';
          position: absolute;
          left: 25px;
        }

        &_last::before {
          content: '... ';
          position: absolute;
          right: 25px;
        }

        &_current {
          background: rgba($primary-color, 1);
          color: $light-text-color;
        }

        &:hover {
          cursor: pointer;
          background: rgba($secondary-color, 0.5);
          color: $dark-text-color;
        }
      }
    }
  }

  &__tables {
    margin-bottom: 1.5rem;
  }

  &__table {
    background: $light-background-color;
    padding: 10px 20px;
    margin-bottom: 1rem;
    border-radius: 5px;
  }
}
</style>
