<template>
  <div class="table-control small-text" v-if="!batched">
    <div class="table-control__left" v-if="search">
      <IconBase @click="toggleSearch" :height="14" :width="14" class="icon_button">
        <IconSearch></IconSearch>
      </IconBase>
      <input v-model="searchData" ref="searchInput" type="text" placeholder="Поиск" disabled />
    </div>
    <div class="table-control__right">
      <div class="table-control__right__icons">
        <IconBase :height="14" :width="14" class="icon_button" v-if="download">
          <IconDownload></IconDownload>
        </IconBase>
        <div ref="sortBox" class="sort-box">
          <div class="sort-box__item">
            <input
              v-model="sort"
              :value="`-${dateSortFieldName}`"
              type="radio"
              name="sort"
              id="sort1"
              :checked="true"
            />
            <label for="sort1">Сначала новые</label>
          </div>
          <div class="sort-box__item">
            <input
              v-model="sort"
              :value="`${dateSortFieldName}`"
              type="radio"
              name="sort"
              id="sort2"
            />
            <label for="sort2">Сначала старые</label>
          </div>
          <div class="sort-box__item">
            <input
              v-model="sort"
              :value="`${nameSortFieldName}`"
              type="radio"
              name="sort"
              id="sort3"
            />
            <label for="sort3">По возрастанию</label>
          </div>
          <div class="sort-box__item">
            <input
              v-model="sort"
              :value="`-${nameSortFieldName}`"
              type="radio"
              name="sort"
              id="sort4"
            />
            <label for="sort4">По убыванию</label>
          </div>
        </div>
        <IconBase @click="toggleSortBox" :height="14" :width="14" class="icon_button">
          <IconSort></IconSort>
        </IconBase>
      </div>
      <div v-if="add" class="table-control__right__button" @click="$emit('add')">
        Добавить
      </div>
    </div>
  </div>
  <div class="table-control_checked small-text" v-else>
    <div class="table-control_checked__item" v-if="download" @click="$emit('download')">
      <IconBase :height="14" :width="14" :iconColor="'#ffffff'">
        <IconDownload></IconDownload>
      </IconBase>
      Загрузить
    </div>
    <div
      class="table-control_checked__item"
      v-if="batchesCount === 1 && edit"
      @click="$emit('edit')"
    >
      <IconBase :height="14" :width="14" :iconColor="'#ffffff'">
        <IconEdit></IconEdit>
      </IconBase>
      Изменить
    </div>
    <div v-if="deleteIcon" class="table-control_checked__item" @click="$emit('delete')">
      <IconBase :height="14" :width="14" :iconColor="'#ffffff'">
        <IconRemove></IconRemove>
      </IconBase>
      Удалить
    </div>
    <div class="table-control_checked__item" @click="handleCancelClick">Отмена</div>
  </div>
</template>

<script>
import { reactive, ref, watch } from 'vue';
import IconBase from '../icons/IconBase';
import IconSearch from '../icons/IconSearch';
import IconSort from '../icons/IconSort';
import IconDownload from '../icons/IconDownload';
import IconRemove from '../icons/IconRemove';
import IconEdit from '../icons/IconEdit';

export default {
  props: {
    batched: {
      type: Boolean,
      default: false,
    },
    search: {
      type: Boolean,
      default: false,
    },
    edit: {
      type: Boolean,
      default: true,
    },
    deleteIcon: {
      type: Boolean,
      default: true,
    },
    download: {
      type: Boolean,
      default: false,
    },
    dateSortFieldName: {
      type: String,
      default: 'created',
    },
    nameSortFieldName: {
      type: String,
      default: 'name',
    },
    batchesCount: {
      type: Number,
      default: 0,
    },
    add: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    IconBase,
    IconSearch,
    IconSort,
    IconDownload,
    IconRemove,
    IconEdit,
  },
  setup(props, { emit }) {
    const searchInput = ref(null);
    const searchInputIsDisplayed = ref(false);
    const sortBox = ref(null);
    const sortBoxIsDisplayed = ref(false);
    const sort = ref(`-${props.dateSortFieldName}`);
    const searchData = ref(undefined);

    watch(sort, () => {
      emit('changeSort', sort.value);
    });

    watch(searchData, () => {
      emit('changeSearch', searchData.value);
    });

    function toggleSortBox() {
      if (sortBoxIsDisplayed.value === false) {
        sortBox.value.style.display = 'flex';
        sortBoxIsDisplayed.value = true;
      } else {
        sortBox.value.style.display = 'none';
        sortBoxIsDisplayed.value = false;
      }
    }

    function toggleSearch() {
      if (searchInputIsDisplayed.value === false) {
        searchInput.value.style.width = '100%';
        searchInput.value.style.marginLeft = '10px';
        searchInput.value.style.marginLeft = '10px';
        searchInput.value.disabled = false;
        searchInputIsDisplayed.value = true;
      } else {
        searchInput.value.style.width = '0px';
        searchInput.value.style.marginLeft = '0';
        searchInput.value.style.marginLeft = '0';
        searchInput.value.disabled = true;
        searchInputIsDisplayed.value = false;
      }
    }

    function handleCancelClick() {
      emit('toggleBatches');
    }

    return {
      searchInput,
      toggleSearch,
      searchInputIsDisplayed,
      sortBox,
      toggleSortBox,
      handleCancelClick,
      searchData,
      sort,
    };
  },
};
</script>

<style lang="scss">
.sort-box {
  display: none;
  flex-direction: column;
  position: absolute;
  background: $light-background-color;
  border-radius: 10px;
  box-shadow: 0px 0px 30px 5px rgba(0, 0, 0, 0.2);
  padding: 20px 10px;
  width: max-content;
  top: 100%;
  left: -50%;
}

.table-control {
  margin-bottom: 30px;
  background: $light-background-color;
  display: flex;
  justify-content: flex-end;

  &_checked {
    margin-bottom: 30px;
    background: $primary-color;
    display: flex;
    justify-content: flex-end;
    padding: 5px 30px;
    color: $light-text-color;

    &__item {
      cursor: pointer;
      transition: color 0.2s;
      margin-left: 20px;

      &:last-child {
        margin-left: 30px;
      }

      svg {
        margin-bottom: -3px;

        path {
          transition: 0.2s;
        }
      }

      &:hover {
        color: $secondary-color;

        path {
          fill: $secondary-color;
        }
      }
    }
  }

  .icon_button {
    margin-bottom: 0;
    margin-left: 10px;
    margin-bottom: 2px;
  }

  &__left {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    input {
      padding: 10px 0 !important;
      background: transparent;
      padding: 0;
      border: none;
      height: 100%;
      width: 0px;
      transition: width 0.4s;

      &:focus {
        border: none;
      }
    }
  }

  &__right {
    display: flex;

    &__icons {
      display: flex;
      align-items: center;
      position: relative;

      .icon_button {
        &:last-child {
          margin-right: 10px;
        }
      }
    }

    &__button {
      height: 100%;
      padding: 5px 30px;
      background: $primary-color;
      color: $light-text-color;
      cursor: pointer;

      &:hover {
        background: $secondary-color;
      }
    }
  }
}
</style>
