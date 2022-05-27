<template>
    <el-dialog
        width="520px"
        :visible.sync="showCollectMoneytDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        append-to-body
        custom-class="member-settle"
    >
        <div slot="title" class="collect-money-title">
            <span class="el-dialog__title">{{ collectMoneyParams.id ? '编辑' : '收款' }}</span>
            <el-link 
                type="danger" 
                v-if="collectMoneyParams.id"
                @click="handleDeleteLog"
            >
                删除本条
            </el-link>
        </div>
        <el-form
            label-width="100px"
            ref="collectMoneyForm"
            :model="collectMoneyParams"
            :rules="collectMoneyRules"
        >
            <el-form-item label="收款金额" prop="amount">
                <el-input-number
                    class="w220"
                    v-model="collectMoneyParams.amount"
                    :controls="false"
                    :min="0"
                    :precision="2"
                    placeholder="请输入本次的收款金额"
                ></el-input-number>
                <span>元</span>
            </el-form-item>
            <el-form-item label="收款时间" prop="occurTime">
                <el-date-picker
                    class="w100"
                    v-model="collectMoneyParams.occurTime"
                    type="date"
                    placeholder="选择本次的收款时间"
                    value-format="yyyy-MM-dd"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="付款公司" prop="payer">
                <el-select 
                    class="w100"
                    v-model="collectMoneyParams.payer" 
                    filterable 
                    placeholder="请选择本次的付款公司"
                >   
                    <el-option 
                        v-for="item in groupData" 
                        :key="item.id"
                        :label="item.displayName" 
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        
        <span slot="footer" class="dialog-footer">
            <el-button @click="showCollectMoneytDialog = false">取 消</el-button>
            <el-button
                type="primary"
                :loading="btnLoading"
                @click="handleCollectMoneySure"
                >确 定</el-button
            >
        </span>
    </el-dialog>
</template>

<script>
import { financeReturnMoneyAddLog, financeReturnMoneyLogDelete } from '@/api/finance'

export default {
    data() {
        return {
            // 是否显示付款窗口
            showCollectMoneytDialog: false,

            collectMoneyParams: {},

            // 付款公司列表
            groupData: [],

            collectMoneyRules: {
                amount: [{ required: true, type: 'number', trigger: "blur", message: '请输入本次的收款金额~' }],
                occurTime: [{ required: true, trigger: "change", message: '请输入本次的收款时间~' }],
                payer: [{ required: true, type: 'number', trigger: "change", message: '请选择本次的付款公司~' }],
            },

            btnLoading: false
        }
    },
    methods: {
        showCollectMoney(data = {}){ 
            this.collectMoneyParams = data
            this.showCollectMoneytDialog = true

            this.$store.dispatch('user/getBrandList').then((res) => {
                this.groupData = res
            })

            this.$nextTick(() => {
                this.$refs.collectMoneyForm.clearValidate()
            })
        },

        // 确认收款
        handleCollectMoneySure(){
            this.$refs.collectMoneyForm.validate((valid) => {
                if(valid) {
                    this.btnLoading = true
                    financeReturnMoneyAddLog(this.collectMoneyParams).then(res => {
                        this.btnLoading = false
                        if(res.code === this.$successCode){
                            this.$message.success('操作成功~')
                            this.showCollectMoneytDialog = false
                            this.$parent.getCollectMoneyList()
                        }
                    })
                }
            })
        },

        // 删除
        handleDeleteLog(){
            this.$confirm(
                `确定要删除此条记录吗?`,
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    center: true,
                }
            ).then(() => {
                financeReturnMoneyLogDelete(this.collectMoneyParams.id).then(res => {
                    if(res.code === this.$successCode){
                        this.$message.success('删除成功~')
                        this.showCollectMoneytDialog = false
                        this.$parent.getCollectMoneyList()
                    }
                })
            })
        }
    }   
}
</script>

<style lang="scss" scoped>
    .collect-money-title{
        display: flex;
        justify-content: space-between;
    }  
</style>