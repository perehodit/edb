import { computed, ref } from 'vue';

export default function(data) {
  const batches = ref([]);

  const batched = computed(() => {
    return batches.value.length > 0 ? true : false;
  });

  function toggleBatches() {
    if (batched.value === false) {
      data.value.forEach(element => {
        batches.value.push(element._id);
      });
    } else {
      batches.value = [];
    }
  }

  return { batches, batched, toggleBatches };
}
