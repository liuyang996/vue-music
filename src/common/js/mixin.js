import {mapGetters,mapMutations,mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

export const playListMixin = {
    computed: {
        ...mapGetters([
            'playList'
        ])
    },
    mounted() {
        
    },
}

export const playerMixin = {
    computed: {
        iconMode() {
            return this.mode === playMode.sequence ? 'icon-sequence': this.mode === playMode.loop ? 'icon-loop' : 'icon-random';
        },
        ...mapGetters([
            'playlist',
            'sequenceList',
            'mode',
            'currentSong'
        ])
    },
    methods: {
        changeMode() { //改变模式
            const mode  = (this.mode + 1) % 3;
            this.setMode(mode);
            let list = null;
            if (mode === playMode.random) {
                list = shuffle(this.sequenceList);
            } else{
                list = this.sequenceList;
            }
             this.resetCurrentIndex(list);
             this.setPlayList(list);
        },
        resetCurrentIndex(list) {
            let index = list.findIndex((item) => {
                return item.id  === this.currentSong.id;
            })
            this.setCurrentIndex(index);
        },
        ...mapMutations({
            setCurrentIndex:'SET_CURRENT_INDEX',
            setMode:'SET_MODE',
            setPlayList:'SET_PLAYLIST'
        })
    },
}