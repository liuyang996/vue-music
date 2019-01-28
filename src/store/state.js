import { playMode} from 'common/js/config'

const state = {
    singer: {},
    playing: false,         //播放、暂停状态
    fullScreen: false,      //播放器全屏状态
    playList: [],           //播放列表
    sequenceList: [],       //顺序列表
    mode: playMode.sequence,//播放模式
    currentIndex: -1,        //播放索引
    disc:{},
    topList:{},

}
export default state