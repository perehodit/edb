<template>
  <div class="slider" v-if="images.length >= 5">
    <div class="container">
      <div ref="slickContainer" class="slick" @mousedown="handleMouseDown" @mouseup="handleMouseUp">
        <img
          class="slick-slide-img"
          v-for="(image, index) of images"
          :key="index"
          :src="`/${image.path}`"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue';
import $ from 'jquery';
import api from '../../services/api';
import slick from 'slick-carousel';

export default {
  setup() {
    const slickContainer = ref(null);

    let images = ref([]);

    async function getSlides() {
      await api.get('/slides').then(result => {
        images.value = result.data;
      });
    }

    function setSlickSlider() {
      $('.slick').slick({
        infinite: true,
        slidesToShow: 4,
        lazyLoad: 'ondemand',
        slidesToScroll: 1,
        speed: 500,
        autoplay: true,
        nextArrow:
          '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 18 18" aria-labelledby="box" role="presentation" style="transform: scale(1, 1);"><title id="box" lang="en">box icon</title><g fill="#000000"><g><path d="M13.6075 8.64117L5.11627 0.149945C4.91635 -0.0499817 4.59571 -0.0499817 4.39578 0.149945C4.19586 0.349872 4.19586 0.670509 4.39578 0.870435L12.5249 8.99953L4.39578 17.1286C4.19586 17.3285 4.19586 17.6492 4.39578 17.8491C4.49386 17.9472 4.62589 18 4.75414 18C4.8824 18 5.01442 17.951 5.1125 17.8491L13.6037 9.35789C13.8037 9.16173 13.8037 8.83732 13.6075 8.64117Z"></path></g></g></svg></button>',
        prevArrow:
          '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 18 18" aria-labelledby="box" role="presentation" style="transform: scale(-1, 1);"><title id="box" lang="en">box icon</title><g fill="#000000"><g><path d="M13.6075 8.64117L5.11627 0.149945C4.91635 -0.0499817 4.59571 -0.0499817 4.39578 0.149945C4.19586 0.349872 4.19586 0.670509 4.39578 0.870435L12.5249 8.99953L4.39578 17.1286C4.19586 17.3285 4.19586 17.6492 4.39578 17.8491C4.49386 17.9472 4.62589 18 4.75414 18C4.8824 18 5.01442 17.951 5.1125 17.8491L13.6037 9.35789C13.8037 9.16173 13.8037 8.83732 13.6075 8.64117Z"></path></g></g></svg></button>',
        responsive: [
          {
            breakpoint: 800,
            settings: {
              slidesToShow: 2,
            },
          },
          {
            breakpoint: 450,
            settings: {
              slidesToShow: 1,
            },
          },
        ],
      });
    }

    onMounted(async () => {
      await getSlides();
      setSlickSlider();
    });

    function handleMouseDown() {
      slickContainer.value.style.cursor = 'pointer';
    }
    function handleMouseUp() {
      slickContainer.value.style.cursor = 'default';
    }

    return {
      images,
      handleMouseDown,
      handleMouseUp,
      slickContainer,
    };
  },
};
</script>

<style lang="scss">
.slider {
  height: 200px;

  .container {
    background: $light-background-color;
    height: 100%;
    overflow: hidden;
  }
}

.slick-slider {
  position: relative;
  display: block;
  box-sizing: border-box;
  user-select: none;
  touch-action: pan-y;
}

.slick-slider .slick-track,
.slick-slider .slick-list {
  transform: translate3d(0, 0, 0);
}

.slick-track {
  position: relative;
  left: 0;
  top: 0;
  display: block;
  margin-left: auto;
  margin-right: auto;

  &:before,
  &:after {
    content: '';
    display: table;
  }

  &:after {
    clear: both;
  }

  .slick-loading & {
    visibility: hidden;
  }
}

.slick-slide {
  float: left;
  height: 100%;
  min-height: 1px;
  [dir='rtl'] & {
    float: right;
  }

  &:focus {
    outline: none;
  }

  div {
    height: 100%;
  }

  img {
    object-fit: cover;
    object-position: center;
    display: block;
    height: 200px !important;
  }

  &.slick-loading img {
    display: none;
  }

  &.dragging img {
    pointer-events: none;
  }

  .slick-initialized & {
    display: block;
  }

  .slick-loading & {
    visibility: hidden;
  }
}
.slick-arrow {
  position: absolute;
  top: 42%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 25px;
  width: 25px;
  background: transparent;
  background: rgba($light-background-color, 0.8);
  border-radius: 100px;
  z-index: 2;
  padding: 0;

  svg {
    path {
      transition: 0.2s;
    }
  }

  &:hover {
    background: transparent;
    background: rgba($dark-background-color, 0.9);

    svg {
      path {
        fill: $secondary-color;
      }
    }
  }
}

.slick-next {
  right: 20px;
  svg {
    margin-left: 2px;
    margin-bottom: 1px;
  }
}

.slick-prev {
  left: 20px;
  svg {
    margin-right: 2px;
    margin-bottom: 1px;
  }
}
</style>
