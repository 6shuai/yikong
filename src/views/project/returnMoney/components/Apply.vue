<template>
    <el-dialog
        width="520px"
        :visible.sync="showCreateApplyDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
        :show-close="false"
        custom-class="return-money-apply-wrap"
    >
        <div slot="title" class="apply-title">
            <span class="el-dialog__title">{{ applyParams.id ? '编辑' : '申领' }}</span>
            <el-link 
                type="danger" 
                v-if="applyParams.id"
                @click="applyDelete"
            >删除本条</el-link>
        </div>

        <el-form
            label-width="100px"
            ref="applyForm"
            :model="applyParams"
            :rules="applyRules"
        >
            <el-form-item label="申领金额" prop="amount">
                <el-input-number
                    class="w100"
                    v-model="applyParams.amount"
                    :controls="false"
                    :min="0"
                    placeholder="请输入本次的申领金额"
                ></el-input-number>
            </el-form-item>
            <el-form-item label="收款时间" prop="requestDate">
                <el-date-picker
                    class="w100"
                    v-model="applyParams.requestDate"
                    type="date"
                    placeholder="选择本次的收款时间"
                    value-format="yyyy-MM-dd"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="收款公司" prop="payer">
                <el-select 
                    class="w100"
                    v-model="applyParams.payer" 
                    filterable 
                    placeholder="请选择本次的收款公司"
                >   
                    <el-option 
                        v-for="item in groupData" 
                        :key="item.id"
                        :label="item.displayName" 
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="回款唯一凭证">
                <el-upload
                    :show-file-list="false"
                    :data="uploadData"
                    :action="action"
                    v-loading="uploadLoading"
                    element-loading-text="图片上传中"
                    element-loading-spinner="el-icon-loading"
                    accept="image/*"
                    :on-success="uploadSuccess"
                    :before-upload="beforeUpload"
                    :on-error="uploadError"
                >
                    <el-button 
                        plain
                        type="primary"
                        size="small" 
                        icon="el-icon-plus"
                    >
                        请上传客户回款凭证 
                    </el-button>
                </el-upload>

                <el-image
                    class="payment-voucher" 
                    v-if="applyParams.receipt"
                    fit="cover" 
                    :src="applyParams.receipt"
                ></el-image>

            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="showCreateApplyDialog = false">取 消</el-button>
            <el-button
                type="primary"
                :loading="btnLoading"
                @click="handleCreateApply"
                >确 定</el-button
            >
        </span>
    </el-dialog>
</template>

<script>
import { projectReturnMoneyCompany, projectReturnMoneyApply, projectReturnMoneyApplyDelete } from '@/api/project'
import { uploadUrl } from '@/utils'

export default {
    data() {
        return {
            showCreateApplyDialog: false,

            // 申领接口参数\
            applyParams: {},

            // 收款公司列表
            groupData: [],

            // 表单验证
            applyRules: {
                amount: [{ required: true, type: 'number', trigger: "blur", message: '请输入申领金额~' }],
                requestDate: [{ required: true, trigger: "change", message: '请选择收款时间~' }],
                payer: [{ required: true, type: 'number', trigger: "change", message: '请选择收款公司~' }],
            },

            // 创建按钮loading
            btnLoading: false,

            // 上传时附带的额外参数
            uploadData: {                    
                fileType: 'picture'
            },
            action: uploadUrl,
            uploadLoading: false
        }
    },
    methods: {
        showApplyDialog(data = {}){
            this.applyParams = JSON.parse(JSON.stringify(data))
            this.showCreateApplyDialog = true

            this.getCompanyList()

            this.$nextTick(() => {
                this.$refs.applyForm.clearValidate()
            })
        },

        getCompanyList(){
            if(this.groupData.length) return
            projectReturnMoneyCompany().then(res => {
                this.groupData = res.obj
            })
        },

        // 开始上传
        beforeUpload(){
            this.uploadLoading = true
        },

        // 上传成功
        uploadSuccess(res){
            this.uploadLoading = false
            this.applyParams.receipt = res.obj.path
        },

        // 上传失败
        uploadError(){
            this.uploadLoading = false
            this.$message.error('上传失败')
        },

        // 创建申领
        handleCreateApply(){
            this.$refs.applyForm.validate((valid) => {
                if(valid){
                    this.btnLoading = true
                    projectReturnMoneyApply(this.applyParams).then(res => {
                        this.btnLoading = false
                        if(res.code === this.$successCode){
                            this.$message.success('申领成功~')
                            this.showCreateApplyDialog = false
                            this.$parent.getApplyList()
                        }
                    })
                }
            })
        },

        // 删除申领
        applyDelete(){
            this.$confirm(
                `确定要删除此条申领吗?`,
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    center: true,
                }
            ).then(() => {
                projectReturnMoneyApplyDelete(this.applyParams.id).then(res =>{
                    if(res.code === this.$successCode){
                        this.$message.success('删除成功~')
                        this.showCreateApplyDialog = false
                        this.$parent.getApplyList()
                    }
                })
            })
        } 
    }
}
</script>

<style lang="scss">
.return-money-apply-wrap{
    .apply-title{
        display: flex;
        justify-content: space-between;
    }  

    .payment-voucher{
        height: 200px;
        border-radius: 6px;
        border: 1px solid #e5e5e5;
    }
}
</style>