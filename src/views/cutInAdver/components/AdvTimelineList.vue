<template>
    <el-table
        class="mt20 round-data"
        :data="list"
    >
        <el-table-column
            prop="containerId"
            label="广告轴id"
            :min-width="60"
        ></el-table-column>
        <el-table-column
            prop="containerName"
            label="广告轴名称"
            :min-width="60"
        ></el-table-column>
        <el-table-column label="操作" width="80">
            <template slot-scope="scope">
                <el-popover
                    placement="top"
                    :ref="scope.row.id"
                    width="200"
                >
                    <p>此操作将删除此数据, 是否继续?</p>
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
</template>

<script>
import { cutInAdverTimelineDelete } from '@/api/cutInAdver';

export default {
    props: ['list'],
    data(){
        return{
            resData: []
        }
    },
    methods: {
        //删除广告轴
        handleDelete(id, index) {
            if(!id){
                this.params.spotGameStageRelation.splice(index, 1);
                this.$emit('deleteAdvTimeline', index);
                return
            }
            cutInAdverTimelineDelete(id).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('删除成功~');
                    this.$emit('deleteAdvTimeline', index);
                }
            })
        },
    },
}
</script>