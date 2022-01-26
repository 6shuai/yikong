<template>
    <el-dialog
        width="520px"
        :title="addParams.id ? '编辑刊例价' : '添加刊例价'"
        :visible.sync="showCreateScreenPrice"
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
            <el-form-item label="刊例价" prop="price">
                <el-input-number 
                    class="w220"
                    :controls="false"
                    v-model="addParams.price" 
                    :min="0"
                    placeholder="付款额"
                ></el-input-number>
            </el-form-item>
            <el-form-item label="价格体系" prop="priceSystem">
                <el-select 
                    v-model="addParams.priceSystem" 
                    filterable 
                    style="width: 100%"
                    placeholder="请选择价格体系"
                >   
                    <el-option 
                        v-for="item in priceTypeData" 
                        :key="item.id"
                        :label="item.displayName" 
                        :value="item.id">
                        <span style="float: left">{{ item.displayName }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.description }}</span>
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showCreateScreenPrice = false">取 消</el-button>
            <el-button
                type="primary"
                @click="handleCreate"
                >确 定</el-button
            >
        </span>
    </el-dialog>
</template>

<script>
export default {
    data(){
        return {
            showCreateScreenPrice: false,
            addParams: {},

            // 表单验证
            addParamsRules: {
                price: [{ required: true, message: '请输入刊例价~', type: 'number', trigger: 'blur' }],
                priceSystem: [{ required: true, message: '请选择价格体系~', trigger: 'change' }]
            }
        }
    },
    computed: {
        // 价格体系列表
        priceTypeData(){
            return this.$store.state.user.priceTypeData
        }
    },
    methods: {
        // 显示新建付款记录窗口
        showCreateScreenPriceDialog(data = {}){
            this.addParams = JSON.parse(JSON.stringify(data))
            this.showCreateScreenPrice = true
            this.$nextTick(() => {
                this.$refs["addForm"].clearValidate();
            })
        },

        // 新建屏幕刊例价
        handleCreate(){
            this.$refs.addForm.validate((valid) => {
                if(valid){
                    this.$emit('handleCreatePriceSuccess', this.addParams)
                    this.showCreateScreenPrice = false
                }
            })
        }
    },
}
</script>