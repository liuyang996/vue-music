<template>
    <div class="recommend" ref="recommend">
        <scroll ref="scroll" :data="discList" class="recommend-content">
            <div>
                <div class="slider-wrapper">
                    <slider :slider="sliderData"></slider>
                </div>
                <div class="disc-wrapper">
                    <h1 class="title">热门歌单推荐</h1>
                    <ul class="disc">
                        <li @click="selectItem(item)" class="item" v-for="item,index in discList" :key="index">
                            <div class="pic">
                                <img v-lazy="item.imgurl">
                            </div>
                            <div class="text">
                                <h2 class="name">{{item.creator.name}}</h2>
                                <p class="desc">{{item.dissname}}</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="loading-container">
                <loading v-if="!discList.length"></loading>
            </div>
        </scroll>
        <router-view></router-view>
    </div>
    
</template>

<script>
import { getRecommend, getDiscList } from "api/recommend";
import { ERR_OK } from "api/config";
import {playerMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'

export default {
  mixins:[playerMixin],
  data() {
    return {
      sliderData: [],
      discList: []
    };
  },
  created() {
    this._getRecommend();
    this._getDiscList();
  },
  methods: {
    handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''

        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          console.log(res.data.slider);
          this.sliderData = res.data.slider;
        }
      });
    },
    _getDiscList() {
      getDiscList().then(res => {
        if (res.code === ERR_OK) {
          console.log(res.data);
          this.discList = res.data.list;
        }
      });
    },
    selectItem(item) {
        console.log(item);
        this.$router.push({
            path:`/recommend/${item.dissid}`
        })
        this.setDisc(item);
    },
    ...mapMutations({
        setDisc:'SET_DISC'
    })
  },
  components: {
    slider: () => import("base/slider/slider"),
    scroll: () => import("base/scroll/scroll"),
    loading: () => import("base/loading/loading")
  }
};
</script>

<style lang="scss">
.recommend {
    position: fixed;
    width: 100%;
    top: 176px;
    bottom: 0;
}
.recommend-content {
  position: relative;
  height: 100%;
  overflow: hidden;
  .loading-container{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
  }
}
.slider-wrapper {
  width: 100%;
  overflow: hidden;
}
.disc-wrapper {
  .title {
    height: 130px;
    line-height: 130px;
    text-align: center;
    font-size: 28px;
    color: #ffcd32;
  }
  .disc {
    .item {
      display: flex;
      padding: 0px 40px 40px 40px;
      box-sizing: border-box;
      align-items: center;
      .pic {
        flex: 0 0 120px;
        width: 120px;
        padding-right: 40px;
        img {
          width: 120px;
          height: 120px;
        }
      }
      .text {
        font-size: 28px;
        line-height: 40px;
        .name {
          margin-bottom: 10px;
          color: #fff;
        }
        .desc {
          color: rgba(255, 255, 255, 0.3);
        }
      }
    }
  }
}
</style>
