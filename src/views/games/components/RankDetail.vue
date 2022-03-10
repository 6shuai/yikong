<template>
    <!-- 排行榜数据详情 -->
    <el-drawer
        class="rank-detail-data"
        :show-close="true"
        :title="rankTitle"
        size="1000px"
        :visible.sync="showRankDataDrawer">

        <div class="filter-item">
            <el-form
                :inline="true" 
                label-width="120px"
            >
                <el-form-item label="大屏">
                    <el-select 
                        clearable
                        @change="handleSearch"
                        @clear="$delete(params, 'screenId')"
                        v-model="params.screenId" 
                        placeholder="请选择大屏">
                        <el-option
                            v-for="item in screenData"
                            :key="item.id"
                            :label="item.displayName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="子周期">
                    <el-select 
                        clearable
                        @change="handleSearch"
                        @clear="$delete(params, 'subcycleId')"
                        v-model="params.subcycleId" 
                        placeholder="请选择子周期">
                        <el-option
                            v-for="item in cycleData"
                            :key="item.id"
                            :label="item.displayName"
                            :value="item.id">
                            <!-- <span style="float: left">{{ item.displayName }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">
                                {{ formatTime(item.startTime) }} - {{ formatTime(item.endTime) }}
                            </span> -->
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="是否调试数据">
                    <el-switch 
                        @change="handleSearch"
                        v-model="params.isDebugging"
                        :active-value="1"
                        :inactive-value="0"
                    ></el-switch>
                </el-form-item>

                <el-form-item label="查询边界">
                    <el-input-number 
                        size="samll"
                        v-model="params.border" 
                        controls-position="right" 
                        @change="handleSearch" 
                        :min="0" 
                    ></el-input-number>
                </el-form-item>
                <el-form-item label="查询数量">
                    <el-input-number 
                        size="samll"
                        v-model="params.queryNum" 
                        controls-position="right" 
                        @change="handleSearch" 
                        :min="0" 
                    ></el-input-number>
                </el-form-item>
            </el-form>
        </div>

        <el-scrollbar class="scrollbar">
            <div class="rank-table">
                <el-table
                    v-loading="tableLoading"
                    border
                    stripe
                    size="small"
                    :data="resData"
                    row-key="id"
                >   
                    <el-table-column prop="id" label="头像" width="70">
                        <template slot-scope="scope">
                            <el-image
                                class="cover"
                                :src="scope.row.xfjMember.headimgurl"
                                fit="cover"
                            >
                            </el-image>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="昵称"
                        min-width="60"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.xfjMember.name }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="rankingValue"
                        label="排名"
                        min-width="50"
                    ></el-table-column>
                    <el-table-column
                        prop="numericalValue"
                        label="提交值"
                        min-width="50"
                    ></el-table-column>
                    <el-table-column
                        prop="mobile"
                        label="手机"
                        min-width="60"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.xfjMember.mobile }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="gender"
                        label="性别"
                        min-width="50"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.xfjMember.gender == 1 ? '男' : '女' }}
                        </template>
                    </el-table-column>
                </el-table>
                
            </div>
        </el-scrollbar>
    </el-drawer>
</template>

<script>
import { rankTempData, rankTempScreenList } from '@/api/game';
import { timeDisposeTool } from '@/mixins';

export default {
    mixins: [timeDisposeTool],
    data(){
        return {
            rankTitle: '',
            showRankDataDrawer: false,
            tableLoading: false,
            btnLoading: false,
            resData: [],
            params: {},
            totalCount: 0,
            cycleData: [],        //子周期
            rankId: null,         //排行榜id
            screenData: [],       //大屏列表
        }
    },
    methods: {
        //排行榜详情
        init(){
            this.tableLoading = true;
            rankTempData(this.params).then(res => {
                this.tableLoading = false;
                if(res.code === this.$successCode){
                    let { list } = res.obj;
                    this.resData = list;
                }
            })
        },

        //屏幕列表
        getScreenList(){
            rankTempScreenList({ id: this.rankId }).then(res => {
                this.screenData = res.obj
            })
        },

        showRankData(rankData){
            let { id, displayName } = rankData;
            this.rankTitle = displayName;
            this.showRankDataDrawer = true;
            this.rankId = id;
            this.cycleData = rankData.subcycles || [];
            this.params = {
                border: 0,
                queryNum: 10,
                assemblyId: this.$route.params.gameId,
                rankingListTemp: this.rankId
            }
            this.init();
            this.getScreenList()
        },

        //搜索
        handleSearch(){
            this.init();
        }
    },
}
</script>

<style lang="scss">
    .rank-detail-data{
        .el-input-number{
            width: 200px;
        }

        .cover{
            width: 50px;
            height: 50px;
            border-radius: 50%;
        }

        .scrollbar{
            height: calc(100% - 350px);
            .el-scrollbar__wrap{
                overflow-x: hidden;
            }
            .el-table{
                margin-bottom: 10px;
            }
        }

        .rank-table{
            margin: 20px;
        }
    }
</style>
