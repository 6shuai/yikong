<template>
    <el-dialog
        width="520px"
        title="编辑大屏刊例价"
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
            <el-form-item label="大屏名称" prop="client">
                {{ addParams.screenName }}
            </el-form-item>
            <el-form-item label="大屏价格">
                <el-input-number 
                    :precision="2" 
                    class="w220"
                    :controls="false"
                    v-model="addParams.price" 
                    :min="0"
                    placeholder="大屏价格"
                ></el-input-number>
                <span class="ml10">元</span>
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

export default {
    data(){
        return {
            showAddScreenPrice: false,
            createdLoading: false,
            addParams: {},

            // 表单验证
            addParamsRules: {
                price: [{ required: true, message: '请输入刊例价~', trigger: 'blur' }]
            }
        }
    },
    methods: {
        // 显示新建屏幕刊例价窗口
        showAddScreenPriceDialog(data = {}){
            let { screenName, media, price, id } = JSON.parse(JSON.stringify(data))
            this.addParams = {
                screenName,
                media,
                price,
                id,
                priceSystem: this.$route.params.id
            }
            this.showAddScreenPrice = true
            this.$nextTick(() => {
                this.$refs["addForm"].clearValidate()
            })
        },


        // 创建屏幕刊例价
        handleCreate(){
            this.$refs.addForm.validate((valid) => {
                if(valid){
                    this.createdLoading = true
                    addScreenPrice([this.addParams]).then(res => {
                        this.createdLoading = false
                        if(res.code === this.$successCode){
                            this.showAddScreenPrice = false 
                            this.$parent.getScreenList()
                            this.$message.success('操作成功~')
                        }
                    })
                }
            })
        }
    },
}
</script>