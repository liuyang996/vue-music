<template>
    <scroll class="listview" 
        :data="data" 
        ref="listview"
        :listenScroll="listenScroll"
        :probeType="probeType"
        @scroll="scroll">
        <ul>
            <li class="list-group" v-for="(group,gindex) in data" :key="gindex" ref="listGroup">
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li @click="selectItem(item)" class="list-group-item" v-for="(item,index) in group.items" :key="index">
                        <img v-lazy="item.avatar" class="avatar" >
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart"  @touchmove.stop.prevent="onShortcutTouchMove" 
        @touchend.stop>
            <ul>
                <li class="item" v-for="item,index in shortcutList" 
                :key="index" 
                :data-index="index"
                :class="{'current':currentIndex === index}">{{item}}</li>
            </ul>
        </div>
        <div class="list-fixed" ref="fixed" v-show="fixedTitle">
            <h1 class="fixed-title">{{fixedTitle}}</h1>
        </div>
    </scroll>
</template>

<script>
/*
  左右联动总体思路
    1.实时知道滚动位置。
    2.根据滚动位置，知道落在哪一个高度区间
    3.知道落在高度区间，可以知道右侧对应索引高亮
*/
import {getData} from 'common/js/dom'
import scroll from 'base/scroll/scroll'
const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30
export default {
    props:{
        data: {
            type:Array,
            default:[],
        }
    },
    data() {
        return {
            scrollY:-1,  //滚动高度
            currentIndex:0,
            diff: -1,
        }
    },
    computed: {
        shortcutList() {
            return this.data.map((group)=>{
               return group.title.substr(0,1); 
            })
        },
        fixedTitle() {
            if(this.scrollY>0){
                return '';
            }
            return this.data[this.currentIndex] ? this.data[this.currentIndex].title:'';
        }
      
    },
    created() {
        this.probeType = 3;
        this.listenScroll = true;
        this.touch = {};
        this.listHeight = [];
        setTimeout(() => {
            this._calculateHeight();
        },20)
    },
    mounted() {
       
    },
    watch: {
        data() {
            setTimeout(() => {
                this._calculateHeight();
            },20)
        },
        scrollY(newY) {
           
           //滚动到顶部
           if (newY > 0) {
               this.currentIndex = 0;
               return
           }
           // 滚动到中间部分
            for(let i=0;i<this.listHeight.length-1;i++){
               let height1 = this.listHeight[i];
               let height2 = this.listHeight[i+1];
               if(-newY >= height1 && -newY < height2){
                   this.currentIndex = i;
                   this.diff = height2+ newY;
                   return
               }
            }
            //当滚动到底部，且-newY大于最后一个元素的上限  
            this.currentIndex = this.listHeight.length - 2;

        },
        diff(newVal) {
            let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT :0
            if(this.fixedTop === fixedTop) {
                return
            }
            this.fixedTop = fixedTop;
            this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
       }
    },
    methods: {
        selectItem(item) {
            this.$emit('select',item);
        },
          //右侧快速入口点击
        onShortcutTouchStart(e) {
            console.log('点击右侧入口');
           /*
             整体思路
             1.获取点击的index
             2.滚动到list对应的dom位置
             3..  拿到点击dom的pageY值和index存放到touch对象中
           */
            let anchorIndex = getData(e.target,'index'); 
            let firstTouch = e.touches[0];
            this.touch.y1 = firstTouch.pageY;
            this.touch.anchorIndex = anchorIndex;
            console.log(anchorIndex);
            this._scrollTo(anchorIndex); 
        },
        // 右侧快速入口滑动
        onShortcutTouchMove(e) {
           /*
             整体思路
             1. 获取点击时拿到的pagey值
             2. 获取滑动结束时拿到的pagey值
             3. 两值计算得出相差的index 
             4. 最终index = 点击得到的index + 相差index
           */
          let firstTouch =  e.touches[0];
          this.touch.y2 = firstTouch.pageY;
          let delta = (this.touch.y2-this.touch.y1) / ANCHOR_HEIGHT | 0;
          let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
          this._scrollTo(anchorIndex); 
        },
        //计算高度
        _calculateHeight() {
            this.listHeight = [];
            const list = this.$refs.listGroup;
            let height = 0;
            this.listHeight.push(height);
            for(let i = 0;i<list.length;i++){
                let item = list[i];
                height+=item.clientHeight;
                this.listHeight.push(height);
            }
            // console.log('this.listHeight');
            // console.log(this.listHeight);
        },
        refresh() {
            this.$refs.listview.refresh();
        },
        scroll(pos) {
            // console.log(pos.y);
            this.scrollY = pos.y;
        },
        _scrollTo(index) {
            if (!index && index !== 0) {
                return
            }
            if(index<0) {
                index = 0; 
            }else if (index > this.listHeight.length -2) {
                console.log(this.listHeight);
                index = this.listHeight.length-2;
            }
            this.scrollY = -this.listHeight[index];
            this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0);
        },
        refresh() {
          this.$refs.listview.refresh();
        },
    },
    
    components:{
        // scroll: () => import('base/scroll/scroll')
        scroll
    }
}
</script>

<style lang="scss">
.listview {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #222;
    .list-group{
        padding-bottom: 60px;
        .list-group-title{
            height: 60px;
            line-height: 60px;
            padding-left: 40px;
            font-size: 24px;
            color: rgba(255,255,255,0.5);
            background: #333;
        }
        .list-group-item{
            display: flex;
            align-items: center;
            padding: 40px 0 0 60px;
            .avatar{
                width: 100px;
                height: 100px;
                border-radius: 50%;
            }
            .name{
                margin-left: 40px;
                color: rgba(255,255,255,0.5);
                font-size: 28px;
            }
            
        }
    }
    .list-shortcut{
        position: absolute;
        z-index: 30;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 40px;
        padding: 40px 0;
        border-radius: 20px;
        text-align: center;
        background: rgba(0,0,0,0.3);
        font-family: Helvetica;
        .item{
            line-height: 36px;
            color: rgba(255,255,255,0.5);
            font-size: 24px;
            height: 36px;
            &.current{
                color: #ffcd32;
            }
        }
    }
    .list-fixed{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        .fixed-title{
            height: 60px;
            line-height: 60px;
            padding-left: 40px;
            font-size: 24px;
            color: rgba(255,255,255,0.5);
            background: #333;
        }
    }
}
</style>
