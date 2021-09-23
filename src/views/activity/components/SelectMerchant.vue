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
            v-model="params.displayName"
            @input="handleSearch"
        >
        </el-input>

        <div class="merchant-list" v-loading="loading">
            <div 
                class="item" 
                v-for="(item, index) in resData" 
                :key="index"
                @click="handleSelected(item)"
            >
                {{ item.displayName }}
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
    </el-dialog>
</template>

<script>
import { activityMerchantList } from "@/api/activity";
export default {
    data(){
        return{
            showDialog: false,
            totalCount: 0,
            params: {
                pageNo: 1,
                pageSize: 20
            },
            resData: [],
            loading: false
        }
    },
    methods: {
        showMerchantList(){
            this.showDialog = true;
            if(!this.resData.length){
                this.init();
            }
        },

        init(){
            this.loading = true;
            activityMerchantList(this.params).then(res => {
                this.loading = false;
                if(res.code == this.$successCode){
                    this.resData = res.obj.list;
                    this.totalCount = res.obj.totalRecords;
                }
            })
        },

        //搜索
        handleSearch(){
            this.params.pageNo = 1;
            this.init();
        },

        //分页
        handleCurrentChange(page){
            this.params.pageNo = page;
            this.init();
        },

        //选中商户
        handleSelected(data){
            this.$emit('merchantId', { id: data.id, displayName: data.displayName });
            this.showDialog = false
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