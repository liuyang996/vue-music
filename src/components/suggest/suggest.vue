<template>
    <Scroll class="suggest" 
            :data="result" 
            :pullup="pullup"
            @scrollToEnd="searchMore"
            ref="suggest">
        <ul class="suggest-list">
            <li class="suggest-item" @click="selectItem(item)" v-for="item in result">
                <div class="icon">
                    <i :class="getIconCls(item)"></i>
                </div>
                <div class="name">
                    <p class="text" v-html="getDisplayName(item)"></p>
                </div>
            </li>
            <loading v-show="hasMore" title=""></loading>
        </ul>
        <router-view></router-view>
    </Scroll>
</template>

<script>
import {search} from 'api/search'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import Singer from 'common/js/singer'
import {mapMutations,mapActions} from 'vuex'
const perpage = 20
const TYPE_SINGER = 'singer'
export default {
    props: {
        showSinger: {
            type: Boolean,
            default: true
        },
        query: { 
            type: String,
            default: ''
        }

    },
    data() {
        return {
            page: 1,
            result: [],
            pullup: true,
            hasMore: true
        }
    },
    created() {
        // this._search();
    },
    watch: {
        query() {
            this._search();
        }
    },
    methods: {
        _search() {
            this.page = 1;
            this.hasMore = true;
            this.$refs.suggest.scrollTo(0,0);
            search(this.query,this.page,this.showSinger,perpage).then(res => {
                if(res.code === ERR_OK) {
                    this.result = this._grenResult(res.data);
                    this._checkMore(res.data);
                }
            })
        },
        _grenResult(data) {
            let ret = [];
            if (data.zhida && data.zhida.type) {
                ret.push({...data.zhida,...{type:TYPE_SINGER}});
            };
            if(data.song) {
                ret = ret.concat(this._normalizeSongs(data.song.list));   
            }
            return ret;
        },
        _normalizeSongs(list) {
            let ret = [];
            list.forEach(musicData => {
                if(musicData.songid && musicData.albumid) {
                    ret.push(createSong(musicData));
                }
            });
            return ret;
        },
        _checkMore(data) {
            const song = data.song;
            if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
                this.hasMore = false;
            } 
        },
        getIconCls(item) {
            if (item.type === TYPE_SINGER) {
                return 'icon-mine'
            } else {
                return 'icon-music'
            }
        },
        getDisplayName(item) {
            if (item.type === TYPE_SINGER) {
                return item.singername;
            } else {
                return `${item.name}-${item.singer}`;
            }
        },
        searchMore() {
            if(!this.hasMore) {
                return;
            }
            this.page++;
            search(this.query,this.page,this.showSinger,perpage).then(res => {
                if(res.code === ERR_OK) {
                    this.result = this.result.concat(this._grenResult(res.data));
                    this._checkMore(res.data);
                }
            })
        },
        selectItem(item) {
            console.log(item);
            if (item.type === TYPE_SINGER) {
                const singer = new Singer({
                    id:item.singermid,
                    name:item.singername
                })
                this.$router.push({
                    path:`/search/${item.singerid}`
                })
                this.setSinger(singer);
            } else {
                this.insertSong(item);
            }
        },
        ...mapMutations({
            setSinger:'SET_SINGER'
        }),
        ...mapActions(['insertSong'])
    },
    components:{
        Scroll,
        loading
    }
}
</script>

<style lang="scss">
.suggest{
    height: 100%;
    overflow: hidden;
    .suggest-list{
        padding: 0 60px;
        .suggest-item{
            display: flex;
            align-items: center;
            padding-bottom: 40px;
            .icon{
                flex: 0 0 60px;
                width: 60px;
                color: rgba(255,255,255,0.3); 
                font-size: 14px;
            }
            .name{
                flex: 1;
                color: rgba(255,255,255,0.3); 
                // font-size: 14px; /*no*/
                overflow: hidden;
                .text{
                    display: inline-block;
                }
            }
        }
    }
}
</style>
