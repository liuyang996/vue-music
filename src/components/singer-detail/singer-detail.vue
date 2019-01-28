<template>
    <transition name="slide">
        <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
    </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK} from 'api/config'
import { createSong } from 'common/js/song'
export default {
    data() {
        return {
            songs:[],
        }
    },
    computed: {
        title() {
            return this.singer.name;
        },
        bgImage() {
            return this.singer.avatar;
        },

        ...mapGetters(['singer'])
    },
    created() {
        // console.log(this.singer);
        this._getDetail();
    },
    methods: {
        _getDetail() {
            if(!this.singer.id) {
                this.$router.push({
                    path:'/singer'
                })
                return;
            }
            getSingerDetail(this.singer.id).then(res => {
                if(res.code === ERR_OK){
                    console.log(res.data.list);
                    this.songs = this._normalizeSongs(res.data.list);
                    console.log(this.songs)
                }
            })
        },
        _normalizeSongs(list) {
            let ret = [];
            list.forEach(item => {
                let {musicData} = item;
                if(musicData.songid && musicData.albummid) {
                    ret.push(createSong(musicData))
                }
            });
            return ret;
        }
    },
    components:{
        musicList: () => import('@/components/music-list/music-list'),
    }
}
</script>

<style lang="scss">
    .slide-enter-active, .slide-leave-active{
        transition: all .5s;
    }
    .slide-enter,.slide-leave-to{
        transform: translate3d(100%,0,0);
    }
    
</style>
