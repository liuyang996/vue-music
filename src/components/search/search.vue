<template>
    <div class="search">
        <div class="search-box-wrapper">
            <search-box ref="searchBox" @query="onQueryChange"></search-box>
        </div>
        <div class="shortcut-wrapper" v-show="!query">
            <div class="shortcut">
                <div class="hot-key">
                    <h1 class="title">热门推荐</h1>
                    <ul>
                        <li class="item" @click="addQuery(item.k)" v-for="item in hotkey">
                            <span>{{item.k}}</span>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
        <div class="search-result" v-show="query">
            <suggest :query="query"></suggest>
        </div>
    </div>
</template>

<script>
import {getHotKey} from 'api/search'
import {ERR_OK} from 'api/config'
export default {
    data() {
        return {
            hotkey: [],
            query: '',
        }
    },
    components: {
        searchBox: () => import('base/search-box/search-box'),
        suggest: () => import('@/components/suggest/suggest')
    },
    created() {
        this._getHotKey();
    },
    methods: {
        _getHotKey() {
            getHotKey().then(res => {
                if (res.code === ERR_OK) {
                    this.hotkey = res.data.hotkey.splice(0,10);
                }
            })
        },
        addQuery(name) {
            this.$refs.searchBox.addQuery(name);
        },
        onQueryChange(query) {
            this.query = query;
        }
    },
}
</script>

<style lang="scss">
.search{
    .search-box-wrapper{
        margin: 40px;
    }
    .shortcut-wrapper{
        position: fixed;
        top: 178px; /*no*/
        bottom: 0;
        width: 100%;
        .shortcut{
            height: 100%;
            overflow: hidden;
            .hot-key{
                margin: 0 40px 40px 40px;
                .title{
                    margin-bottom: 40px;
                    font-size: 14px; /*no*/
                    color: rgba(255,255,255,0.5);
                }
                .item{
                    display: inline-block;
                    padding: 10px 20px;
                    margin: 0 40px 20px 0;
                    border-radius: 12px;
                    background: #333;
                    font-size: 14px; /*no*/
                    color: rgba(255,255,255,0.3);
                }
            }
        }
    }
    .search-result{
        position: fixed;
        top: 178px; /*no*/
        bottom: 0;
        width: 100%;
    }
}
</style>
