<template>
    <el-drawer
        class="rank-detail"
        :show-close="true"
        :title="detail.displayName"
        :visible.sync="drawer">
        <el-form 
            label-width="100px"
        >
            <el-form-item label="模板描述">
                {{detail.displayName}}
            </el-form-item>
            <el-form-item label="最大条数">
                {{detail.maxCount}}
            </el-form-item>
            <el-form-item label="排行榜类型">
                {{detail.rankingListType}}
            </el-form-item>
            <el-form-item label="数据前缀">
                {{detail.prefix}}
            </el-form-item>
            <el-form-item label="数据后缀">
                {{detail.suffix}}
            </el-form-item>
        </el-form>

        <div class="period-wrap">
            <el-button 
                size="small" 
                type="primary"
                icon="icon-plus"
            >添加周期</el-button>

            <ul>
                <li class="head">
                    <span class="item">名称</span>
                    <span class="item">开始时间</span>
                    <span class="item">结束时间</span>
                    <span class="item">操作</span>
                </li>
                <li 
                    v-for="(item, index) in detail.subcycles"
                    :key="index"
                    class="content">
                    <span class="item">{{item.displayName}}</span>
                    <span class="item">{{item.startTime}}</span>
                    <span class="item">{{item.endTime}}</span>
                    <span class="item">
                        <el-button
                            @click="delPeriod(item.id)"
                            type="danger"
                            size="mini"
                        >删除</el-button>
                    </span>
                </li>
                <li class="no-data">
                    <span>暂无数据~</span>
                </li>
            </ul>


            <el-dialog
                class="add-game-data"
                title="添加子周期"
                :visible.sync="dialogVisible"
                width="600px"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
            >
                <el-form
                    label-width="100px"
                    ref="addPeriodForm"
                    :model="periodParams"
                    :rules="periodRules"
                >
                    <el-form-item label="子周期名称" prop="periodingListTemp">
                        <el-input
                            v-model="periodParams.rankingListTemp"
                            placeholder="子周期名称"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="startTime">
                        <el-form-item label="开始时间">
                            <el-date-picker
                                v-model="periodParams.startTime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                format="yyyy-MM-dd HH:mm:ss"
                                placeholder="起始时间"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="endTime">
                        <el-form-item label="结束时间">
                            <el-date-picker
                                v-model="periodParams.endTime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                format="yyyy-MM-dd HH:mm:ss"
                                placeholder="起始时间"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-form-item>
                </el-form>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" v-loading="btnLoading" @click="addRankPeriod">确 定</el-button>
                </span>
            </el-dialog>

        </div>

    </el-drawer>
</template>

<script>
import { rankTempSubcycleCreated, rankTempSubcycleDetele } from '@/api/game';
export default {
    data(){
        return {
            drawer: false,
            detail: {},
            periodParams: {},     //添加子周期
        }
    },
    methods: {
        showDetailDrawer(data){
            this.detail = data;
            this.detail.subcycles = [
                {
                    displayName: '111111111',
                    startTime: '23523523',
                    endTime: '235346'
                }
            ]
            this.drawer = true;
        },

        //创建周期
        addRankPeriod(){
            rankTempSubcycleCreated().then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('创建成功~');
                }
            })
        },

        //删除周期
        delPeriod(id){
            rankTempSubcycleDetele({id}).then(res => {
                this.$message.success('删除成功~');
            })
        }
    },
}
</script>

<style lang="scss" scope>
    .rank-detail{
        .el-form-item{
            margin-bottom: 10px;
        }
        .period-wrap{
            padding: 10px;

            ul{
                margin-top: 20px;
                li{
                    padding: 10px;
                    display: flex;
                    border-bottom: 1px solid #e5e5e5;
                    &:last-child{
                        border: none;
                    }
                    span.item{
                        flex: 1;
                        text-align: center;
                        line-height: 28px;
                    }

                    &.head{
                        background: #f38181;
                        color: #fff;
                    }

                    &.no-data{
                        line-height: 40px;
                        span{
                            margin: 0 auto;
                        }
                    }
                }
            }
        }

    }
</style>