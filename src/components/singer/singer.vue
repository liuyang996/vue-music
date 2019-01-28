<template>
    <div class="singer" ref="singer">
        <list-view :data="singers" @select="select" ref="list"></list-view>
        <router-view></router-view>
    </div>
</template>

<script>
import {getSingerList} from 'api/singer'
import {ERR_OK} from 'api/config'
import Singer from 'common/js/singer'
import { mapMutations } from 'vuex'
import {playerMixin} from 'common/js/mixin'

const HOT_SINGER_LEN = 10
const HOT_NAME = '热门'
export default {
    mixins:[playerMixin],
    data() {
        return {
            singers: []
        }
    },
    methods: {
         handlePlaylist(playlist) {
            const bottom = playlist.length > 0 ? '60px': '';
            this.$refs.singer.$el.style.bottom = bottom;
            this.$refs.list.refresh();
        },
        _getSingerList() {
            getSingerList().then((res) => {
                if(res.code === ERR_OK){
                    // console.log(res.data.list);
                    this.singers = this._normalizeSinger(res.data.list);
                }
            })
        },
        //处理转化数据函数
        _normalizeSinger(list) {
            let map = {
                hot:{
                    title:HOT_NAME,
                    items:[]
                }
            }
            list.forEach((item,index) => {
                if(index<HOT_SINGER_LEN){
                     map.hot.items.push( new Singer({
                        id:item.Fsinger_mid,
                        name:item.Fsinger_name
                    }))
                }
                const key = item.Findex;
                //map里没有 key则，添加map[key]
                if(!map[key]){
                    map[key] = {
                        title:key,
                        items:[]
                    }
                }
                map[key].items.push(new Singer({
                    id:item.Fsinger_mid,
                    name:item.Fsinger_name
                }))
            });
            //为了得到有序列表，我们需要处理map
            let ret = [];
            let hot = [];
            for(let key in map) {
                let val = map[key];
                if(val.title.match(/[a-zA-Z]/)) {
                    ret.push(val);
                }else if(val.title === HOT_NAME){
                    hot.push(val);
                }
            }
            ret.sort((a,b) => {
                 return a.title.charCodeAt(0) - b.title.charCodeAt(0)       
            })
            return [...hot,...ret];
        },
        select(singer) {

            console.log(singer);
            this.$router.push({
                    path:`/singer/${singer.id}`
            })
            this.setSinger(singer);
        },
        ...mapMutations({
            setSinger: 'SET_SINGER'
        })
    },
    created() {
        this._getSingerList();
    },
    components: {
        listView: () => import('base/listview/listview'),
        // singerDetail: () => import('@/components/singer-detail/singer-detail')
    }
}
</script>

<style lang="scss">
.singer{
    position: fixed;
    top: 176px;
    bottom: 0;
    width: 100%;
}

</style>
