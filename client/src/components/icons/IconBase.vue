<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    viewBox="0 0 18 18"
    :aria-labelledby="iconName"
    role="presentation"
  >
    <g :fill="iconColor">
      <slot></slot>
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    iconName: {
      type: String,
      default: '',
    },
    width: {
      type: [Number, String],
      default: 18,
    },
    height: {
      type: [Number, String],
      default: 18,
    },
    iconColor: {
      type: String,
      default: '#000000',
    },
  },
};
</script>

<style lang="scss">
svg {
  display: inline-block;
  vertical-align: baseline;
  margin-bottom: -4px;
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
