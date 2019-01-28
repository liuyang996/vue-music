<template>
    <div class="m-header">
        <img src="../../common/image/logo@2x.png" class="m-logo">
        <h1 class="title">Chicken Music</h1>
        <div class="user"><i class="icon-mine"></i></div>
    </div>
</template>

<script>

export default {

}
</script>

<style scoped lang="stylus">
    @import "~common/stylus/variable"
    @import "~common/stylus/mixin"
.m-header
    position: relative;
    color: #ffcd32;
    height 88px;
    display flex;
    justify-content center;
    align-items center;
    align-content center;
    .m-logo
        width 60px;
        height 64px;
        margin-right 18px;
    .title 
        display: inline-block;
        vertical-align: top;
        line-height: 88px;
        font-size: 36px;
    .user 
        position: absolute;
        top: 0;
        right: 0;
        .icon-mine
            display: block;
            padding: 24px;
            font-size: 40px;
            color: #ffcd32;
</style>
