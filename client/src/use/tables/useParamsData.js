export default function(params) {
  function changeSort(sort) {
    params.sort = sort;
    fetchData();
  }

  function changePagination(pagination) {
    params.limit = pagination.limit;
    params.skip = pagination.skip;
    console.log(pagination);
    fetchData();
  }

  return {
    changeSort,
    changePagination,
  };
}
