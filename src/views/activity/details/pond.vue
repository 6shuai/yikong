<template>
    <div class="activity-pond">
         <el-button
            size="small"
            type="primary"
            plain
            @click="$refs.addPond.showAddPond({}, $route.params.activityId)"
            >添加奖池</el-button
        >
        <el-table
            v-loading="pondLoading"
            stripe
            size="small"
            :data="pondData"
            class="mt10"
            style="width: 100%; margin-bottom: 20px"
            row-key="id"
            border
        >   
            <el-table-column
                prop="displayName"
                label="名称"
                min-width="100"
            ></el-table-column>
            <el-table-column
                prop="description"
                label="描述"
                min-width="150"
            ></el-table-column>
            <el-table-column
                prop="awardCount"
                label="单次发放数量"
                min-width="100"
            ></el-table-column>
            <el-table-column
                prop="awardCount"
                label="规则"
                min-width="100"
            >
                <template slot-scope="scope">
                    {{scope.row.pickSequence == 1? "随机" : "顺序"}}
                </template>
            </el-table-column>
            <el-table-column
                prop="duplicate"
                label="允许重复"
                min-width="100"
            >
                <template slot-scope="scope">
                    {{ scope.row.duplicate ? "允许" : "不允许" }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="110">
                <template slot-scope="scope">
                    <el-link
                        type="primary"
                        @click.stop="
                            $refs.addPond.showAddPond(scope.row, $route.params.activityId)
                        "
                        >编辑</el-link
                    >
                    <span class="ml20" v-if="pondData.deleteAwardPool"> 
                        <el-popover
                            placement="top"
                            :ref="scope.row.id"
                            width="200"
                        >
                            <p>
                                此操作将删除【{{
                                    scope.row.displayName
                                }}】, 是否继续?
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
                                        handleDeletePond(
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

        <!-- 添加奖池 -->
        <add-pond 
            ref="addPond" 
            :detailData="pondData"
            @pondCreatedSuccess="getPondList"
        ></add-pond>
    </div>
</template>

<script>
import { activityPondList, activityPondDelete } from '@/api/activity';
import AddPond from "../components/AddPond";

export default {
    data(){
        return{
            pondData: [],
            pondLoading: false,
        }
    },
    components: {
        AddPond
    },
    mounted() {
        this.getPondList();
    },
    methods: {
        //根据活动id 查询奖池列表
        getPondList() {
            this.pondLoading = true;
            activityPondList({ promotionId: this.$route.params.activityId }).then(
                (res) => {
                    this.pondLoading = false;
                    if (res.code === this.$successCode) {
                        this.pondData = res.obj;
                    }
                }
            ); 
        },

        //删除奖池
        handleDeletePond(id, index) {
            let data = `?id=${id}`;
            activityPondDelete(data).then((res) => {
                if (res.code === this.$successCode) {
                    this.$message.success("删除成功~");
                    this.pondData.splice(index, 1);
                    this.$refs[id][0].doClose();
                }
            });
        }
    },
}
</script>
