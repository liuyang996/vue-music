<template>
    <div class="player" v-show="playList.length>0">
        <transition name="normal"
                    @enter="enter"
                    @after-enter="afterEnter"
                    @leave="leave"
                    @after-leave="afterLeave"    
        >
            <div class="normal-player" v-show="fullScreen">
                <div class="background">
                    <img :src="currentSong.image" width="100%" height="100%">
                </div>
                <div class="top">
                    <div class="back" @click="back">
                        <i class="icon-back"></i>
                    </div>
                    <h1 class="title" v-html="currentSong.name"></h1>
                    <h2 class="subtitle" v-html="currentSong.singer"></h2>
                </div>
                <!-- 中间cd部分 -->
                <div class="middle"
                  @touchstart.prevent="middleTouchStart"
                  @touchmove.prevent="middleTouchMove"
                  @touchend="middleTouchEnd"
                >
                    <div class="middle-l" ref="middleL">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <div class="cd" :class="cdCls">
                                <img class="image" :src="currentSong.image">
                            </div>
                        </div>
                    </div>
                    <!-- 歌词滚动 -->
                    <Scroll :data="currentLyric && currentLyric.lines" class="middle-r" ref="lyricList">
                        <div class="lyric-wrapper">
                            <div v-if="currentLyric">
                                <p ref="lyricLine"
                                  class="text" :class="{'current':currentLine === index}" 
                                  v-for="(line,index) in currentLyric.lines"
                                  :key="index"
                                  >{{line.txt}}</p>
                            </div>
                        </div>
                    </Scroll>
                </div>
                <!-- 底部按钮控制部分 -->
                <div class="bottom">
                    <div class="dot-wrapper">
                        <span class="dot" :class="{'active':currentShow === 'cd'}"></span>
                        <span class="dot" :class="{'active':currentShow === 'lyric'}"></span>
                    </div>
                    <div class="progress-wrapper">
                        <span class="time time-l">{{format(currentTime)}}</span>
                        <div class="progress-bar-wrapper">
                            <progressBar :percent="percent" @percentChange="onProgressBarChange"></progressBar>
                        </div>
                        <span class="time time-r">{{format(currentSong.duration)}}</span>
                    </div>
                    <div class="operators">
                        <div class="icon i-right" @click="changeMode">
                            <i :class="iconMode"></i>
                        </div>
                        <div class="icon i-right" :class="disableCls">
                            <i @click="prev" class="icon-prev" ></i>
                        </div>
                        <div class="icon i-center" :class="disableCls">
                            <i @click="togglePlaying" :class="playIcon"></i>
                        </div>
                        <div class="icon i-left" :class="disableCls">
                            <i @click="next" class="icon-next" ></i>
                        </div>
                        <div class="icon i-left">
                            <i class="icon icon-not-favorite"></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini">
            <div class="mini-player" v-show="!fullScreen" @click="open">
                <div class="icon">
                    <img :src="currentSong.image" width="40" height="40" :class="cdCls" >
                </div>
                <div class="text">
                    <h2 class="name" v-html="currentSong.name"></h2>
                    <p class="desc" v-html="currentSong.singer"></p>
                </div>
                <div class="control">
                    <progress-circle :radius="radius" :percent="percent">
                        <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
                    </progress-circle>
                </div>
                <div class="control">
                    <i class="icon-playlist"></i>
                </div>
            </div>
        </transition>
        <audio ref="audio" @play="ready" @error="error" @ended="end" @timeupdate="updateTime"  :src="currentSong.url"></audio>
    </div>
</template>

