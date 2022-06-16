<template>
    <div class="project-list-wrap">
        <div class="project-list" v-loading="listLoading">
            <div 
                class="item" 
                :style="{ width: placeW }" 
                v-for="item in resData"
                :key="item.id"
                @click="$emit('jumpPage', item)"
            >
                <el-card shadow="hover">
                    <div class="content flex">
                        <div class="project-img" :style="{ background: `url(${item.image}) center no-repeat` }">
                            <div class="mask flex-center"><span>{{ item.displayName.substr(0, 1) }}</span></div>
                        </div>
                        <div class="project-detail">
                            <div class="name overflow">{{ item.displayName }}</div>
                            <div class="client-name">{{ item.clientName }}</div>

                            <ul>
                                <li class="flex-between-center">
                                    <span v-if="source=='finance'">
                                        <el-tooltip effect="dark" content="负责人" placement="top">
                                            <svg-icon icon-class="project-fz"></svg-icon>
                                        </el-tooltip>
                                        {{ item.nickname }}
                                    </span>
                                    <span v-else>
                                        <el-tooltip effect="dark" content="大屏数量" placement="top">
                                            <svg-icon icon-class="project-pm"></svg-icon>
                                        </el-tooltip>
                                        <b>{{ item.screenCount }}</b>块
                                    </span>
                                    <span>
                                        <el-tooltip effect="dark" content="合同进度" placement="top">
                                            <svg-icon icon-class="project-ht"></svg-icon>
                                        </el-tooltip>
                                        <span :class="{ overdue: item.state==='请尽快上传合同' }">{{ item.state }}</span>
                                    </span>
                                </li>
                                <li>
                                    <span>
                                        <el-tooltip effect="dark" content="回款进度" placement="top">
                                            <svg-icon icon-class="project-hk"></svg-icon>
                                        </el-tooltip>
                                        <span :class="{ overdue: item.overdue }">{{ item.payment }}/{{ item.contractAmount }}</span>
                                    </span>
                                </li>
                                <li>
                                    <span>
                                        <el-tooltip effect="dark" content="发票信息" placement="top">
                                            <svg-icon icon-class="project-fp"></svg-icon>
                                        </el-tooltip>
                                        {{ item.invoiceAmount }}/{{ item.contractAmount }}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="time" v-if="!source">
                        <el-tooltip effect="dark" content="合同时间" placement="top">
                            <svg-icon icon-class="project-sj"></svg-icon>
                        </el-tooltip>
                        {{ item.validBegin }} -- {{ item.validEnd }}
                    </div>
                    
                </el-card>
            </div>
        </div>
        <el-empty v-if="!resData.length && !listLoading" description="暂无项目"></el-empty>

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

    </div>
</template>

<script>
import { screenSizeWatch } from '@/mixins'

export default {
    mixins: [screenSizeWatch],
    props: {
        listLoading: Boolean,
        resData: Array,
        totalCount: Number,
        source: String
    },
    data(){
        return {
            params: {
                pageNo: 1,
                pageSize: 40
            }
        }
    },
    methods: {
         // 分页
        handleCurrentChange(page){
            this.params.pageNo = page
            this.$emit('getList', this.params)
        },

        // 每页多少条
        handleSizeChange(size){
            this.params.pageSize = size
            this.$emit('getList', this.params)
        },

    }
}
</script>

<style lang="scss" scoped>
.project-list-wrap{
    
    .project-list{
        display: flex;
        flex-wrap: wrap;
        margin-left: -10px;

        .item{
            cursor: pointer;
            font-size: 12px;

            .el-card{
                position: relative;

                .el-card__body{
                    padding: 0;
                    margin: 20px 20px 15px;
                }

                .content{
                    .project-img{
                        width: 44px;
                        height: 48px;
                        border-radius: 8px;
                        overflow: hidden;
                        position: relative;

                        .mask{
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            z-index: 99;
                            background: rgba(17, 24, 39, 0.45);

                            span{
                                font-size: 36px;
                                color: #FDFDFD;
                                font-weight: bold;
                            }
                        }
                    }

                    .project-detail{
                        flex: 1;
                        margin-left: 20px;

                        .name{
                            font-size: 14px;
                            padding-bottom: 10px;
                        }

                        .client-name{
                            display: inline-block;
                            color: #06B6D4;
                            border: 1px solid #06B6D4;
                            border-radius: 3px;
                            line-height: 16px;
                            padding: 0 6px;
                        }

                        ul{
                            padding-top: 7px;

                            .overdue{
                                color: red;
                            }
                        }

                    }
                }

                .time, ul>li{
                    padding-top: 6px;

                    line-height: 18px;

                    svg.svg-icon{
                        width: 18px;
                        height: 18px;
                        display: inline-block;
                        vertical-align: bottom;
                        margin-right: 10px;
                    }
                }

            }

        }
    }
}
</style>