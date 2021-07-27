<template>
    <div class="game-stage-list">
        <el-table
            class="round-data"
            :data="list"
            stripe
        >
            <el-table-column
                prop="gameStage"
                label="游戏阶段"
                :min-width="60"
            >
                <template slot-scope="scope">
                    <el-tag 
                        @click="$refs.screenList.getScreenList(scope.row.id)"
                        class="tag"
                        size="mini" 
                        type="danger">
                        {{ scope.row.gameStage }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="description"
                label="阶段描述"
                :min-width="60"
            >
                <template slot-scope="scope">
                    {{ scope.row.description || '-' }}
                </template> 
            </el-table-column>
            <el-table-column
                prop="spotWay"
                label="插播方式"
                :min-width="60"
            >
                <template slot-scope="scope">
                    {{ scope.row.spotWay ? '阶段内' : '阶段结束' }}
                </template> 
            </el-table-column>
            <el-table-column
                prop="spotWay"
                label="前置时间"
                :min-width="60"
            >
                <template slot-scope="scope">
                    {{ scope.row.interval }}秒
                </template> 
            </el-table-column>
            <el-table-column
                prop="hitCount"
                label="第几次结束该阶段后插播"
                :min-width="60"
            >
            </el-table-column>
            <el-table-column label="操作" width="80">
                <template slot-scope="scope">
                    <el-popover
                        style="margin-left: 10px"
                        placement="top"
                        :ref="scope.row.id"
                        width="200"
                    >
                        <p>此操作将永久删除此数据, 是否继续?</p>
                        <div
                            style="text-align: right; margin: 0"
                        >
                            <el-button
                                size="mini"
                                type="text"
                                @click="
                                    $refs[
                                        scope.row.id
                                    ].doClose()
                                "
                                >取消</el-button
                            >
                            <el-button
                                type="primary"
                                size="mini"
                                @click="
                                    handleDelete(scope.row.id, scope.$index)
                                "
                                >确定</el-button
                            >
                        </div>
                        <el-link slot="reference" type="danger"
                            >删除</el-link
                        >
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>

        <!-- 屏幕列表 -->
        <screen-list 
            ref="screenList"
            :timelineList="timelineList"
        ></screen-list>

    </div>
</template>

<script>
import { cutInAdverRoundDelete } from "@/api/cutInAdver";
import ScreenList from './ScreenList';

export default {
    props: ['list', 'timelineList'],
    methods: {
        //删除游戏阶段
        handleDelete(id, index) {
            if(!id){
                this.params.spotGameStageRelation.splice(index, 1);
                this.$emit('deleteStage', index);
                return
            }
            cutInAdverRoundDelete(id).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('删除成功~');
                    this.$emit('deleteStage', index);
                }
            })
        },

    },
    components: {
        ScreenList
    }
}
</script>

<style lang="scss">
    .game-stage-list{
        .tag{
            cursor: pointer;
        }
    }
</style>