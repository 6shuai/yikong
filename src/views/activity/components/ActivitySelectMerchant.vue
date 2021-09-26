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

        <div class="merchant-list" v-loading="loading" v-if="resData.length">
            <el-checkbox-group 
                v-model="addParams">
                <el-checkbox 
                    class="item"
                    v-for="(item, index) in resData"
                    :key="index"
                    :label="item.id + '-' + item.displayName" 
                    :disabled="selectedId.includes(item.id)"
                    border
                >{{item.displayName}}</el-checkbox>
            </el-checkbox-group>

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
            <el-button
                @click="showDialog = false"
                >取 消
            </el-button>
            <el-button
                type="primary"
                @click="handleSelected()"
                >确 定</el-button
            >
        </span>
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
            addParams: [],
            selectedObj: {},
            selectedId: [],
            loading: false
        }
    },
    methods: {
        showMerchantList(data = []){
            this.showDialog = true;
            this.addParams = [];
            this.selectedId = [];
            this.selectedArr = data;
            data.forEach(val => {
                let { merchant, merchantName, id } = val
                this.selectedId.push(merchant)
                this.addParams.push(merchant + '-' + merchantName);
                this.selectedObj[merchant] = val;
            });
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
        handleSelected(){
            let arr = [];
            for(var key of this.addParams){
                let merchant = Number(key.split('-')[0]);
                let merchantName = key.split('-')[1];
                if(this.selectedId.includes(merchant)){
                    arr.push(this.selectedObj[merchant])
                }else{
                    arr.push({
                        merchant,
                        merchantName
                    })
                }
            }

            this.$emit('merchantId', arr);
            this.showDialog = false
        }
    }
}
</script>

<style lang="scss">
    .select-merchant-dialog{
        .merchant-list{
            margin-top: 20px;

            .item {
                width: 100%;
                margin: 10px 0;
                cursor: pointer;
                
                &.el-checkbox.is-bordered+.el-checkbox.is-bordered{
                    margin-left: 0;
                }

                .screen-info {
                    display: flex;
                    line-height: 50px;

                    .title {
                        padding: 0 10px;
                        flex: 1;
                    }
                }
                .time{
                    line-height: 20px;
                    margin-left: 10px;
                    color: #999;
                    .el-icon-time{
                        margin-right: 5px;
                    }
                }
            }
        }
    }
</style>