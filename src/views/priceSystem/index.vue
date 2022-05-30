<template>
    <div 
        class="app-main-wrap price-system-wrap"
        v-loading="loading"
    >
        <div class="price-stystem-filter-wrap">
            <div class="left-filter">
                <p>价格体系</p>
                <ul>
                    <li 
                        v-for="item in typeData" 
                        :key="item.id"
                        :class="{ active: currentType == item.id }"
                        @click="currentType=item.id; handleSearch()"
                    >{{ item.name }}</li>
                </ul>
            </div>
            <div class="right-btn-wrap">
                <el-button 
                    icon="el-icon-plus"
                    type="primary"
                    size="small"
                    @click="handleShowCreateSystem()"
                >
                    新建价格体系
                </el-button>
                <el-button type="primary" size="small" @click="showCheckbox=true">管理</el-button>
            </div>
        </div>
        
        <el-input 
            clearable
            suffix-icon="el-icon-search" 
            v-model="params.displayName"
            @input="$debounce(handleSearch)"
        ></el-input>

        <el-card
            v-for="(item, index) in resData"
            :key="index"
            @click.native.prevent="$router.push(`/priceSystem/${item.id}`)"
        >
            <el-checkbox 
                v-show="showCheckbox"
                :value="priceSystemIds.includes(item.id)"
                @change="handelSelectPriceSystem(item)"
                @click.stop.native="()=>{}"
            ></el-checkbox>

            <!-- 是否生效 effect: 1生效  2否 -->
            <!-- <div v-if="item.effect==1" class="dot"></div> -->
            <div class="type" :class="{ 'insert': item.lockType != 1 }">{{ item.lockType == 1 ? '轮播' : '插播' }}</div>

            <div class="title overflow">{{ item.displayName }}</div>
            <p v-if="item.lockType == 1 && item.priceSystemConfigCarouselTimes">
                <span>{{ item.priceSystemConfigCarouselTimes.duration }}秒</span>
                <span>{{ item.priceSystemConfigCarouselTimes.times }}次</span>
                <span>{{ item.priceSystemConfigCarouselTimes.days }}天</span>
            </p>
            <p v-if="item.lockType == 3 && item.priceSystemConfigSpot">
                <span>{{ item.priceSystemConfigSpot.duration }}秒</span>
                <span>{{ item.priceSystemConfigSpot.days }}天</span>
            </p>
            <p> 失效日期：{{ item.dueDateFormat || '--' }}</p>
            <p class="desc">{{ item.description }}</p>
        </el-card>

        <el-pagination
            background
            :hide-on-single-page="true"
            layout="total, prev, pager, next, sizes"
            :current-page="Number(params.pageNo)"
            :page-size="Number(params.pageSize)"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :total="totalCount">
        </el-pagination>   

        <ul class="price-system-bottom" v-if="showCheckbox">
            <li @click="handleCopy"><i class="el-icon-copy-document"></i>创建体系副本</li>
            <li @click="handleDelete"><i class="el-icon-delete"></i>删除</li>
            <li>
                <el-button size="small" @click="handleCloseManage">取消</el-button>
            </li>
        </ul>



        <!-- 创建价格体系 -->
        <create-price-system 
            ref="createPriceSystem"
            @createSuccess="init()"
        ></create-price-system>

    </div>
</template>

<script>
import { priceSystemList, priceSystemDelete, priceSystemCopy } from '@/api/priceSystem'
import CreatePriceSystem from './components/CreatePriceSystem'

