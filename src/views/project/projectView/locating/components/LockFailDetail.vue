<template>
    <el-dialog
        width="650px"
        custom-class="lock-fail-detail-dialog"
        :visible.sync="showScreenContentOccupyList"
        :title="`${failDate} 失败详情`"
        append-to-body
    >
        <el-form label-width="130px">
            <el-form-item label="大屏名称：">
                罗斯福大屏
            </el-form-item>
            <el-form-item label="屏幕可用时长：">
                3600s
            </el-form-item>
            <el-form-item label="订单所需时长：">
                7200s
            </el-form-item>
            <el-form-item label="屏幕占用总时长：">
                18000s
            </el-form-item>
        </el-form>

        <div class="project-list">
            <el-row class="item">
                <el-col :span="6">所属项目</el-col>
                <el-col :span="5">负责人</el-col>
                <el-col :span="8">订单时间</el-col>
                <el-col :span="5">订单占用情况</el-col>
            </el-row>
            <el-row class="item">
                <el-col :span="6">项目名称</el-col>
                <el-col :span="5">负责人</el-col>
                <el-col :span="8">2022-06-13 -- 2022-06-223</el-col>
                <el-col :span="5">7200s</el-col>
            </el-row>
        </div>

        <div class="mt20 flex-center">
            <el-button type="primary" @click="showScreenContentOccupyList=false">确认</el-button>
        </div>

    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            showScreenContentOccupyList: false,
            
            // 失败日期
            failDate: null
        }
    },
    methods: {
        showFailDetail(date){
            this.failDate = date
            this.showScreenContentOccupyList = true
        }
    }
}
</script>

<style lang="scss">
    .lock-fail-detail-dialog{
        .item{
            text-align: center;
            padding: 10px 0;
        }
    }
</style>