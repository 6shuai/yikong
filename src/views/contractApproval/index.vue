<template>
    <div 
        class="app-main-wrap" 
        id="app-main-wrap"
    >

        <div class="contract-approval-wrap">
            <div class="contract-list" v-loading="listLoading">
                <div 
                    class="item" 
                    :style="{ width: placeW }" 
                    v-for="item in resData"
                    :key="item.id"
                    @click="$emit('jumpPage', item)"
                >
                    <el-card shadow="hover">
                        <div class="contract-content">
                            <div class="name overflow">{{ item.displayName }}</div>
                            <div class="desc" :title="item.description">{{ item.description }}</div>
                            <el-tag 
                                type="primary" 
                                plain
                                size="mini"
                                v-show="item.clientName"
                            >
                                {{ item.clientName }}
                            </el-tag>
                        </div>

                        <div class="btn-wrap">
                            <span @click="handleShowContractDetail(item.id)">详情</span>
                            <span @click="handleApproval(item.id, 1)">通过</span>
                            <span @click="handleApproval(item.id, 0)">拒绝</span>
                        </div>
                        
                    </el-card>
                </div>
            </div>
            <el-empty v-if="!resData.length && !listLoading" description="暂无合同"></el-empty>

        </div>

        <!-- 合同详情 -->
        <contract-detail ref="contractDetail"></contract-detail>

    </div>
</template>

<script>
import { screenSizeWatch } from '@/mixins'
import { contractApprovalList, contractApproval } from '@/api/contractApproval'
import ContractDetail from './components/ContractDetail'

export default {
    mixins: [screenSizeWatch],
    components: {
        ContractDetail
    },
    data(){
        return{
            resData: [],
            listLoading: false,
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        // 项目列表
        getList(){
            this.listLoading = true
            contractApprovalList().then(res => {
                this.listLoading = false
                if(res.code === this.$successCode){
                    this.resData = res.obj || []
                }
            })
        },

        // 查看合同详情
        handleShowContractDetail(id){
            this.$refs.contractDetail.getContractDetail(id)
        },

        // 审批合同  0 拒绝  1 通过
        handleApproval(id, state){
            this.$confirm(`确认审核${state ? '通过' : '拒绝'}`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
            }).then(() => {
                let data = `?contract=${id}&isApproved=${state}`
                contractApproval(data).then(res => {
                    if(res.code === this.$successCode){
                        this.$message.success('操作成功~')
                        this.getList()
                    }
                })

            }).catch(() => {})
        }
    }
}
</script>


<style lang="scss">
.contract-approval-wrap{
    
    .contract-list{
        display: flex;
        flex-wrap: wrap;
        margin-left: -10px;

        .item{
            cursor: pointer;

            .el-card{
                margin: 10px;
                position: relative;

                .el-card__body{
                    padding: 0;
                    margin: 0;
                }

                .contract-content{
                    margin: 20px 20px 10px;
                }
                
                .desc{
                    font-size: 12px;
                    color: #999;
                    line-height: 14px;
                    height: 14px;
                    overflow: hidden;
                    margin: 10px 0;
                }

                .edit{
                    font-size: 14px;
                    position: absolute;
                    right: 0;
                    bottom: 0px;
                    height: 30px;
                    line-height: 30px;
                    padding: 0 20px;
                    text-align: center;
                    color: #999;
                    background: #f9fafcd1;
                    display: none;

                    &:hover{
                        color: var(--color-primary);
                    }
                }

                .btn-wrap{
                    border-top: 1px solid #e5e5e5;
                    display: flex;
                    padding: 10px 0;
                    margin-top: 10px;
                    font-size: 14px;

                    span{
                        flex: 1;
                        text-align: center;
                        border-right: 1px solid #e5e5e5;

                        &:last-child{
                            border: none;
                        }
                    }
                }

            }

            &:hover{
                .edit{
                    display: block;
                }
            }
        }
    }
}
</style>