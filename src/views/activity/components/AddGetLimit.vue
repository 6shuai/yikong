<template>
    <div>
        <el-button
            size="small"
            type="primary"
            plain
            @click="$refs.addGetLimit.showGetLimit()"
            >添加领取限制</el-button
        >
        <el-table
            v-loading="limitLoading"
            stripe
            size="small"
            :data="limitData"
            style="width: 100%; margin-bottom: 20px"
            class="mt10"
            row-key="id"
            border
        >   
            <!-- <el-table-column
                prop="claimLimit"
                label="限制类型"
                min-width="100"
            >
                <template slot-scope="scope">
                    {{scope.row.claimLimit == 1? "单品限制" : "总量限制"}}
                </template>
            </el-table-column> -->
            <el-table-column
                prop="beginType"
                label="开始时间类型"
                min-width="150"
            >
                <template slot-scope="scope">
                    {{scope.row.beginType == 1? "活动期间" : "固定时间"}}
                </template>
            </el-table-column>
            <el-table-column
                prop="beginTime"
                label="开始时间"
                min-width="100"
            ></el-table-column>
            <el-table-column
                prop="endType"
                label="结束时间类型"
                min-width="100"
            >
                <template slot-scope="scope">
                    {{scope.row.endType == 1? "活动期间" : "固定时间"}}
                </template>
            </el-table-column>
            <el-table-column
                prop="endTime"
                label="结束时间"
                min-width="100"
            >
            </el-table-column>
            <el-table-column
                prop="limit"
                label="限制数量"
                min-width="100"
            >
            </el-table-column>
            <el-table-column label="操作" width="110">
                <template slot-scope="scope">
                    <el-link
                        type="primary"
                        @click.stop="
                            $refs.addGetLimit.showGetLimit(scope.row)
                        "
                        >编辑</el-link
                    >
                    <span class="ml20"> 
                        <el-popover
                            placement="top"
                            :ref="scope.row.id"
                            width="200"
                        >
                            <p>
                                此操作将删除此限制条件, 是否继续?
                            </p>
                            <div
                                style="text-align: right; margin: 0"
                            >
                                <el-button
                                    size="mini"
                                    type="text"
                                    @click="
                                        $refs[scope.row.id][0].doClose()
                                    "
                                    >取消</el-button
                                >
                                <el-button
                                    type="primary"
                                    size="mini"
                                    @click="
                                        handleDeleteLimit(
                                            scope.row.id,
                                            scope.$index
                                        )
                                    "
                                    >确定</el-button
                                >
                            </div>
                            <el-link
                                type="danger"
                                slot="reference"
                                >删除</el-link
                            >
                        </el-popover>
                    </span>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加领取限制 -->
        <add-get-limit
            ref="addGetLimit"
            :ponId="ponId"
            :activityId="activityId"
            @limitCreatedSuccess="getLimitList"
        ></add-get-limit>
        
    </div>
</template>

<script>
import AddGetLimit from './GetLimit';
import { activityLimitList, activityPondLimitList, activityLimitDelete, activityPondLimitDelete } from '@/api/activity';
export default {
    props: ['ponId', 'activityId'],
    data(){
        return{
            limitData: [],           //领取限制 数据
            limitLoading: false,     //领取限制列表 loading
        }
    },
    mounted() {
        this.getLimitList();
    },
    methods: {
        //根据活动id 查询领取限制列表
        getLimitList() {
            this.limitLoading = true;
            if(!this.ponId){
                activityLimitList({ promotionId: this.activityId }).then(
                    (res) => {
                        this.limitLoading = false;
                        if (res.code === this.$successCode) {
                            this.limitData = res.obj;
                        }
                    }
                ); 
            }else{
                activityPondLimitList({ itemId: this.ponId }).then(
                    (res) => {
                        this.limitLoading = false;
                        if (res.code === this.$successCode) {
                            this.limitData = res.obj;
                        }
                    }
                ); 
            }
        },

        //删除限制规则
        handleDeleteLimit(id, index) {
            let data = `?id=${id}`;
            let deleteApi = activityLimitDelete;
            if(this.ponId) deleteApi = activityPondLimitDelete;
            deleteApi(data).then((res) => {
                if (res.code === this.$successCode) {
                    this.$message.success("删除成功~");
                    this.limitData.splice(index, 1);
                    this.$refs[id][0].doClose();
                }
            });
        },
    },
    components: {
        AddGetLimit
    }
}
</script>