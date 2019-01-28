<template>
    <div class="serach-box">
        <i class="icon-search"></i>
        <input  class="box"  v-model="query" :placeholder="placeholder"/>
        <i @click="clear" class="icon-dismiss"></i>
    </div>
</template>

<script>
export default {
    props: {
        placeholder: {
            type: String,
            default: '搜索歌曲、歌单、专辑'
        }
    },
    data() {
        return {
            query: ''
        }
    },
    created() {
        this.$watch('query',function(newValue){
            this.$emit('query', newValue);
        })
    },
    methods: {
        clear() {
           this.query = ''; 
        },
        addQuery(name) {
            this.query = name;
        }
    },
    
}
</script>

<style lang="scss">
    .serach-box{
        display: flex;
        align-items: center;
        height: 40px; /*no*/
        background: #333;
        border-radius: 12px;
        width: 100%;
        padding: 0 12px;
        box-sizing: border-box;
        .icon-search{
            font-size: 24px; /*no*/
            color: #222;
        }
        .box{
            flex: 1;
            margin: 0 10px;
            line-height: 36px;
            background: #333;
            color: #fff;
            font-size: 14px; /*no*/
        }
        .icon-dismiss{
            font-size: 16px; /*no*/
            color: #222;
        }
    }
</style>
