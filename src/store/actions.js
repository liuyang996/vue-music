import * as types from './mutation-types'
import { playMode } from '../common/js/config';
import { shuffle } from '../common/js/util';

function findIndex(list,song) {
    return list.findIndex((item) =>{
        return item.id === song.id
    })
}

export const selectPlay = function({commit,state},{list,index}) {
    commit(types.SET_SEQUENCELIST,list);
    if (state.mode === playMode.random) {
        let randomList = shuffle(list);
        console.log(randomList);
        commit(types.SET_PLAYLIST, randomList);
        index = findIndex(randomList, list[index]);
    } else {
        commit(types.SET_PLAYLIST, list);
    }
    
    commit(types.SET_CURRENT_INDEX, index);
    commit(types.SET_PLAYING_STATE, true);
    commit(types.SET_FULL_SCREEN, true);
}

export const randomPlay = function({commit},{list}) {
    commit(types.SET_MODE, playMode.random);
    commit(types.SET_SEQUENCELIST, list);
    let randomList = shuffle(list);
    commit(types.SET_PLAYLIST, randomList);
    commit(types.SET_CURRENT_INDEX, 0);
    commit(types.SET_FULL_SCREEN, true);
    commit(types.SET_PLAYING_STATE, true);
}

export const insertSong = function({commit,state},song) {
    let playList = state.playList.splice();
    let sequenceList = state.sequenceList.splice();
    let currentIndex = state.currentIndex;
    // 记录当前歌曲
    let currentSong = playList[currentIndex];
    // 查找当前列表中是否有待插入的歌曲并返回其索引
    let fpIndex = findIndex(playList,song);
    // 因为是插入歌曲，所以 索引+1
    currentIndex++;
    //插入这首歌到当前索引位置
    playList.splice(currentIndex,0,song);
    //如果已经包含了这首歌
    if(fpIndex > -1) {
        //如果当前插入的序号大于列表中的序号
        if(currentIndex > fpIndex){
            playList.splice(fpIndex,1);
            currentIndex--;
        } else {
            playList.splice(fpIndex +1,1)
        }
    }

    let currentSIndex = findIndex(sequenceList, currentSong) +1;
    
    let fsIndex = findIndex(sequenceList, song);

    sequenceList.splice(currentSIndex,0,song);

    if (fsIndex > -1) {
        if(currentSIndex > fsIndex) {
            sequenceList.splice(fsIndex,1);
        } else {
            sequenceList.splice(fsIndex + 1,1);
        }
    }

    commit(types.SET_PLAYLIST,playList);
    commit(types.SET_SEQUENCELIST,sequenceList);
    commit(types.SET_CURRENT_INDEX,currentIndex);
    commit(types.SET_FULL_SCREEN,true);
    commit(types.SET_PLAYING_STATE,true);

}