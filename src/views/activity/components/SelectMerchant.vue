<template>
    <el-dialog
        width="500px"
        title="选择商户"
        class="select-merchant-dialog"
        :visible.sync="showDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
    >
        <el-input
            placeholder="请输入商户名称"
            prefix-icon="el-icon-search"
            v-model="params.displayName">
        </el-input>

        <div class="merchant-list">
            <div class="item" v-for="item in 10" :key="item">
                madongmei
            </div>
        </div>
        <el-pagination
            class="mt20"
            background
            layout="total, prev, pager, next"
            :page-size="Number(params.pageSize)"
            :current-page="Number(params.pageNo)"
            @current-change="handleCurrentChange"
            :total="totalCount">
        </el-pagination>

        <span slot="footer" class="dialog-footer">
            <el-button @click="showDialog=false">取消</el-button>
            <el-button type="primary" @click="handleSelected">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { ctivityMerchantList } from "@/api/activity";
export default {
    data(){
        return{
            showDialog: true,
            totalCount: 0,
            params: {
                pageNo: 1,
                pageSize: 20
            }
        }
    },
    methods: {
        //分页
        handleCurrentChange(page){
            console.log(page)
        },

        //选中商户
        handleSelected(){

        }
    }
}
</script>

<style lang="scss">
    .select-merchant-dialog{
        .merchant-list{
            margin-top: 20px;
            
            .item{
                padding: 0 20px;
                height: 50px;
                line-height: 50px;
                border-bottom: 1px solid #f0f0f0;
                cursor: pointer;

                &:hover{
                    background: #F5F7FA;
                    color: #8484FF;
                }
            }
        }
    }
</style>