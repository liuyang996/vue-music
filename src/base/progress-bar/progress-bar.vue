<template>
    <div class="progress-bar" ref="progressBar" @click="progressClick">
        <div class="bar-inner">
            <div class="progress" ref="progress"></div>
            <div class="progress-btn-wrapper" ref="progressBtn"
                @touchstart.prevent="progressTouchStart"
                @touchmove.prevent="progressTouchMove"
                @touchend="progressTouchEnd"
            >
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>
</template>

<script>

import {prefixStyle} from 'common/js/dom'
const progressBtnWidth = 32
const transform = prefixStyle('transform')

export default {
    props: {
        percent: {
            type: Number,
            default: 0
        }
    },
    created() {
        this.touch = {}  //定义一个对象用来存放progress进度条共享的值。
    },
    watch: {
        percent(newPercent) {
            // 获取线的实时长度、偏移小球的X轴
            if(newPercent >= 0 && !this.touch.initiated) {
                const barWidth = this.$refs.progressBar.clientWidth -progressBtnWidth;
                const offsetWidth =  newPercent * barWidth;
                this._offset(offsetWidth);
            } 
        }
    },
    methods: {
        progressTouchStart(e) {  //进度条按钮点击事件
            console.log(e);
            this.touch.initiated = true;
            this.touch.startX = e.touches[0].pageX;
            this.touch.left = this.$refs.progress.clientWidth;
        },
        progressTouchMove(e) { //进度条按钮滑动事件
            if(!this.touch.initiated) {
                return;
            }
            /*说明：在滑动事件中，我们得到滑动位置，pageX值，减去初次点击得到的startX值，得到滑动距离
               用touch对象的存放的left值，也就是当前进度的长度+滑动距离，得到实际偏移位置。
               我们需要考虑边界问题，如果用户往回拉，超过进度条初始位置(得到负值)，则设置为0，用Math.max控制
               同理，如果用户往前拉，超过进度条宽度，则设置为进度条宽度-小球宽度的值。
            */
            const deltaX = e.touches[0].pageX - this.touch.startX;
            console.log(this.$refs.progressBar.clientWidth);
            const offsetWidth =Math.min(this.$refs.progressBar.clientWidth -progressBtnWidth,Math.max(0,this.touch.left + deltaX));
            this._offset(offsetWidth);
        },
        progressTouchEnd() {
            this.touch.initiated = false;
            this._triggerPercent();
        },
        progressClick(e) {
            const rect = this.$refs.progressBar.getBoundingClientRect();
            const offsetWidth = e.pageX - rect.left;
            // e.offsetX 获取不对
            // this._offset(e.offsetX);
            this._offset(offsetWidth);
            this._triggerPercent();
        },
        _offset(offsetWidth) { //偏移
            // console.log(offsetWidth);
            this.$refs.progress.style.width = `${offsetWidth}px`;
            this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        },
        _triggerPercent() {  //计算比率
            const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
            const percent = this.$refs.progress.clientWidth / barWidth;
            this.$emit('percentChange',percent)
        }
    },
}
</script>

<style lang="scss">
.progress-bar{
    height: 60px;
    .bar-inner{
        position: relative;
        top: 20px;
        height: 8px;
        background: rgba(0, 0, 0, 0.3);
        .progress{
            position: absolute;
            height: 100%;
            background: #ffcd32;
        }
        .progress-btn-wrapper{
            position: absolute;
            left: -16px;
            top: -26px;
            width: 60px;
            height: 60px;
            .progress-btn{
                position: relative;
                top: 14px;
                left: 14px;
                box-sizing: border-box;
                width: 32px;
                height: 32px;
                border: 3px solid #fff;
                border-radius: 50%;
                background: #ffcd32;
            }
        }
    }
}
</style>
