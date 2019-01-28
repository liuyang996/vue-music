<template>
    <div class="slider">
        <swiper ref="mySwiper" :options="swiperOption" class="slider-item" v-if="slider.length > 0">
            <swiper-slide v-for="item,index in slider" :key="index">
                <img :src="item.picUrl" class="img">
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
    </div>
</template>

<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
export default {
  props: {
      slider:{
          type: Array
      }
  },
  data() {
    return {
        swiperOption:{
            loop:true,
            autoplay: true,
            disableOnInteraction: false,
            autoplayDisableOnInteraction:false,
            pagination: {
              el: '.swiper-pagination',
              clickable :true
            },
            observer:true,//修改swiper自己或子元素时，自动初始化swiper 
            observeParents:true,//修改swiper的父元素时，自动初始化swiper 
            on:{
          // 使用es6的箭头函数，使this指向vue对象
                click: ()=>{
                    // 通过$refs获取对应的swiper对象
                    let swiper = this.$refs.mySwiper.swiper;
                    console.log(swiper.realIndex);
                }
            }   

        }
    };
  },
  components: {
    swiper,
    swiperSlide
  }
};
</script>

<style lang="scss">

.swiper-pagination-bullet {
    height: 16px;
    width: 16px;
    background: #88878d;
    opacity: 1;
    &.swiper-pagination-bullet-active {
      background: #fffffd;
      opacity: 1;
      padding: 0 10px;
      border-radius: 10px;
    }
  }

  .slider{
      touch-action: none;
  }
    .slider-item {
        height: 288px; 
        .img {
            height: 288px; 
            width: 100%;
        }
    }
</style>


