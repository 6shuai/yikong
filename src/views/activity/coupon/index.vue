<template>
    <el-card>
        <el-page-header @back="$router.go(-1)">
            <div slot="content">
                券列表
            </div>
        </el-page-header>

        <div class="coupon-list mt20">
            <div class="coupon-list-top">
                <el-input
                    class="w200 mr10"
                    prefix-icon="el-icon-search"
                    clearable
                    v-model="params.displayName"
                    placeholder="优惠券名称"
                    @input="handleSearch"
                ></el-input>

                <el-select
                    v-model="params.couponType"
                    filterable
                    clearable
                    placeholder="请选择优惠券类型"
                    @change="handleSearch"
                >
                    <el-option
                        v-for="item in couponTypeData"
                        :key="item.id"
                        :label="item.displayName"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </div>
            <el-table
                v-loading="tableLoading"
                stripe
                size="small"
                :data="resData"
                row-key="id"
                border
                class="mb20"
            >
                <el-table-column prop="id" label="优惠券图片" width="100">
                    <template slot-scope="scope">
                        <el-image
                            style="width: 80px; height: 80px; border-radius: 50%"
                            :src="scope.row.image"
                            fit="cover"
                        >
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="displayName"
                    label="券名称"
                    min-width="50"
                ></el-table-column>
                <el-table-column
                    prop="couponTypeName"
                    label="券类型"
                    min-width="50"
                ></el-table-column>
                <el-table-column
                    prop="merchantName"
                    label="商户"
                    min-width="50"
                ></el-table-column>
                <el-table-column
                    prop="condition"
                    label="使用条件"
                    min-width="100"
                ></el-table-column>
                <el-table-column
                    prop="description"
                    label="说明"
                    min-width="50"
                >
                </el-table-column>
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="primary"
                            @click="handleDetail(scope.row.id)"
                        >
                            详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                background
                layout="total, prev, pager, next, sizes"
                :page-sizes="[40, 80, 100]"
                :page-size="Number(params.pageSize)"
                :current-page="Number(params.pageNo)"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :total="totalCount"
            >
            </el-pagination>

        </div>

    </el-card>
</template>
<script>
import { activityCouponList, activityCouponTypeList } from '@/api/activity';
export default {
    data() {
        return {
            tableLoading: false,
            totalCount: 0,
            resData: [],
            couponTypeData: [],
            params: {
                pageNo: 1,
                pageSize: 40,
            }
        };
    },
    mounted() {
        this.init();
        this.getCouponTypeList();
    },
    methods: {
        init(){
            this.tableLoading = true;
            activityCouponList(this.params).then(res => {
                this.tableLoading = false;
                if(res.code == this.$successCode){
                    let { totalRecords, list } = res.obj;
                    this.resData = list;
                    this.totalCount = totalRecords;
                }
            })
        },

        //分页
        handleCurrentChange(page){
            this.params.pageNo = page;
            this.init();
        },

        //每页多少条
        handleSizeChange(size){
            this.params.pageSize = size;
            this.init();
        },

        //筛选
        handleSearch(){
            this.params.pageNo = 1;
            this.init();
        },


        //查看详情
        handleDetail(id){
            this.$router.push(`/activity/coupon/${id}`)
        },

        //优惠券类型列表
        getCouponTypeList(){
            activityCouponTypeList().then(res => {
                if(res.code == this.$successCode){
                    this.couponTypeData = res.obj;
                }
            })
        },
    }
}
</script>

<style lang="scss" scoped>
    .coupon-list{
        .coupon-list-top{
            margin-bottom: 20px;
        }
    }
</style>