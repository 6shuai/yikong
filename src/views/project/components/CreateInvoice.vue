<template>
    <el-dialog
        width="520px"
        :title="addParams.id ? '编辑发票' : '添加发票'"
        :visible.sync="showCreateInvoiceLog"
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
            <el-form-item label="发票金额" prop="amount">
                <el-input-number 
                    class="w220"
                    :controls="false"
                    v-model="addParams.amount" 
                    :min="0"
                    placeholder="发票金额"
                ></el-input-number>
            </el-form-item>
            <el-form-item label="开票时间">
                <el-date-picker
                    v-model="addParams.billingTime"
                    type="datetime"
                    placeholder="选择开票时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="发票图片">
                <upload-img 
                    ref="uploadImg"
                    :isArray="false" 
                    :imgList="addParams.print"
                    @deleteImg="addParams.print = ''"
                    @uploadImgPath="uploadImgSuccess"
                ></upload-img>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showCreateInvoiceLog = false">取 消</el-button>
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
import { projectFinanceCreateInvoice } from '@/api/project'
import UploadImg from '@/components/Upload/UploadImg'

export default {
    components: {
        UploadImg
    },
    data(){
        return {
            showCreateInvoiceLog: false,
            createdLoading: false,
            addParams: {},

            // 表单验证
            addParamsRules: {
                amount: [{ required: true, message: '请输入发票金额~', type: 'number', trigger: 'blur' }]
            }
        }
    },
    methods: {

        // 显示新建发票
        showCreateInvoiceDialog(data = {}){
            console.log('显示新建发票--------->', data)
            this.addParams = JSON.parse(JSON.stringify(data))
            if(data.billingTimeFormat){
                this.addParams.billingTime = data.billingTimeFormat
            }
            this.showCreateInvoiceLog = true
            this.$nextTick(() => {
                this.$refs["addForm"].clearValidate();
            })
        },


        // 发票图片上传成功
        uploadImgSuccess(path){
            this.addParams.print = path
        },


        // 提交
        handleCreate(){
            this.$refs.addForm.validate((valid) => {
                if(valid){
                    this.createdLoading = true
                    projectFinanceCreateInvoice(this.addParams).then(res => {
                        this.createdLoading = false
                        if(res.code === this.$successCode){
                            this.showCreateInvoiceLog = false 
                            this.$parent.getFinanceInfo()
                        }
                    })
                }
            })
        }
    },
}
</script>