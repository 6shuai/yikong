<template>
    <el-drawer
        class="rank-detail"
        :show-close="true"
        :title="detail.displayName"
        size="700px"
        :visible.sync="drawer">

        <div class="period-wrap">
            <el-button 
                @click="handleAddCycle"
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

                        <el-popover
                            placement="top"
                            :ref="item.id"
                            width="200"
                        >
                            <p>
                                此操作将删除【{{ item.displayName }}】,
                                是否继续?
                            </p>
                            <div style="text-align: right; margin: 0">
                                <el-button
                                    size="mini"
                                    type="text"
                                    @click="$refs[item.id].doClose()"
                                    >取消</el-button
                                >
                                <el-button
                                    type="primary"
                                    size="mini"
                                    @click="handleDelete(item.id)"
                                    >确定</el-button
                                >
                            </div>
                            <el-button size="mini" type="danger" slot="reference">
                                删除
                            </el-button>
                        </el-popover>

                    </span>
                </li>
                <li class="no-data" v-if="!detail.subcycles || !detail.subcycles.length">
                    <span>暂无数据~</span>
                </li>
            </ul>


            <el-dialog
                class="add-game-data"
                title="添加子周期"
                :visible.sync="showCycleDialog"
                width="600px"
                :append-to-body="true"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
            >
                <el-form
                    label-width="100px"
                    ref="addCycleForm"
                    :model="cycleParams"
                    :rules="cycleRules"
                >
                    <el-form-item label="子周期名称" prop="periodingListTemp">
                        <el-input
                            v-model="cycleParams.rankingListTemp"
                            placeholder="子周期名称"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="startTime">
                        <el-date-picker
                            v-model="cycleParams.startTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            placeholder="起始时间"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="endTime">
                        <el-date-picker
                            v-model="cycleParams.endTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            placeholder="起始时间"
                        >
                        </el-date-picker>
                    </el-form-item>
                </el-form>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="showCycleDialog = false">取 消</el-button>
                    <el-button type="primary" v-loading="btnLoading" @click="addRankCycle">确 定</el-button>
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
            cycleParams: {},     //添加子周期
            showCycleDialog: false,
            btnLoading: false,
            cycleRules: {
                periodingListTemp: [ { required: true, trigger: "blur", message: "请输入子周期名称~" } ],
                startTime: [ { required: true, trigger: "blur", message: "请输入子周期开始时间~" } ],
                endTime: [ { required: true, trigger: "blur", message: "请输入子周期结束时间~" } ],
            }
        }
    },
    methods: {
        showDetailDrawer(data){
            this.detail = data;
            this.detail.subcycles = [
                {
                    displayName: 'madongdong',
                    startTime: '2020-12-11 16:48',
                    endTime: '2020-12-30 10:00'
                }
            ]
            this.drawer = true;
        },

        //显示添加子周期窗口
        handleAddCycle(){
            this.showCycleDialog = true;
            this.$nextTick(() => {
                this.$refs['addCycleForm'].clearValidate();
            })
        },

        //创建周期
        addRankCycle(){
            this.$refs.addCycleForm.validate((valid) => {
                if (valid) {
                    this.btnLoading = true;
                    rankTempSubcycleCreated().then(res => {
                        this.btnLoading = false;
                        if(res.code === this.$successCode){
                            this.$message.success('创建成功~');
                            this.showCycleDialog = false;
                        }
                    })
                }
            });
        },

        //删除周期
        handleDelete(id){
            rankTempSubcycleDetele({id}).then(res => {
                if(res.code === this.$successCode){
                    this.$refs[id].doClose()
                    this.$message.success('删除成功~');
                }
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

                    &.content{
                        &:hover{
                            background: #f2ffff;
                        }
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