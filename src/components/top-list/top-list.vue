<template>
    <transition name="slide">
        <music-list :title="title" :rank="rank" :bgImage="bgImage" :songs="songs"></music-list>
    </transition>
</template>

<script>
import MusicList from '@/components/music-list/music-list'
import {getMusicList} from 'api/rank'
import {mapGetters} from 'vuex'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
export default {
     components: {
        MusicList
    },
    data() {
        return {
            songs: [],
            rank: true
        }
    },
    computed: {
        title() {
            return this.topList.topTitle
        },
        bgImage() {
            if(this.songs.length) {
                return this.songs[0].image;
            }
            return ''
        },
        ...mapGetters([
            'topList'
        ])
    },
    created() {
        this._getMusicList();
    },
     methods: {
        _getMusicList() {
            if(!this.topList.id) {
                this.$router.push({
                    path:'/rank'
                })
                return;
            }
            getMusicList(this.topList.id).then(res => {
                console.log(res);
                if (res.code === ERR_OK) {
                    this.songs = this._normalizeSongs(res.songlist);
                }
            })
        },
        _normalizeSongs(list) {
            let ret = [];
            list.forEach(item => {
                const musicData = item.data;
                if (musicData.albumid && musicData.songid) {
                    ret.push(createSong(musicData));
                }
            });
            return ret;
        }
    }
}
</script>

<style lang="scss">
.slide-enter-acitive,.slide-leave-acitive {
    transition: all 0.3s;
}
.slide-enter,.slide-leave-to {
    transform: translate3d(100%,0,0);
}
</style>
