<!--
 * @Author: liushuai
 * @Date: 2022-03-22 14:23:13
 * @LastEditors: liushuai
 * @LastEditTime: 2022-03-31 11:49:01
 * @Description: file content
 * @FilePath: \pclient\src\views\project\invoiceCenter\index.vue
-->
<template>
    <div class="invoice-center-wrap" v-loading="listLoading">
        <div 
            v-for="(item, index) in resData"
            :key="index"
            class="invoice-list"
            :class="item.state.indexOf('通过')>-1 ? 'pass' : item.state.indexOf('驳回')>-1 ? 'turnDown' : ''"
            @click="handleShowInvoiceDetail(item.id)"
        >
            <div class="left-detail">
                <p class="price">开票金额: ￥{{ item.amount }}元</p>
                <p class="time">申请时间: {{ item.applyTime }}</p>
            </div>
            <div class="state">
                审核状态: {{ item.state }}
                <el-tooltip 
                    v-if="item.reason"
                    class="text" 
                    effect="dark" 
                    :content="item.reason" 
                    placement="top-start"
                >
                    <a href="javascript:;" @click.stop="" class="text">查看理由</a>
                </el-tooltip>
            </div>
            <div class="right-btn-wrap">
                <p v-if="item.allowModification"><el-button type="primary" plain size="mini" @click.stop="handleEdit(item.id)">修改申请</el-button></p>
                <p v-else><el-button type="primary" size="mini" @click.stop="showInvoice(item.print)">查看发票</el-button></p>
            </div>
        </div>

        <el-empty v-if="!resData.length" description="暂无发票"></el-empty>


    </div>
</template>

<script>
import { projectInvoiceList } from '@/api/project'

export default {
    data() {
        return {
            // 发票列表数据
            resData: [],

            // 发票列表加载中
            listLoading: true
        }
    },
    mounted() {
        this.getInvoiceList()
    },
    methods: {
        // 获取发票列表
        getInvoiceList(){
            this.listLoading = true
            projectInvoiceList({ project: this.$route.params.id }).then(res => {
                this.listLoading = false
                if(res.code === this.$successCode){
                    this.resData = res.obj
                }
            })
        },

        // 查看详情  
        handleShowInvoiceDetail(id = null){
            this.$router.push(`/invoiceApply?projectId=${this.$route.params.id}&invoiceId=${id}&clientId=${this.$store.state.user.projectDetail.client}`)
        },

        // 查看发票
        showInvoice(print){
            window.open(print)
        },

        // 修改申请
        handleEdit(id){
            this.$router.push(`/invoiceApply?projectId=${this.$route.params.id}&invoiceId=${id}&clientId=${this.$store.state.user.projectDetail.client}&edit=1`)
        }   
    }
}
</script>

<style lang="scss" scoped>
    .invoice-center-wrap{
        .invoice-list{
            padding: 20px;
            margin: 20px 0;
            border-radius: 10px;
            display: flex;
            flex-wrap: wrap;
            align-items: center;    
            background: #63D998;
            cursor: pointer;

            &.pass{
                background: #D9D9D9;
            }

            &.turnDown{
                background: #FAB958;
            }

            .left-detail {
                flex: 1;

                p{
                    padding: 10px 0;
                }
            }

            .state{
                width: 300px;

                .text{
                    color: var(--color-danger);
                    text-decoration: underline;
                    padding-left: 10px;
                }
            }
            
            .right-btn-wrap{
                width: 120px;
                text-align: right;

                p{
                    padding: 5px 0;
                }
            }
        }
    }
</style>