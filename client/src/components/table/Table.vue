<template>
  <div class="table-wrapper">
    <table>
      <thead>
        <th class="table-batch" v-if="batch">
          <input @click="handleBatchClick" type="checkbox" name="" id="batch" :checked="batched" />
          <label for="batch"></label>
        </th>
        <slot name="thead"></slot>
      </thead>
      <tbody>
        <slot name="tbody"></slot>
      </tbody>
    </table>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue';
export default {
  props: {
    batch: Boolean,
    batched: Boolean,
  },
  setup(props, { emit }) {
    function handleBatchClick() {
      emit('toggleBatches');
    }

    return {
      handleBatchClick,
    };
  },
};
</script>

<style lang="scss">
.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  text-align: left;
  border-collapse: collapse;
  // table-layout: fixed;
}

th {
  font-weight: 500;
  background: $light-background-color;
}

th.table-batch {
  width: 40px;
}

th,
td {
  padding: 5px 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

tr:nth-child(even) {
  background-color: rgba($light-background-color, 0.5);
}

tbody {
  tr:hover {
    background: rgba($primary-color, 0.3);
  }
}
</style>
