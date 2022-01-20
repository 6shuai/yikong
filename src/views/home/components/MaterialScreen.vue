<template>
    <el-dialog
        width="1000px"
        :title="contentName"
        :visible.sync="showScreenList"
        append-to-body
    >

        <!-- 查看内容在当前屏幕的播放次数 -->
        <content-detail ref="contentDetail"></content-detail>

        <el-table
            class="mt20 mb20"
            stripe
            size="small"
            :data="resData"
            row-key="id"
            v-loading="tLoading"
            border>
            <el-table-column 
                prop="screenName" 
                label="屏幕名称" 
                min-width="100"
            >
            </el-table-column>
            <el-table-column 
                prop="effectiveTime" 
                label="上刊时间" 
                min-width="60"
            ></el-table-column>
            <el-table-column 
                prop="dueTime" 
                label="下刊时间" 
                min-width="60"
            ></el-table-column>
            <el-table-column 
                prop="days" 
                label="天数" 
                min-width="60"
            ></el-table-column>
            <el-table-column 
                prop="currentTimes" 
                label="已播放次数" 
                min-width="60"
            >
                <template slot-scope="scope">
                    <el-tag
                        class="material_screen_tag"
                        size="mini"
                        type="primary"
                        plain
                        @click="$refs.contentDetail.showDialog({
                            contentId: contentId,
                            screenId: scope.row.screen
                        })"
                    >
                        {{ scope.row.currentTimes }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column 
                prop="beginTime" 
                label="操作" 
                width="100"
            >
                <template slot-scope="scope">
                    <el-popconfirm
                        confirm-button-text='删除'
                        cancel-button-text='取消'
                        icon="el-icon-info"
                        icon-color="red"
                        title="此操作将删除此条数据, 是否继续?"
                        @confirm="handleDelete(scope.row.id)"
                    >
                        <el-button 
                            type="danger" 
                            slot="reference"
                            size="mini"
                            plain
                        >
                            删除
                        </el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>

<script>
import { projectMaterialForScreenList, projectMaterialDelete } from '@/api/project'
import ContentDetail from '@/views/screen/statistics/ContentDetail'

export default {
    components: {
        ContentDetail
    },
    data(){
        return {
            showScreenList: false,

            // 内容名称
            contentName: '',

            // 内容id
            contentId: null,

            resData: [],
            tLoading: false
        }
    },
    methods: {
        // 显示物料 对应的屏幕列表
        showScreenListDialog(contentName, id){
            this.contentName = contentName
            this.contentId = id
            this.showScreenList = true
            this.getScreenList()
        },

        // 获取屏幕列表
        getScreenList(){
            let data = {
                project: this.$route.params.id,
                contentId: this.contentId
            }
            this.tLoading = true
            projectMaterialForScreenList(data).then(res => {
                this.tLoading = false
                if(res.code === this.$successCode){
                    this.resData = res.obj
                }
            })
        },

        // 删除
        handleDelete(id){
            projectMaterialDelete(id).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('删除成功~')
                    this.getScreenList()
                }
            })
        }

    }
}
</script>

<style lang="scss">
    .material_screen_tag{
        cursor: pointer;
    }
</style>