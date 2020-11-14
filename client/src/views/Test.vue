<template>
  <div class="test">
    <input @change="changeFile" type="file" name="" id="" />
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const file = ref(null);

    function changeFile(event) {
      file.value = event.target.files[0];
      file.value.index = 21;
      console.log(file.value);
    }

    return {
      file,
      changeFile,
    };
  },
};
</script>
