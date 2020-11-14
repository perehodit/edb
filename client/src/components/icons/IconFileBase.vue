<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    viewBox="0 0 56 56"
    role="presentation"
    class="file-icon"
  >
    <component
      :is="extensions.indexOf(ext.toUpperCase()) === -1 ? 'UNDEFINED' : ext.toUpperCase()"
    ></component>
  </svg>
</template>

<script>
import { reactive } from 'vue';
import JPG from './files/JPG';
import PNG from './files/PNG';
import DOC from './files/DOC';
import DOCX from './files/DOC';
import XLS from './files/XLS';
import XLSX from './files/XLS';
import PDF from './files/PDF';
import PPT from './files/PPT';
import RTF from './files/RTF';
import TXT from './files/TXT';
import ZIP from './files/ARCH';
import RAR from './files/ARCH';
import UNDEFINED from './files/UNDEFINED';

export default {
  components: {
    JPG,
    PNG,
    DOC,
    DOCX,
    XLS,
    XLSX,
    PDF,
    PPT,
    RTF,
    TXT,
    ZIP,
    RAR,
    UNDEFINED,
  },
  setup() {
    const extensions = reactive([
      'JPG',
      'PNG',
      'DOC',
      'DOCX',
      'XLS',
      'XLSX',
      'PDF',
      'PPT',
      'RTF',
      'TXT',
      'ZIP',
      'RAR',
    ]);

    return {
      extensions,
    };
  },
  props: {
    ext: {
      type: String,
      default: 'UNDEFINED',
    },
    width: {
      type: [Number, String],
      default: 18,
    },
    height: {
      type: [Number, String],
      default: 18,
    },
  },
};
</script>

<style lang="scss">
svg.file-icon {
  display: inline-block;
  vertical-align: baseline;
  margin-bottom: -4px;
  margin-right: 5px;
}

svg.icon_button {
  cursor: pointer;

  g {
    path {
      transition: 0.2s;
    }
  }

  &:hover {
    g {
      path {
        fill: $secondary-color;
      }
    }
  }
}
</style>
