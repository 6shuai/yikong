<template>
    <el-dialog
        class="create-material-wrap"
        width="740px"
        :title="addParams.id ? '编辑物料' : '新建物料'"
        :visible.sync="showCreateMaterial"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        append-to-body
    >
        <el-form 
            label-width="110px"
            ref="addMaterialForm"
            :inline="true"
            :model="addParams"
            :rules="addMaterialRule"
        >
            <el-form-item label="屏幕" prop="screen">
                <el-select
                    v-model="addParams.screen"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入屏幕名称"
                    :remote-method="handleSearchScreen"
                >
                    <el-option
                        v-for="item in screenData"
                        :key="item.id"
                        :label="item.displayName"
                        :value="item.id">
                    </el-option>

                    <el-pagination
                        :hide-on-single-page="false"
                        layout="total, prev, pager, next"
                        :current-page="Number(screenSearchParams.pageNo)"
                        :page-size="screenSearchParams.pageSize"
                        @current-change="screenSearchParams.pageNo=$event,getScreenData()"
                        :total="screenTotalCount">
                    </el-pagination>  

                </el-select>
            </el-form-item>
            <el-form-item label="内容" prop="content">
                <el-select
                    v-model="addParams.content"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入内容名称"
                    :remote-method="handleSearchContent"
                >
                    <el-option
                        v-for="item in contentData"
                        :key="item.id"
                        :label="item.displayName"
                        :value="item.id">
                    </el-option>

                    <el-pagination
                        v-if="contentData.length"
                        :hide-on-single-page="false"
                        layout="total, prev, pager, next"
                        :current-page="Number(contentSearchParams.pageNo)"
                        :page-size="contentSearchParams.pageSize"
                        @current-change="contentSearchParams.pageNo=$event,getContentData()"
                        :total="contentTotalCount">
                    </el-pagination>  

                </el-select>
            </el-form-item>
            <el-form-item label="上刊时间" prop="effectiveTime">
                <el-date-picker
                    v-model="addParams.effectiveTime"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="下刊时间" prop="dueTime">
                <el-date-picker
                    v-model="addParams.dueTime"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="每天播放次数" prop="publishedTimes">
                <el-input-number 
                    class="w220"
                    :controls="false"
                    v-model="addParams.publishedTimes" 
                    :min="0"
                    placeholder="每天播放次数"
                ></el-input-number>
            </el-form-item>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showCreateMaterial = false">取 消</el-button>
            <el-button
                type="primary"
                :loading="createdLoading"
                @click="handleCreate"
                >确 定</el-button
            >
        </span>
    </el-dialog>
</template>

<script>
import { projectMaterialCreate } from '@/api/project'
import { screenList } from '@/api/screen'
import { contentList } from '@/api/content'
import { dateAddHMS } from '@/utils/index'

export default {
    data(){
        return {
            showCreateMaterial: false,
            createdLoading: false,
            addParams: {},

            // 屏幕列表
            screenData: [],

            // 屏幕搜索项
            screenSearchParams: {
                pageNo: 1,
                pageSize: 40
            },

            // 屏幕总数
            screenTotalCount: 0,

            // 内容列表
            contentData: [],

            // 内容搜索项
            contentSearchParams: {
                pageNo: 1,
                pageSize: 40
            },

            // 内容总数
            contentTotalCount: 0,

            // 表单验证
            addMaterialRule: {
                screen: [{ required: true, message: '请选择屏幕', type: 'number', trigger: 'change' }],
                content: [{ required: true, message: '请选择内容', type: 'number', trigger: 'change' }],
                effectiveTime: [{ required: true, message: '请选择上刊时间', trigger: 'change' }],
                dueTime: [{ required: true, message: '请选择下刊时间', trigger: 'change' }],
                publishedTimes: [{ required: true, message: '请输入每天播放次数', type: 'number', trigger: 'blur' }],
            }
        }
    },
    methods: {
        // 显示新建物料窗口
        showCreateMaterialDialog(data = {}){
            this.showCreateMaterial = true
            this.getScreenData()
            this.getContentData()
            this.addParams = data

            this.$nextTick(() => {
                this.$refs["addMaterialForm"].clearValidate();
            })
        },

        // 获取屏幕列表
        getScreenData(){
            screenList(this.screenSearchParams).then(res => {
                if(res.code === this.$successCode){
                    let { list, totalRecords } = res.obj
                    this.screenData = list
                    this.screenTotalCount = totalRecords
                }
            })
        },

        // 屏幕搜索
        handleSearchScreen(event){
            this.screenSearchParams = {
                ...this.screenSearchParams,
                displayName: event,
                pageNo: 1
            }
            this.getScreenData()
        },

        // 获取内容列表
        getContentData(){
            contentList(this.contentSearchParams).then(res => {
                if(res.code === this.$successCode){
                    let { list, totalRecords } = res.obj
                    this.contentData = list
                    this.contentTotalCount = totalRecords
                }
            })
        },

        // 内容搜索
        handleSearchContent(event){
            this.contentSearchParams = {
                ...this.contentSearchParams,
                displayName: event,
                pageNo: 1
            }
            this.getContentData()
        },

        // 新建物料
        handleCreate(){
            this.$refs.addMaterialForm.validate((valid) => {
                if(valid){
                    this.createdLoading = true
                    let { effectiveTime, dueTime } = this.addParams
                    let data = {
                        ...JSON.parse(JSON.stringify(this.addParams)),
                        effectiveTime: dateAddHMS(effectiveTime),
                        dueTime: dateAddHMS(dueTime),
                        project: Number(this.$route.params.id)
                    }
                    projectMaterialCreate(data).then(res => {
                        this.createdLoading = false
                        if(res.code === this.$successCode){
                            this.$message.success('提交成功~')
                            this.showCreateMaterial = false
                            this.$emit('createMaterialSuccess')
                        }
                    })
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .create-material-wrap{
        .el-select{
            width: 220px;
        }
    }
</style>