export default {
    components: {
        CreatePriceSystem
    },
    data(){
        return {
            loading: false,
            // 价格体系类型
            typeData: [
                { id: 0, name: '全部' },
                { id: 1, name: '轮播' },
                { id: 3, name: '插播' },
                // { id: 4, name: '游戏' }
            ],

            // 当前选中的价格体系类型
            currentType: 0,

            params: {
                pageNo: 1,
                pageSize: 40
            },
            
            resData: [],

            // 总条数
            totalCount: 0,

            // 选中的价格体系id
            priceSystemIds: [],

            // 是否包含正在使用的价格体系
            effectIds: [],

            // 是否显示checkbox
            showCheckbox: false
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init(){
            this.loading = true
            priceSystemList(this.params).then(res => {
                this.loading = false
                if(res.code === this.$successCode){
                    let { list, totalRecords } = res.obj
                    this.resData = list
                    this.totalCount = totalRecords
                }
            }) 
        },

        // 分页
        handleCurrentChange(page){
            this.params.pageNo = page
            this.init()
        },

        // 每页多少条
        handleSizeChange(size){
            this.params.pageSize = size
            this.init()
        },

        // 搜索
        handleSearch(){
            this.params.pageNo = 1
            this.params.lockType = this.currentType
            if(!this.params.lockType) delete this.params.lockType
            this.init()
        },

        // 显示创建价格体系
        handleShowCreateSystem(){
            this.$refs.createPriceSystem.init()
        },

        // 选择价格体系
        handelSelectPriceSystem({ id, effect }){
            if(this.priceSystemIds.includes(id)){
                let index = this.priceSystemIds.indexOf(id)
                this.priceSystemIds.splice(index, 1)

                if(effect == 1){
                    let effectIndex = this.effectIds.indexOf(id)
                    this.effectIds.splice(effectIndex)
                }

            }else{
                this.priceSystemIds.push(id)

                if(effect == 1){
                    this.effectIds.push(id)
                }
            }
        },

        // 删除
        handleDelete(){
            if(!this.priceSystemIds.length) return

            let msg = '您确定要删除所选价格体系吗?'
            if(this.effectIds.length) msg = '您将删除的内容中,包含正在使用的价格体系,暂不可删除'

            this.$confirm(
                msg,
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: !this.effectIds.length ? '取消' : '确定',
                    showConfirmButton: !this.effectIds.length,
                    type: "warning",
                    center: true,
                }
            ).then(() => {
                let data = JSON.parse(JSON.stringify(this.priceSystemIds))
                priceSystemDelete(data.join(',')).then(res => {
                    if(res.code === this.$successCode){
                        this.$message.success('删除成功~')
                        this.init()
                        this.handleCloseManage()
                    }
                })
            })
        },

        // 复制价格体系
        handleCopy(){
            if(!this.priceSystemIds.length) return
            let data = JSON.parse(JSON.stringify(this.priceSystemIds))
            priceSystemCopy(data.join(',')).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('操作成功~')
                    this.init()
                    this.handleCloseManage()
                }
            })
        },

        // 关闭管理
        handleCloseManage(){
            this.showCheckbox = false
            this.priceSystemIds = []
            this.effectIds = []
        }
    }
}

</script>

<style lang="scss">
    .price-system-wrap{

        .price-stystem-filter-wrap{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 0;

            .left-filter{
                display: flex;
                align-items: center;

                p{
                    font-weight: bold;
                    font-size: 18px;
                }

                ul{
                    margin-left: 10px;
                    
                    li{
                        display: inline-block;
                        padding: 5px 10px;
                        border-radius: 6px;
                        margin-right: 5px;
                        cursor: pointer;

                        &:hover{
                            background: var(--color-primary);
                            color: #fff;
                        }

                        &.active{
                            background: var(--color-primary);
                            color: #fff;
                        }
                    }
                }
            }
        }
        
        .el-card{
            width: 300px;
            cursor: pointer;
            display: inline-block;
            margin: 20px 20px 0 0;
            position: relative;

            .type, .dot{
                font-size: 14px;
                position: absolute;
                top: 0;
                right: 0;
                padding: 10px;
                background: #CEB5FF;
                z-index: 99;

                &.insert{
                    background: #FFE1B5;
                }
            }

            .dot{
                padding: 5px;
                left: 0;
                right: auto;
                background: var(--color-primary);
                border-radius: 50%;
            }

            .el-checkbox{
                position: absolute;
                top: 0;
                left: 0;
                z-index: 99;

                .el-checkbox__inner{
                    width: 20px !important;
                    height: 20px !important;
                    
                    &::after{
                        height: 10px;
                        left: 7px;
                        top: 2px;
                    }
                }
            }

            .title{
                font-weight: bold;
                padding-bottom: 10px;
            }

            p{
                font-size: 14px;
                height: 26px;
                line-height: 26px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

                span{
                    margin-right: 10px;
                }

                &.desc{
                    color: #999;
                }
            }
        }

        .price-system-bottom{
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: end;
            background: #eeeeee;

            li{
                margin-right: 40px;
                cursor: pointer;
                i{
                    margin-right: 5px;
                }
            }
        }
    }
</style>