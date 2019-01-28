<template>
    <div class="rank" ref="rank">
        <scroll class="toplist" ref="toplist" :data="topList">
            <ul>
                <li class="item" @click="selectItem(item)" v-for="(item,index) in topList" :key="index">
                    <div class="icon">
                        <img src="" width="100" height="100" v-lazy="item.picUrl">
                    </div>
                    <ul class="songlist">
                        <li class="song" v-for="(song,songIndex) in item.songList" :key="songIndex" >
                            <span>{{songIndex+1}}</span>
                            <span>{{song.songname}} - {{song.singername}}</span>
                        </li>
                    </ul>
                </li>
            </ul>
             <div class="loading-container" v-show="!topList.length">
                <loading></loading>
            </div>
        </scroll>
        <router-view></router-view>
    </div>
</template>

<script>
import {getTopList} from 'api/rank'
import {ERR_OK} from 'api/config'
import Scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import {playListMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'

export default {
    mixins: [playListMixin],
    data() {
        return {
            topList: []
        }
    },
    created() {
        this._getTopList();
    },
    methods: {
        handlePlaylist(playlist) {
            const bottom = playlist.length ? '120px':'';
            this.$refs.rank.style.bottom = bottom;
            this.$refs.toplist.refresh();
        },
        _getTopList() {
            getTopList().then(res => {
                console.log(res);
                if(res.code === ERR_OK) {
                    console.log(res.data.topList);
                    this.topList = res.data.topList;
                }
            })
        },
        selectItem(item) {
            console.log(item);
            this.$router.push({
                path:`/rank/${item.id}`
            })
            this.setTopList(item);
            
        },
        ...mapMutations({
            setTopList:'SET_TOP_LIST'
        })
    },
    components: {
        Scroll,
        loading
    }
}
</script>

<style lang="scss">
.rank{
    position: fixed;
    width: 100%;
    top: 172px;
    bottom: 0; 
    .toplist{
        height: 100%;
        overflow: hidden;
        .item{
            display: flex;
            margin: 0 40px;
            padding-top: 40px;
            height: 200px;
            .icon{
                width: 200px;
                height: 200px;
                flex: 0 0 200px;
            }
            .songlist{
                flex: 1;
                display: flex;
                justify-content: center;
                flex-direction: column;
                padding: 0 40px;
                height: 200px;
                overflow: hidden;
                background: #333;
                color: rgba(255,255,255,0.3);
                font-size: 12px; /*no*/
                .song{
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    line-height: 54px;
                }
            }
        }
    }
    .loading-container{
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
    }
}

</style>
