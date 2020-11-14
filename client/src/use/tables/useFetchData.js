import api from '../../services/api';
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

export default function(path, name) {
  const data = ref(undefined);
  const totalCount = ref(0);
  const count = ref(0);
  const load = ref(false);
  const route = useRoute();

  const tablePagination = ref(null);

  const params = reactive({
    skip: 0,
    limit: 5,
    sort: undefined,
  });

  if (name === 'users') {
    (params.skip = ''), (params.limit = ''), (params.sort = '-created');
  }

  if (name === 'tables') {
    params.skip = 0;
    params.limit = 5;
    params.sort = '-created';
  }

  if (name === 'cards') {
    params.skip = 0;
    params.limit = 5;
    params.sort = '-created';
    params.table = route.params.id;
  }

  function fetchData() {
    load.value = true;

    api.get(path, { params }).then(result => {
      data.value = result.data;
      totalCount.value = result.headers['x-total-count'];
      count.value = result.data.length;
      setTimeout(() => {
        load.value = false;
      }, 500);
    });
  }

  function changeSort(sort) {
    params.sort = sort;
    tablePagination.value.setFirstPage();
    fetchData();
  }

  function changeSearch(search) {
    params.search = search;
    tablePagination.value.setFirstPage();
    fetchData();
  }

  function changePagination(pagination) {
    params.limit = pagination.limit;
    params.skip = pagination.skip;
    fetchData();
  }

  onMounted(() => {
    fetchData();
  });

  return {
    data,
    count,
    fetchData,
    totalCount,
    changeSearch,
    changeSort,
    changePagination,
    load,
    tablePagination,
  };
}
