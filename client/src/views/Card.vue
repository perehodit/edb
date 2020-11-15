<template>
  <div class="card">
    <div class="container">
      <h1 class="h1-dark" v-if="card && table">
        <router-link to="/database">База данных/</router-link>
        <router-link :to="`/database/${table._id}`">{{ table.name }}/</router-link>{{ card.name }}
      </h1>
      <Loader v-if="loading"></Loader>
      <div class="card-container" v-if="!loading">
        <div class="card-container__data" v-for="(field, index) in table.fields" :key="index">
          <div class="card-container__data__name">{{ field.name }}</div>
          <div class="card-container__data__value_file" v-if="isFile(card.data[index])">
            <img
              v-if="/\.(gif|jpg|jpeg|tiff|png)$/i.test(card.data[index].path)"
              class="card-container__data__value_image"
              :src="`/${card.data[index].path}`"
            />
            <IconFileBase
              v-if="!/\.(gif|jpg|jpeg|tiff|png)$/i.test(card.data[index].path)"
              :height="32"
              :width="32"
              :ext="getFileExt(card.data[index].path)"
            >
            </IconFileBase>
            <a
              v-if="!/\.(gif|jpg|jpeg|tiff|png)$/i.test(card.data[index].path)"
              target="blank"
              :href="`${path}/${card.data[index].path}`"
              >{{ card.data[index].name }}</a
            >
          </div>
          <div class="card-container__data__value" v-if="!isFile(card.data[index])">
            {{ card.data[index] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import api from '../services/api';
import store from '@/store';

import IconFileBase from '../components/icons/IconFileBase';
import Loader from '../components/loader/Loader';

import useFileExt from '../use/useFileExt';

export default {
  components: {
    IconFileBase,
    Loader,
  },
  setup() {
    const route = useRoute();
    const card = ref(undefined);
    const table = ref(undefined);
    const { getFileExt } = useFileExt();
    const logged = computed(() => store.state.auth.logged);
    const loading = ref(true);
    const path = location.origin;

    function getCard() {
      api.get(`/cards/${route.params.id}`).then(result => {
        card.value = result.data;
        api.get(`/tables/${card.value.table}`).then(result => {
          table.value = result.data;
          setTimeout(() => {
            loading.value = false;
          }, 600);
          if (!logged.value) {
            table.value.fields.forEach((field, index) => {
              if (field.private === true) {
                table.value.fields.splice(index, 1);
              }
            });
          }
        });
      });
    }

    function isFile(data) {
      if (typeof data === 'object') {
        return true;
      } else {
        return false;
      }
    }

    onMounted(() => {
      getCard();
    });

    return {
      card,
      table,
      isFile,
      getFileExt,
      loading,
      logged,
      path,
    };
  },
};
</script>

<style lang="scss">
.card-container {
  margin-bottom: 4rem;
  padding: 40px 0;
  border-radius: 5px;

  &__data {
    padding: 1rem 20px 2rem;
    margin-bottom: 1rem;
    border-radius: 5px;
    background: $light-background-color;
    transition: background 0.2s;

    &:hover {
      background: rgba($primary-color, 0.3);
    }

    &__name {
      margin: 0;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    &__value {
      white-space: pre-line;

      &_file {
        display: flex;
        align-items: flex-end;
      }

      &_image {
        max-height: 600px;
        margin-top: 5px;
        max-width: 300px;
        width: 100%;
        border: 2px solid $disabled-gray-color;
      }
    }
  }
}
</style>