<script>
import { mapGetters,mapMutations } from 'vuex'
import animations from 'create-keyframe-animation'
import {prefixStyle} from 'common/js/dom'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {playerMixin} from 'common/js/mixin'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
    mixins: [playerMixin],
    data() {
        return {
            songReady:false,
            currentTime:0,
            radius: 32,
            currentLyric: null,
            currentLine: 0,
            currentShow:'cd'
        }
    },
    computed: {
        cdCls() {
            return this.playing ?'play': 'play pause';
        },
        playIcon (){
            return this.playing ?'icon-pause': 'icon-play';
        },
        miniIcon (){
            return this.playing ?'icon-pause-mini': 'icon-play-mini';
        },
        disableCls() {
            return this.songReady ? '': 'disable'
        },
        percent() { //计算比率
            return this.currentTime / this.currentSong.duration
        },
        ...mapGetters([
            'fullScreen',
            'playList',
            'currentSong',
            'playing',
            'currentIndex',
            'mode',
            'sequenceList'
            ]),
    },
    watch: {
        playing(newPlaying) { //监听播放状态
            console.log(newPlaying);
            const audio = this.$refs.audio;
            this.$nextTick(() =>{
                newPlaying ? audio.play() : audio.pause();
            })
        },
        currentSong(newSong,oldSong) { //监听音乐改变
            if( newSong.id === oldSong.id) {
                return;
            }

            //防止歌词切换跳动
            if(this.currentLyric) {
                this.currentLyric.stop();
            }
            clearTimeout(this.timer);
            this.timer = setTimeout(()=> {
                this.$refs.audio.play();
                this.getLyric();
            },1000)
        }

    },
    created() {
        this.touch = {};
    },
    methods: {
        back() {
            this.setFullScreen(false);
        },
        open() {
            this.setFullScreen(true);
        },
        // 监听audio标签播放结束时
        end() {
            console.log('播放结束')
            if(this.mode === playMode.loop) {
                this.loop();
            } else {
                this.next();
            }
        },
        loop() { //循环播放
            this.$refs.audio.currentTime = 0;
            this.$refs.audio.play();
            
            // 循环播放 歌词回到开始的时候
            if (this.currentLyric) {
                this.currentLyric.seek(0);
            }
        },
        prev() {  //上一首
            if(!this.songReady) {
                return;
            }
            if (this.playList.length === 1){
                this.loop()
            } else {
                let index = this.currentIndex - 1;
                if(index === -1) {
                  index = this.playList.length - 1;
                 }
                 this.setCurrentIndex(index);
                if(!this.playing) {
                    this.togglePlaying();
                }
            }
             this.songReady = false;
        },
        next() { //下一首
            if(!this.songReady) {
                return;
            }
            console.log(this.playList);
          
          if(this.playList.length === 1) {
              this.loop();
              return;
          } else {
              let index = this.currentIndex + 1;
              if (index === this.playList.length) {
                  index = 0;
              }
            this.setCurrentIndex(index);
            if(!this.playing) {
                this.togglePlaying();
            }
          }
          this.songReady = false;
        },
        ready() {   
            this.songReady = true;
        },
        error() {
            this.songReady = true;
        },
        updateTime(e) {   //获取音乐实时播放时间
            this.currentTime = e.target.currentTime;
        },
        format(interval) { //处理时间格式
           interval = interval | 0;  //向下取整
           const minute = interval /60 | 0;
           const second = this._pad(interval % 60);
           return `${minute}: ${second}`;

        },
        onProgressBarChange(percent) { //
          const currentTime = percent * this.currentSong.duration;
          this.$refs.audio.currentTime = currentTime;
          if (!this.playing){
              this.togglePlaying();
          }
          if (this.currentLyric) {
              this.currentLyric.seek(currentTime * 1000)
          }
        },
        _pad(num,n = 2) { //个位补0
            let len = num.toString().length;
            while(len < n) {
                num = '0' + num;
                len++
            }
            return num
        },
        getLyric() {
            this.currentSong.getLyric().then((lyric) => {
                this.currentLyric = new Lyric(lyric,this.handleLyric);
                if(this.playing) {
                    this.currentLyric.play();
                }
                console.log(this.currentLyric);
            })
        },
        handleLyric({lineNum, txt}) {
            this.currentLine = lineNum;
            if(lineNum > 5) {
                let lineEl = this.$refs.lyricLine[lineNum-5];
                this.$refs.lyricList.scrollToElement(lineEl,1000);
            } else {
                this.$refs.lyricList.scrollTo(0,0,1000);
            }
        },
        enter(el, done) {
            const {x, y, scale} = this._getPosAndScale()
            let animation = {
                0: {
                    transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
                },
                60: {
                    transform: `translate3d(0,0,0) scale(1.1)`
                },
                100: {
                    transform: `translate3d(0,0,0) scale(1)`
                }
            }
        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })

        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
        afterEnter() {
            animations.unregisterAnimation('move')
            this.$refs.cdWrapper.style.animation = ''
        },
        leave(el,done) {
            this.$refs.cdWrapper.style.transition = 'all 0.4s'
            const {x, y, scale} = this._getPosAndScale()
            this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
            this.$refs.cdWrapper.addEventListener('transitionend', done)

        },
        afterLeave() {
            this.$refs.cdWrapper.style.transition = ''
            this.$refs.cdWrapper.style[transform] = ''
        },
        togglePlaying() { //控制播放 / 暂停
            if (!this.songReady) {
                return;
            }
            this.setPlayingState(!this.playing);
            if(this.currentLyric) {
                this.currentLyric.togglePlay();
            }
        },
        middleTouchStart(e) {
            this.touch.initiated = true;
            const touch = e.touches[0];
            this.touch.startX = touch.pageX;
            this.touch.startY = touch.pageY;
        },
        middleTouchMove(e) {
            // 没有touchstart 返回
            if(!this.touch.initiated) {
                return
            }
            const touch = e.touches[0];
            const deltaX = touch.pageX - this.touch.startX;
            const deltaY = touch.pageY - this.touch.startY;
            // y轴距离大于x轴距离 =>纵向滚动 => 返回
            if(Math.abs(deltaY) > Math.abs(deltaX)) {
                return;
            }
            const left = this.currentShow === 'cd' ? 0 : -window.innerWidth;
            // 滚动的距离 最大是0
            const offsetWidth = Math.min(0,Math.max(-window.innerWidth,left+deltaX));
            this.touch.percent = Math.abs(offsetWidth / window.innerWidth); 
            this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
            this.$refs.lyriclist.$el.style[transitionDuration] = 0
            this.$refs.middleL.style.opacity = 1 - this.touch.percent
            this.$refs.middleL.style[transitionDuration] = 0
        },
        middleTouchEnd() {
            let offsetWidth
            let opacity
            if(this.currentShow === 'cd') {
                if(this.touch.percent > 0.1){
                    offsetWidth = -window.innerWidth;
                    opacity = 0;
                    this.currentShow = 'lyric';
                } else {
                    offsetWidth = 0;
                    opacity = 1;
                }
            } else {
                if(this.touch.percent < 0.9) {
                    offsetWidth = 0;
                    this.currentShow = 'cd';
                    opacity = 1;
                } else {
                    offsetWidth = -window.innerWidth
                    opacity = 0;
                }
            }
            // 动画缓冲时间
            const time = 300
            this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
            this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`;
            this.$refs.middleL.style.opacity = opacity;
            this.$refs.middleL.style[transitionDuration] = `${time}ms`;
            this.touch.initiated = false
            
        },

        _getPosAndScale() {
            const targetWidth = 40;
            const paddingLeft = 40;
            const paddingBottom = 30;
            const paddingTop = 80;
            const width = window.innerWidth * 0.8;
            const scale = targetWidth / width;
            const x = -(window.innerWidth/2 - paddingLeft);
            const y = window.innerHeight - paddingTop - width/2 - paddingTop;
            return {
                x,
                y,
                scale
            }
        },
        ...mapMutations({
            setFullScreen:'SET_FULL_SCREEN',
            setPlayingState:'SET_PLAYING_STATE',
            setCurrentIndex:'SET_CURRENT_INDEX',
            setMode:'SET_MODE',
            setPlayList:'SET_PLAYLIST'
        })
    },
    components:{
        progressBar: () => import('base/progress-bar/progress-bar'),
        progressCircle: () => import('base/progress-circle/progress-circle'),
        Scroll
    }
  
}
</script>

<style lang="scss">
    .player{
        .normal-enter-active, .normal-leave-active{
             transition: all 0.4s;
             .top,.bottom{
                  transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
             }
        }
        .normal-enter, .normal-leave-to{
            opacity: 0;
            .top{
                transform: translate3d(0, -100px, 0)
            }
            .bottom{
                transform: translate3d(0, 100px, 0)
            }
        }
        .normal-player{
            position: fixed;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            z-index: 150;
            background: #222;
            .background{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                opacity: 0.6;
                filter: blur(20px);
            }
            .top{
                position: relative;
                margin-bottom: 50px;
                .back{
                    position: absolute;
                    top: 0;
                    left: 12px;
                    z-index: 50;
                    .icon-back{
                        display: block;
                        padding: 18px;
                        font-size: 44px;
                        color: #ffcd32;
                        transform: rotate(-90deg);
                    }
                }
                .title{
                    width: 70%;
                    margin: 0 auto;
                    line-height: 80px;
                    text-align: center;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    font-size: 36px;
                    color: #fff;
                }
                .subtitle{
                    line-height: 40px;
                    text-align: center;
                    font-size: 28px;
                    color: #fff;
                }
            }
            .middle{
                position: fixed;
                width: 100%;
                top: 160px;
                bottom: 350px;
                white-space: nowrap;
                font-size: 0;
                .middle-l{
                    display: inline-block;
                    vertical-align: top;
                    position: relative;
                    width: 100%;
                    height: 0;
                    padding-top: 80%;
                    .cd-wrapper{
                        position: absolute;
                        left: 10%;
                        top: 0;
                        width: 80%;
                        height: 100%;
                        .cd{
                            width: 100%;
                            height: 100%;
                            box-sizing: border-box;
                            border: 10px solid rgba(255,255,255,0.1); /*no*/
                            border-radius: 50%;
                            position: relative;
                            .image{
                                position: absolute;
                                left: 0;
                                top: 0;
                                width: 100%;
                                height: 100%;
                                border-radius: 50%;
                            }
                        }
                        .play{
                            animation: rotate 20s linear infinite;
                        }
                        .pause{
                            animation-play-state: paused;
                        }
                    }
                }
                .middle-r{
                    display: inline-block;
                    vertical-align: top;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    .lyric-wrapper{
                        width: 80%;
                        margin: 0 auto;
                        overflow: hidden;
                        text-align: center;
                        .text{
                            line-height: 64px;
                            color: rgba(255,255,255,0.5);
                            font-size: 14px; /*no*/
                        }
                        .current{
                            color: #fff;
                        }
                    }
                }
            }
            .bottom{
                position: absolute;
                bottom: 100px;
                width: 100%;
                .dot-wrapper{
                  text-align: center;
                  font-size: 0;
                  .dot{
                    display: inline-block;
                    vertical-align: middle;
                    margin: 0 8px;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.5);
                    &.active{
                      width: 40px;
                      border-radius: 10px;
                      background: rgba(255,255,255,0.8);
                    }
                  }
                }
                .progress-wrapper{
                    display: flex;
                    width: 80%;
                    margin: 0 auto;
                    padding: 10px 0;
                    .time{
                        color: #fff;
                        font-size: 12px; /*no*/
                        flex: 0 0 60px;
                        line-height: 50px;
                        width: 60px;
                    }
                    .time-l{
                        text-align: left;
                    }
                    .time-r{
                        text-align: right;
                    }
                    .progress-bar-wrapper{
                        flex: 1;
                    }
                }
                .operators{
                    display: flex;
                    align-items: center;
                    .icon{
                        flex: 1;
                        color: #ffcd32;
                        i{
                            font-size: 60px;
                        }
                    }
                    .disable{
                        color: rgba(255, 205, 49, 0.5);
                    }
                    .i-left{
                        text-align: left;
                    }
                    .i-right{
                        text-align: right;
                    }
                    .i-center{
                        text-align: center;
                        padding:  0 40px;
                    }
                }
            }
        }
        .mini-player{
            position: fixed;
            bottom: 0;
            left: 0;
            z-index: 180;
            width: 100%;
            height: 120px;
            background: #333;
            display: flex;
            align-items: center;
            .icon{
                flex: 0 0 80px;
                width: 80px;
                padding: 0 20px 0 40px;
                .play{
                    animation: rotate 10s linear infinite;
                }
                .pause{
                    animation-play-state: paused;
                }
                img{
                    border-radius: 50%;
                }
            }
            .text{
                flex: 1;
                line-height: 40px;
                .name{
                    margin-bottom: 4px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    font-size: 14px; /*no*/
                    color: #fff;
                }
                .desc{
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    font-size: 12px; /*no*/
                    color: rgba(255,255,255,0.3);
                }
            }
            .control{
                flex: 0 0 60px;
                width: 60px;
                padding: 0 20px;
                .icon-mini{
                    font-size: 32px;/*no*/
                    position: absolute;
                    left: 0;
                    top: 0;
                     color: rgba(255,205,49,0.7);
                }
                .icon-playlist{
                    font-size: 30px;/*no*/
                    color: rgba(255,205,49,0.5);
                }
            }
            .progress-circle{
                position: relative;
            }
        }
    }
    @keyframes rotate {
        0% {transform:rotate(0)};
        100% {transform: rotate(360deg)};
    }
</style>
