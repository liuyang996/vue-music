<template>
    <div class="song-list">
        <ul>
            <li @click="selectItem(song,index)" v-for="(song,index) in songs" :key="index" class="item">
                <div class="song-rank" v-show="rank">
                    <span :class="getrankCls(index)">{{getrankText(index)}}</span>
                </div>
                <div class="content">
                    <h2 class="name">{{song.name}}</h2>
                    <p class="desc">{{getDesc(song)}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props:{
        songs:{
            type: Array
        },
        rank:{
            type: Boolean,
            default: false
        }
    },
    methods:{
        getDesc(song) {
            return `${song.singer}-${song.album}`;
        },
        selectItem(item,index) {
            this.$emit('select',item,index);
        },
        getrankCls(index) {
            if(index <= 2) {
                return `icon icon${index}`
            } else {
                return `text`
            }
        },
        getrankText(index) {
            if(index > 2) {
                return index+1;
            }
        }
    }
}
</script>

<style lang="scss">
    .song-list{
        .item{
            display: flex;
            align-items: center;
            height: 128px;
            font-size: 14px; /*no*/
            .song-rank{
                flex: 0 0 50px;
                width: 50px;
                margin-right: 60px;
                text-align: center;
                .icon{
                    width: 50px;
                    height: 48px;
                    display: inline-block;
                    &.icon0{
                        background: url(./first@2x.png) no-repeat;
                        background-size: cover;
                    }
                    &.icon1{
                        background: url(./second@2x.png) no-repeat;
                        background-size: cover;
                    }
                    &.icon2{
                        background: url(./third@2x.png) no-repeat;
                        background-size: cover;
                    }
                }
                .text{
                    color:#ffcd32;
                    font-size: 18px; /*no*/
                }
            }
            .content{
                flex: 1;
                line-height: 40px;
                overflow: hidden;
                .name{
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    color: #fff;
                }
                .desc{
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    margin-top: 8px;
                    color: rgba(255,255,255,0.3);
                }
            }
        }
    }
</style>
