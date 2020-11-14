<template>
  <div class="table-pagination small-text">
    <div class="table-pagination__count">
      <div class="table-pagination__count__select">
        Количество:
        <select v-model="limit" name="" id="">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
      </div>
      <div class="table-pagination__count__display">
        {{ `${skip + 1}-${skip + count} из ${totalCount} элементов` }}
      </div>
    </div>
    <div class="table-pagination__pages">
      <div class="table-pagination__pages__display">
        {{ `${currentPage} из ${pagesCount} страниц` }}
      </div>
      <div class="table-pagination__pages__buttons">
        <IconBase
          @click="previousPage"
          class="icon_button"
          :width="12"
          :height="12"
          style="margin-bottom: -2px; transform: scale(-1, 1);"
        >
          <IconNext></IconNext>
        </IconBase>
        <IconBase
          @click="nextPage"
          class="icon_button"
          :width="12"
          :height="12"
          style="margin-bottom: -2px; margin-left: 10px"
        >
          <IconNext></IconNext>
        </IconBase>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref, watch } from 'vue';
import IconBase from '../icons/IconBase';
import IconNext from '../icons/IconNext';

export default {
  props: {
    totalCount: Number,
    count: Number,
  },
  components: {
    IconBase,
    IconNext,
  },
  setup(props, { emit }) {
    const currentPage = ref(1);
    const limit = ref('5');

    const skip = computed(() => {
      return +limit.value * (currentPage.value - 1);
    });

    const pagesCount = computed(() => {
      return Math.ceil(+props.totalCount / +limit.value);
    });

    function nextPage() {
      if (currentPage.value < pagesCount.value) {
        currentPage.value++;
        emit('changePagination', { limit, skip });
      }
    }

    function previousPage() {
      if (currentPage.value > 1) {
        currentPage.value--;
        emit('changePagination', { limit, skip });
      }
    }

    function setFirstPage() {
      currentPage.value = 1;
      emit('changePagination', { limit, skip });
    }

    watch(limit, () => {
      currentPage.value = 1;
      emit('changePagination', { limit, skip });
    });

    return {
      currentPage,
      limit,
      skip,
      pagesCount,
      nextPage,
      previousPage,
      setFirstPage,
    };
  },
};
</script>

<style lang="scss">
.table-pagination {
  width: 100%;
  background: $light-background-color;
  padding: 5px 10px;
  display: flex;
  justify-content: space-between;

  &__count {
    &__select {
      margin-right: 20px;
      select {
        outline: none;
        border: none !important;
        width: auto;
        background: transparent;
        appearance: none;
        background: url('../../assets/icons/dropdown.svg');
        background-repeat: no-repeat;
        background-position-x: 100%;
        background-position-y: 5px;
        padding: 0;
        padding-right: 0.7rem;

        transition: none !important;
        border-radius: 0 !important;

        &:focus {
          border-bottom: none !important;
        }

        &:disabled {
          background: none !important;
        }
      }
    }
  }

  &__pages {
    &__display {
      margin-right: 20px;
    }
  }

  &__count,
  &__pages {
    display: flex;

    &__display {
      margin-right: 10px;
    }
  }
}
</style>
