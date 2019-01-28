<template>
    <div class="music-list">
        <div class="back" @click="back">
            <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="title"></h1>
        <div class="bg-image" :style="bgStyle" ref="bgImage">
            <dir class="play-wrapper">
                <div class="play" v-show="songs.length>0" ref="play" @click="random">
                    <i class="icon-play"></i>
                    <span class="text">随机播放全部</span>
                </div>
            </dir>
            <div class="filter" ref="filter"></div>
        </div>
        <div class="bg-layer" ref="bgLayer"></div>
        <scroll @scroll="scroll" :data="songs" :probeType="probeType" :listenScroll="listenScroll"  class="list" ref="list">
            <div class="song-list-wrapper">
                <song-list :songs="songs" :rank="rank" @select="selectItem"></song-list>
            </div>
            <div v-show="!songs.length" class="loading-container">
                <loading></loading>
            </div>
        </scroll>
    </div>
</template>

<script>
import scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import {prefixStyle} from 'common/js/dom'
import {mapActions} from 'vuex'
import {playerMixin} from 'common/js/mixin'

const TOP_HEIGHT = 80
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')
export default {
    mixins:[playerMixin],
    props:{
        title:{
            type: String,
            default: ''
        },
        bgImage:{
            type: String,
            default: ''
        },
        songs:{
            type: Array,
            default: []
        },
        rank:{
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            scrollY: 0
        }
    },
    computed:{
        bgStyle() {
            return `background-image:url(${this.bgImage})`;
        }
    },
    mounted() {
        this.imageHeight = this.$refs.bgImage.clientHeight;
        this.minTransalteY = -this.imageHeight + TOP_HEIGHT
        this.$refs.list.$el.style.top = `${this.imageHeight}px`;
    },
    created() {
        this.probeType = 3;
        this.listenScroll = true;
    },
    methods: {
        handlePlaylist(playlist) {
            const bottom = playlist.length > 0 ? '60px': '';
            this.$refs.list.$el.style.bottom = bottom;
            this.$refs.list.refresh();
        },
        scroll(pos) {
            // console.log(pos)
            this.scrollY = pos.y;
        },
        back() {
            this.$router.back()
        },
        selectItem(item,index) {
            this.selectPlay({
                list:this.songs,
                index
            })
        },
        random() { //随机播放全部
            this.randomPlay({
                list:this.songs
            })
        },
        ...mapActions([
            'selectPlay',
            'randomPlay'
        ])
    },
    watch: {
        scrollY(newY) {
            let zIndex = 0; //z-index 变量
            let scale = 1; // transform：scale变量
            let blur = 0; //高斯模糊变量
            let translateY = Math.max(this.minTransalteY,newY);
            this.$refs.bgLayer.style[transform] = `translate3d(0,${translateY}px,0)`;
            const percent = Math.abs(newY / this.minTransalteY);
           if(newY > 0) {
                // 图片放大
                scale = 1 + percent;
                zIndex = 10;
            } else {
                blur = Math.min(20, percent * 20)
            }
            this.$refs.filter.style[backdrop] = `blur(${blur}px)`

            if(newY< this.minTransalteY) {
                zIndex = 10;
                this.$refs.bgImage.style.paddingTop = 0;
                this.$refs.bgImage.style.height = `${TOP_HEIGHT}px`;
                this.$refs.play.style.display = 'none';
            }else {
                this.$refs.bgImage.style.paddingTop = '70%';
                this.$refs.bgImage.style.height = 0;
                 this.$refs.play.style.display = '';
            }
                this.$refs.bgImage.style.zIndex = zIndex;
                this.$refs.bgImage.style[transform] = `scale(${scale})`;
        }
    },
    components: {
        songList: () => import('base/song-list/song-list'),
        scroll,
        loading
    }
}
</script>

<style lang="scss">
.music-list{
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: #222;
    z-index: 100;
    .back{
       
        position: absolute;
        top: 0;
        left: 12px;
        z-index: 50;
        .icon-back{
            display: block;
            padding: 20px;
            font-size: 44px;
            color: #ffcd32;
        }
    }
    .title{
        position: absolute;
        top: 0;
        left: 10%;
        z-index: 40;
        width: 80%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        text-align: center;
        line-height: 80px;
        font-size: 36px;
        color: #fff;
    }
    .bg-image{
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 70%;
        transform-origin: top;
        background-size: cover;
        .play-wrapper{
            position: absolute;
            bottom: 20px;
            left: 0;
            z-index: 50;
            width: 100%;
            padding: 0;
            .play{
                box-sizing: border-box;
                width: 270px;
                padding: 14px 0;
                margin: 0 auto;
                text-align: center;
                border: 2px solid #ffcd32;
                color: #ffcd32;
                border-radius: 200px;
                font-size: 0;
                .icon-play{
                    display: inline-block;
                    vertical-align: middle;
                    margin-right: 12px;
                    font-size: 32px;
                }
                .text{
                    display: inline-block;
                    vertical-align: middle;
                    font-size: 24px;
                }
            }
        }
        .filter{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(7,17,27,0.4);
        }
    }
    .bg-layer{
        position: relative;
        height: 100%;
        background: #222;
    }
    .list{
        position: fixed;
        top: 0;
        bottom: 0;
        width: 100%;
        background: #222;
        .song-list-wrapper{
            padding: 40px 60px;
        }
        .loading-container{
            position: absolute;
            width: 100%;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
        }
    }
}
</style>
