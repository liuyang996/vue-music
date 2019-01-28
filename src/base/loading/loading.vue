<template>
    <div class="loading">
        <img src="./loading.gif" width="48" height="48">
        <p class="desc">{{title}}</p>
    </div>
</template>

<script>

export default {
    props: {
        title:{
            type: String,
            default: '正在载入...'
        }
    }
}
</script>

<style lang="scss">
 .loading{
     width: 100%;
     text-align: center;
     .desc{
        line-height: 40px;
        font-size: 24px;
        color: rgba(255, 255, 255, 0.5);
     }
 }
</style>
