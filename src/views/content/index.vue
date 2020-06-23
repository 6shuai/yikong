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
                    <el-button size="small" :type="params.groupType==0 ? 'info': ''" @click="params.groupType=0;init()">品牌</el-button>
                    <el-button size="small" :type="params.groupType==1 ? 'info': ''" @click="params.groupType=1;init()">创建时间</el-button>
                    <el-button size="small" :type="params.groupType==2 ? 'info': ''" @click="params.groupType=2;init()">计划开始</el-button>
                    <el-button size="small" :type="params.groupType==3 ? 'info': ''" @click="params.groupType=3;init()">计划结束</el-button>
                </el-button-group>
            </div>
            <el-input 
                prefix-icon="el-icon-search" 
                clearable
                v-model="params.name" 
                placeholder="资源名称" size="small"
                @input="init"
            ></el-input>
        </div>

        <!-- 资源列表 -->
        <div v-if="!dataLoading && !resData.length" style="margin: 20px;text-align:center">
            暂无数据~
        </div>
        <div v-else class="place-content" v-loading="dataLoading">
            <div class="group-wrap" v-for="(group, groupIndex) in resData" :key="groupIndex">
                <div class="group-title text-hover" @click="group.hide=!group.hide; $set(resData, groupIndex, group)">
                    <font-awesome-icon :icon="['fas', 'caret-down']" :rotation="group.hide ? '270' : '0'" />
                    <span>{{group.groupName}} ({{group.groupSize}})</span>
                </div>
                <div class="place-box" v-show="!group.hide">
                    <div class="place-p" :style="{width: placeW}" v-for="(item, index) in group.groupData" :key="index">
                        <content-list :item="item" :index="index" :groupIndex="groupIndex" :imageH="imageH"></content-list>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import { contentList } from '@/api/content';
import { screenSizeWatch } from '@/mixins';
import ContentList from '@/views/content/components/ContentList';
export default {
    mixins: [screenSizeWatch],
    data(){
        return {
            sort: 1,
            showList: true,
            dataLoading: false,
            resData: [],
            params: {
                userId: this.$store.state.user.loginData.id,
                groupType: 0
            },
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init(){
            this.dataLoading = true;
            contentList(this.params).then(res => {
                this.dataLoading = false;
                if(res.code === this.$successCode){
                    this.resData = res.obj;
                }
            })
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
            .el-input{
                display: inline-block;
                width: 200px;
                margin-left: 10px;
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