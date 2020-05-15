<template>
    <div class="app-main-wrap content-list-wrap" id="app-main-wrap">
        <div class="content-top">
            <el-button 
                class="created-btn"
                type="primary" 
                icon="el-icon-plus" 
                @click="$router.push('/content/add')"
                size="small">
                创建资源
            </el-button>
            <div class="sort">
                <span class="sort-title">排列</span>
                <el-button-group>
                    <el-button size="small" :type="sort==1 ? 'info': ''" @click="sort=1">品牌</el-button>
                    <el-button size="small" :type="sort==2 ? 'info': ''" @click="sort=2">创建时间</el-button>
                    <el-button size="small" :type="sort==3 ? 'info': ''" @click="sort=3">计划开始</el-button>
                    <el-button size="small" :type="sort==4 ? 'info': ''" @click="sort=4">计划结束</el-button>
                </el-button-group>
            </div>
        </div>

        <!-- 资源列表 -->
        <div v-if="!dataLoading && !resData.length" style="margin: 20px;text-align:center">
            暂无数据~
        </div>
        <div v-else class="place-content" v-loading="dataLoading">
            <div class="group-wrap">
                <div class="group-title text-hover" @click="showList=!showList">
                    <font-awesome-icon :icon="['fas', 'caret-down']" :rotation="!showList ? '270' : '0'" />
                    <span>小风景 (2)</span>
                </div>
                <div class="place-box" v-show="showList">
                    <div class="place-p" :style="{width: placeW}" v-for="(item, index) in resData" :key="index">
                        <content-list :item="item" :imageH="imageH"></content-list>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import ContentList from '@/views/content/components/Content-list';
import { screenSizeWatch } from '@/mixins';
export default {
    mixins: [screenSizeWatch],
    data(){
        return {
            sort: 1,
            showList: true,
            dataLoading: false,
            resData: [{}, {}]
        }
    },
    components: {
        ContentList
    }
}
</script>
<style lang="scss" scope>
    .content-list-wrap{
        .content-top{
            padding-bottom: 20px;
            .created-btn{
                margin-right: 20px;
            }
            .sort{
                display: inline-block;
                &-title{
                    color: #999;
                    margin-right: 5px;
                    font-size: 14px;
                }
            }
        }
        .group-title{
            line-height: 24px;
            color: #4c4c4c;
            margin-bottom: 12px;
            cursor: pointer;
            &:hover{
                color: red;
            }
            span{
                margin-left: 5px;
            }
        }
    }
</style>