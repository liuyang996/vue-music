<template>
    <div ref="wrapper">
        <slot></slot>
    </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
    props: {
        probeType: {   //滚动位置，参数为：1、2、3。具体内容可查better-scroll文档，以下也是。
            type: Number,
            default: 1,
        },
        click: { // 是否派发点击事件
            type: Boolean,
            default: true
        },
        data: {  //数据，用来重新计算better-scorll。
            type: Array,
            default: null
        },
        listenScroll: {  //是否监听scroll事件
            type:Boolean,
            default:false,
        },
        pullup: {  //是否派发顶部下拉的事件，用于下拉刷新
            type: Boolean,
            default: false 
        }
    },
    watch: {
        data() {
            setTimeout(()=> {
                this.refresh();
            },20)
        }
    },
    mounted() {
        setTimeout(()=> {
            console.log('初始化');
            this._initScroll();
        },20)
    },
    methods: {
        _initScroll() {
            if(! this.$refs.wrapper) {
                return;
            }
            this.scroll = new BScroll(this.$refs.wrapper, {
                probeType: this.probeType,
                click: this.click
            })
            if(this.listenScroll){
                let me = this;
                this.scroll.on('scroll', (pos) => {
                    me.$emit('scroll',pos);
                })
            }

            if(this.pullup) {
                this.scroll.on('scrollEnd', () => {
                    if (this.scroll.y <= (this.scroll.maxScrollY +50)){
                        this.$emit('scrollToEnd');
                    }
                })
            }
        },
        enable() {
            this.scroll && this.scroll.enable();
        },
        disable() {
            this.scroll && this.scroll.disable();
        },
        scrollTo() {
            this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
        },
        scrollToElement() {
            this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
        },
        refresh() {
            this.scroll && this.scroll.refresh();
        }
    }
}
</script>

<style lang="scss">

</style>
