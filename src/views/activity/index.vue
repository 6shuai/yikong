<template>
    <div class="app-main-wrap activity-list" id="app-main-wrap">

        <div class="game-list-top content-top clearfix">
            <el-button
                v-if="hasPerm($route.meta.permission, 'AddActivity')"
                class="created-btn"
                type="primary"
                icon="el-icon-plus"
                size="small"
                @click="$router.push('activity/add')"
            >
                新建活动
            </el-button>
            <el-input
                class="w200 ml20"
                prefix-icon="el-icon-search"
                clearable
                v-model="params.displayName"
                placeholder="活动名称"
                size="small"
                @input="search"
            ></el-input>

            <el-radio-group 
                class="ml20"
                v-model="params.isFavorite" 
                size="small"
                @change="search"
            >
                <el-radio-button label="0">不限</el-radio-button>
                <el-radio-button label="1">已收藏</el-radio-button>
            </el-radio-group>

            <div class="coupon-right">
                <el-button
                    class="created-btn"
                    type="primary"
                    icon="el-icon-plus"
                    size="small"
                    @click="$router.push('activity/couponAdd')"
                >
                    新建优惠券
                </el-button>
                <el-button
                    class="created-btn"
                    type="primary"
                    size="small"
                    @click="$router.push('activity/coupon')"
                >
                    券列表
                </el-button>
            </div>

        </div>

        <div v-if="!resData || !resData.length" class="no-data">暂无数据~</div>
        
        <div 
            class="mt20" 
            v-if="resData.length"
            v-loading="tableLoading">
            <el-card
                class="item"
                v-for="(item, index) in resData"
                :key="index"
                @click.native="handleEdit(item.id)"
            >
                <div v-if="item.isFavorite" title="已收藏">
                    <div class="triangle-topleft"></div>
                    <i class="el-icon-star-off"></i>
                </div>
                <div class="content">
                    <div class="title">{{ item.displayName }}</div>
                    <div class="desc">{{ item.description }}</div>
                    <!-- <ul class="other">
                        <li>
                            <span>屏幕：
                                <el-tag
                                    class="pond-name-tag"
                                    type="warning"
                                    size="mini">
                                    万达
                                </el-tag>
                            </span>
                        </li>
                        <li>
                            <span>游戏：
                                <el-tag
                                    class="pond-name-tag"
                                    type="info"
                                    size="mini">
                                    头脑网址
                                </el-tag>
                            </span>
                        </li>
                        <li>
                            <span>奖励：
                                <el-tag
                                    class="pond-name-tag"
                                    v-for="item in 2"
                                    :key="item"
                                    type="success"
                                    size="mini">
                                    奖池
                                </el-tag>
                            </span>
                        </li>
                    </ul> -->
                </div>

                <div class="operation">
                    <div class="date">{{ item.beginTime }} - {{ item.endTime }}</div>
                    <div class="btn">
                        <el-button type="primary" size="mini" @click.stop="handleEdit(item.id)">活动详情</el-button>
                        <el-button type="primary" size="mini" @click.stop="handleInsights(item.id)">统计数据</el-button>
                    </div>
                </div>
            </el-card>
        </div>

        <el-pagination
            background
            hide-on-single-page
            layout="total, prev, pager, next, sizes"
            :page-sizes="[48, 80, 100]"
            :current-page="Number(params.pageNo)"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :total="totalCount">
        </el-pagination>

        
    </div>
</template>

<script>
import { activityList } from '@/api/activity';

export default {
    data() {
        return {
            tableLoading: false,
            params: {
                isFavorite: 0,
                pageNo: 1,
                pageSize: 48
            },
            totalCount: 0,
            resData: [],
        };
    },
    computed: {
        gameDetail(){
            return this.$store.state.game.details
        }
    },
    created() {
        this.init();
    },
    methods: {
        init(){
            this.tableLoading = true;
            activityList(this.params).then(res => {
                this.tableLoading = false;
                if(res.code === this.$successCode){
                    let { list, totalRecords } = res.obj;
                    this.resData = list;
                    this.totalCount = totalRecords;
                }
            })
        },

        //页码
        handleCurrentChange(page){
            this.params.pageNo = page;
            this.init();
        },

        //每页多少条
        handleSizeChange(size){
            this.params.pageSize = size;
            this.init();
        },

        //搜索
        search(){
            this.params.pageNo = 1;
            this.init();
        },

        //查看活动详情
        handleEdit(id){
            this.$router.push(`/activity/detail/${id}`);
        },

        //跳转统计数据
        handleInsights(id){
            this.$router.push(`/activity/statistics/${id}`);
        }
    },
};
</script>

<style lang="scss" scope>
.activity-list {
    .coupon-right{
        float: right;
    }

    .pond-name-tag{
        margin: 0 5px 5px 0;
        &:last-child{
            margin: 0;
        }
    }

    .item{
        margin-bottom: 10px;
        cursor: pointer;
        .el-card__body{
            display: flex;
            position: relative;
        }
        .title{
            font-size: 20px;
            cursor: pointer;
            &:hover{
                color: #409eff;
            }
        }
        .content{
            width: calc(100% - 200px);
            .desc{
                color: #999;
                font-size: 14px;
                line-height: 40px;
            }
        }
        .operation{
            width: 300px;
            text-align: right;

            .date{
                font-size: 13px;
                color: #999;
            }
            .btn{
                margin-top: 15px;
            }
        }
        .other{
            display: flex;
            li{
                margin-right: 20px;
                font-size: 13px;
            }
        }

        .triangle-topleft{
            position: absolute;
            top: 0;
            left: 0;
            width: 0;
            height: 0;
            border-top: 30px solid red;
            border-right: 30px solid transparent;
        }
        .el-icon-star-off{
            position: absolute;
            top: 0;
            left: 0;
            line-height: 20px;
            color: #fff;
        }
    }
}
</style>