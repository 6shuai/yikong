<template>
    <el-dialog
        width="1000px"
        title="创建提成体系"
        :visible.sync="showCreateSystemDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
        custom-class="create-commission-system"
    >

        <div class="system-name">
            <span>体系名称</span>
            <el-input class="w220" v-model="ruleData.displayName"></el-input>
        </div>

        <div class="system-rule-list">
            <div class="item">
                <span>折扣下线</span>
                <span>折扣上线</span>
                <span>提成</span>
                <span>操作</span>
            </div>
            <div 
                class="item"
                v-for="(item, index) in ruleData.commissionRules"
                :key="index"
            >
                <span>
                    <el-input
                        placeholder="折扣下线"
                        type="number"
                        v-model="item.discountLowerLimit"
                    >
                        <template #append>
                            <el-button>%</el-button>
                        </template>
                    </el-input>
                </span>
                <span>
                    <el-input
                        placeholder="折扣上线"
                        type="number"
                        v-model="item.discountUpperLimit"
                    >
                        <template #append>
                            <el-button>%</el-button>
                        </template>
                    </el-input>
                </span>
                <span>
                    <el-input
                        placeholder="提成"
                        type="number"
                        v-model="item.percentage"
                    >
                        <template #append>
                            <el-button>%</el-button>
                        </template>
                    </el-input>
                </span>
                <span>
                    <i 
                        class="el-icon-plus"
                        title="添加"
                        @click="handleAddRule"
                    ></i>
                    <i 
                        class="el-icon-close"
                        title="删除"
                        v-if="ruleData.commissionRules.length>1"
                        @click="handleDeleteRule(index)"
                    ></i>
                </span>
            </div>
        </div>

        
        <span slot="footer" class="dialog-footer">
            <el-button @click="showCreateSystemDialog = false">取 消</el-button>
            <el-button
                type="primary"
                :loading="btnLoading"
                @click="handleSaveCommissionSystem"
                >确 定</el-button
            >
        </span>
    </el-dialog>
</template>

<script>
import { financeCommissionSystemCreate } from '@/api/finance'

export default {
    data() {
        return {
            showCreateSystemDialog: false,
            btnLoading: false,

            // 当前提成体系 规则数据
            ruleData: {}
        }
    },
    methods: {
        showCreateSystem(data){
            if(data) this.ruleData = JSON.parse(JSON.stringify(data))
            else this.ruleData = { commissionRules: [{}] }
            this.showCreateSystemDialog = true
        },

        // 添加规则
        handleAddRule(){
            this.$set(this.ruleData.commissionRules, this.ruleData.commissionRules.length, {})
        },

        // 删除规则
        handleDeleteRule(index){
            this.$delete(this.ruleData.commissionRules, index)
        },

        // 保存提成体系
        handleSaveCommissionSystem(){
            this.btnLoading = true
            financeCommissionSystemCreate(this.ruleData).then(res => {
                this.btnLoading = false
                if(res.code === this.$successCode){
                    this.$message.success('操作成功~')
                    this.showCreateSystemDialog = false
                    this.$emit('createSuccess', res.obj, this.ruleData.id)
                }
            })
        }
    }
}
</script>

<style lang="scss">
    .create-commission-system{
        .system-rule-list{
            margin-top: 30px;

            .item{
                display: flex;
                margin: 10px 0;
                align-items: center;
      
                span{
                    flex: 1;
                    margin: 0 10px;
                    text-align: center;

                    input[type=number] {

                        &::-webkit-outer-spin-button,
                        &::-webkit-inner-spin-button {
                            -webkit-appearance: none;
                        }

                        -moz-appearance: textfield;
                    }

                    i{
                        font-size: 20px;
                        cursor: pointer;
                        padding: 5px;
                        border-radius: 50%;
                        margin: 0 10px;

                        &:hover{
                            color: #fff;
                            &.el-icon-plus{
                                background: var(--color-primary);
                            }

                            &.el-icon-close{
                                background: var(--color-danger);
                            }
                        }
                    }
                }
            }
        }
    }
</style>