<template>
    <el-dialog
        width="1100px"
        :visible.sync="showScreenList"
        append-to-body
    >
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
                min-width="80"
            >
                <template slot-scope="scope">
                    {{ dateAddHMS(scope.row.effectiveTime) }}
                </template>
            </el-table-column>
            <el-table-column 
                prop="dueTime" 
                label="下刊时间" 
                min-width="80"
            >
                <template slot-scope="scope">
                    {{ dateAddHMS(scope.row.dueTime) }}
                </template>
            </el-table-column>
            <el-table-column 
                prop="days" 
                label="天数" 
                min-width="60"
            ></el-table-column>
            <el-table-column 
                prop="publishedTimes" 
                label="每日播放次数" 
                min-width="60"
            ></el-table-column>
            <el-table-column 
                prop="beginTime" 
                label="操作"
                width="180"
            >   
                <template 
                    slot-scope="scope"
                >
                    

                    <el-popconfirm
                        class="mr10"
                        confirm-button-text='确定'
                        cancel-button-text='取消'
                        icon="el-icon-info"
                        icon-color="red"
                        title="是否通过审核?"
                        @confirm="handleMaterialAudit(scope.row.id, 1, scope.$index)"
                    >
                        <el-button 
                            type="primary" 
                            slot="reference"
                            size="mini"
                            plain
                        >
                            通过
                        </el-button>
                    </el-popconfirm>

                    <el-popconfirm
                        class="mr10"
                        confirm-button-text='确定'
                        cancel-button-text='取消'
                        icon="el-icon-info"
                        icon-color="red"
                        title="是否拒绝审核?"
                        @confirm="handleMaterialAudit(scope.row.id, 0, scope.$index)"
                    >
                        <el-button 
                            type="danger" 
                            slot="reference"
                            size="mini"
                            plain
                        >
                            拒绝
                        </el-button>
                    </el-popconfirm>

                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>

<script>
import { materialAuditMaterialDetail, materialAuditSingle } from '@/api/project'
import { dateAddHMS } from '@/utils/index'

export default {
    data(){
        return {
            showScreenList: false,

            // 物料包id
            contenPackagetId: null,

            resData: [],
            tLoading: false
        }
    },
    methods: {
        // 显示物料 对应的屏幕列表
        showScreenListDialog(id){
            this.contenPackagetId = id
            this.showScreenList = true
            this.getScreenList()
        },

        // 获取屏幕列表
        getScreenList(){
            let data = {
                packageId: this.contenPackagetId
            }
            this.tLoading = true
            materialAuditMaterialDetail(data).then(res => {
                this.tLoading = false
                if(res.code === this.$successCode){
                    this.resData = res.obj
                }
            })
        },

        // 审核 1 通过   0拒绝
        handleMaterialAudit(id, status, index){
            let data = `?materialId=${id}&isApproved=${status}`
            materialAuditSingle(data).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('操作成功~')

                    this.resData.splice(index, 1)

                    this.$nextTick(() => {
                        if(!this.resData.length){
                            this.showScreenList = false
                            this.$emit('allAuditResult')
                        }
                    })
                }
            })
        },


        dateAddHMS(val){
            return dateAddHMS(val)
        }
    }
}
</script>

<style lang="scss">
    .material_screen_tag{
        cursor: pointer;
    }
</style>