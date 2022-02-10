<template>
    <el-dialog
        width="520px"
        :title="addParams.id ? addParams.screenName : '新建屏幕刊例价'"
        :visible.sync="showAddScreenPrice"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
    >
        <el-form 
            label-width="80px"
            ref="addForm"
            :model="addParams"
            :rules="addParamsRules"
        >
            <el-form-item label="屏幕" prop="client">
                <el-select 
                    v-model="addParams.media" 
                    filterable 
                    class="w220"
                    placeholder="请选择屏幕"
                    :disabled="addParams.id ? true : false"
                >   
                    <el-option 
                        v-for="item in screenData" 
                        :key="item.id"
                        :label="item.displayName" 
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="刊例价">
                <el-input-number 
                    class="w220"
                    :controls="false"
                    v-model="addParams.price" 
                    :min="0"
                    placeholder="刊例价"
                ></el-input-number>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showAddScreenPrice = false">取 消</el-button>
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
import { addScreenPrice } from '@/api/priceSystem'
import { projectLocationScreenList } from '@/api/project'

export default {
    data(){
        return {
            showAddScreenPrice: false,
            createdLoading: false,
            addParams: {},

            // 屏幕列表
            screenData: [],

            // 表单验证
            addParamsRules: {
                media: [{ required: true, message: '请选择屏幕~', trigger: 'change' }],
                price: [{ required: true, message: '请输入刊例价~', trigger: 'blur' }]
            }
        }
    },
    methods: {
        // 显示新建屏幕刊例价窗口
        showAddScreenPriceDialog(data = {}){
            this.getScreenList()
            this.addParams = {
                ...JSON.parse(JSON.stringify(data)),
                priceSystem: this.$route.params.id
            }
            this.showAddScreenPrice = true
            this.$nextTick(() => {
                this.$refs["addForm"].clearValidate()
            })
        },

        // 获取屏幕列表
        getScreenList(){
            if(this.screenData.length) return
            projectLocationScreenList().then(res => {
                if(res.code === this.$successCode){
                    this.screenData = res.obj
                }
            })
        },

        // 创建屏幕刊例价
        handleCreate(){
            this.$refs.addForm.validate((valid) => {
                if(valid){
                    this.createdLoading = true
                    addScreenPrice(this.addParams).then(res => {
                        this.createdLoading = false
                        if(res.code === this.$successCode){
                            this.showAddScreenPrice = false 
                            this.$parent.getDetail()
                        }
                    })
                }
            })
        }
    },
}
</script>