<template>
    <div class="app-main-wrap price-system-screen-list">
        <page-header 
            :title="priceSystem.displayName"
            backPath="/priceSystem"
        >
        </page-header>

        <div class="add-and-search mb10">
            <el-button 
                type="primary" 
                icon="el-icon-plus" 
                @click="handleShowAddScreen()"
                size="small">
                新建屏幕刊例价
            </el-button>

            <div class="search-input">
                <el-input 
                    clearable
                    size="small"
                    v-model="params.displayName"
                    placeholder="输入屏幕名称搜索"
                    @input="$debounce(handleSearch)"
                ></el-input>
            </div>
        </div>

        <div class="list" v-loading="listLoading">
            <el-card 
                v-for="(item, index) in resData"
                :key="index"
            >
                <p class="title">{{ item.screenName }}</p>
                <p class="price">￥ {{ item.price }}</p>
                <div class="edit" @click.stop="handleShowAddScreen(item)">
                    <i class="el-icon-edit"></i>编辑
                </div>
            </el-card>
        </div>

        <el-empty v-if="!resData.length && !listLoading" description="暂无数据"></el-empty>

        <el-pagination
            v-if="resData.length"
            background
            :hide-on-single-page="true"
            layout="total, prev, pager, next, sizes"
            :current-page="Number(params.pageNo)"
            :page-size="Number(params.pageSize)"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :total="totalCount">
        </el-pagination>   

        <!-- 添加屏幕刊例价 -->
        <add-screen ref="addScreen"></add-screen>

    </div>
</template>

<script>
import PageHeader from '@/components/PageHeader'
import AddScreen from './components/AddScreen'
import { priceSystemDetail } from '@/api/priceSystem'

export default {
    components: {
        PageHeader,
        AddScreen
    },
    data(){
        return {
            showDrawer: true,
            params: {
                pageNo: 1,
                pageSize: 40
            },

            // 数据加载中
            listLoading: false,

            // 列表
            resData: [],

            // 总条数
            totalCount: 0,

            // 价格体系
            priceSystem: {}
        }
    },
    mounted() {
        this.getDetail()
    },
    methods: {
        // 添加或修改屏幕刊例价
        handleShowAddScreen(data){
            this.$refs.addScreen.showAddScreenPriceDialog(data)
        },

        // 获取价格体系详情
        getDetail(){
            this.listLoading = true
            this.params.id = this.$route.params.id
            priceSystemDetail(this.params).then(res => {
                this.listLoading = false
                if(res.code === this.$successCode){
                    let { priceSystem, page } = res.obj
                    let { list, totalRecords } = page
                    this.resData = list
                    this.totalCount = totalRecords
                    this.priceSystem = priceSystem
                }
            })
        },

        // 分页
        handleCurrentChange(page){
            this.params.pageNo = page
            this.getDetail()
        },

        // 每页多少条
        handleSizeChange(size){
            this.params.pageSize = size
            this.getDetail()
        },

        // 搜索
        handleSearch(){
            this.params.pageNo = 1
            this.getDetail()
        }
    }
}
</script>

<style lang="scss" scoped>
    .price-system-screen-list{

        .list{
            display: flex;
            flex-wrap: wrap;
            margin-left: -10px;
            
            .el-card{
                margin: 10px;
                width: 300px;
                position: relative;
    
                .title{
                    font-size: 18px;
                }

                .price{
                    margin-top: 15px;
                    font-weight: bold;
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
                    cursor: pointer;
                    display: none;

                    &:hover{
                        color: var(--color-primary);
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