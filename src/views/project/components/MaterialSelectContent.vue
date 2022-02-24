<!--
 * @Author: liushuai
 * @Date: 2022-02-11 18:43:27
 * @LastEditors: liushuai
 * @LastEditTime: 2022-02-14 11:04:10
 * @Description: file content
 * @FilePath: \pclient\src\views\home\components\MaterialSelectOrAddContent.vue
-->
<template>
    <el-dialog
        class="create-material-content"
        width="925px"
        title="选择内容"
        :visible.sync="showSelectContent"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
    >   

        <div class="search-wrap mb10">
            <el-radio-group size="small" @change="handleSearchContent" v-model="contentSearchParams.contentType">
                <el-radio-button :label="1">图片</el-radio-button>
                <el-radio-button :label="2">视频</el-radio-button>
                <el-radio-button :label="4">图集</el-radio-button>
                <el-radio-button :label="3">游戏</el-radio-button>
                <el-radio-button :label="5">直播</el-radio-button>
            </el-radio-group>

            <el-input
                clearable
                class="w220 ml10"
                size="small"
                placeholder="内容名称"
                v-model="contentSearchParams.displayName"
                @input="$debounce(handleSearchContent)"
            ></el-input>
        </div>

        <div 
            class="content-wrap"
            v-loading="dataLoading"
        >
            <el-card 
                class="item"
                v-for="(item, index) in contentData"
                :key="index"
                @click.native="selectContent(item)"
            >   

                <!-- 已选中 -->
                <div 
                    class="selected"
                    v-show="selectedContent.id === item.id"
                >
                    <i class="el-icon-success"></i>
                </div>

                <el-image fit="cover" :src="item.image"></el-image>
                <p class="overflow">{{ item.displayName }}</p>
                <p class="duration" v-if="item.duration">
                    <font-awesome-icon :icon="['far', 'clock']" />
                    {{
                        item.duration
                    }}秒
                </p>
            </el-card>
        </div>

        <!-- 分页 -->
        <el-pagination
            class="mt10 mb10"
            background
            hide-on-single-page
            layout="total, prev, pager, next"
            :page-size="contentSearchParams.pageSize"
            :current-page="Number(contentSearchParams.pageNo)"
            @current-change="handleCurrentChange"
            :total="contentTotalCount"
        ></el-pagination>

        <span slot="footer" class="dialog-footer">
            <el-button @click="showSelectContent = false">取 消</el-button>
            <el-button
                :disabled="selectedContent.id ? false : true"
                type="primary"
                @click="handleSaveContent"
                >确 定</el-button
            >
        </span>
    </el-dialog>
</template>

<script>
import { timelineContentList } from "@/api/timeline"


export default {
    data() {
        return {
            showSelectContent: false,
            
            // 内容列表
            contentData: [],

            // 内容加载中
            dataLoading: false,

            // 选中的内容 
            selectedContent: {},

            // 内容搜索项
            contentSearchParams: {},

            // 内容总数
            contentTotalCount: 0
        }
    },
    methods: {
        // 显示选择内容窗口
        showSelectContentDialog(){
            this.showSelectContent = true
            this.contentSearchParams = {
                pageNo: 1,
                pageSize: 40,
                contentType: 1, //contentType 1 图片 2 视频 3 互动 4 图集
            }
            this.selectedContent = {}
            this.getContentData()
        },

        // 获取内容列表
        getContentData(){
            this.dataLoading = true
            timelineContentList(this.contentSearchParams).then(res => {
                this.dataLoading = false
                if(res.code === this.$successCode){
                    let { list, totalRecords } = res.obj
                    this.contentData = list
                    this.contentTotalCount = totalRecords
                }
            })
        },

        // 内容搜索
        handleSearchContent(){
            this.contentSearchParams = {
                ...this.contentSearchParams,
                pageNo: 1
            }
            this.getContentData()
        },

        // 分页
        handleCurrentChange(page){
            this.contentSearchParams.pageNo = page
            this.getContentData()
        },

        // 选择内容
        selectContent(data){
            this.selectedContent = data
        },

        // 保存选中内容
        handleSaveContent(){
            this.showSelectContent = false
            this.$emit('selectResult', this.selectedContent)
        }
    },
}
</script>

<style lang="scss">
    .create-material-content{
        .content-wrap{
            display: flex;
            flex-wrap: wrap;

            .item{
                width: 100px;
                margin: 0 10px 10px 0;
                cursor: pointer;
                transition: all .3s;
                position: relative;

                &:hover{
                    transform: scale(1.1);
                }

                .selected{
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    z-index: 9;
                    background: rgba($color: #000000, $alpha: 0.3);

                    i{
                        font-size: 25px;
                        color: var(--color-info);
                        margin: 10px;
                    }
                }

                .el-image{
                    width: 100px;
                    height: 60px;
                }

                .el-card__body{
                    padding: 0;
                }

                p{
                    padding: 10px;
                    font-size: 12px;
                    line-height: 14px;
                    padding: 2px;
                }
            }
        }
    }
</style>
