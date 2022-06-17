<template>
    <el-dialog
        width="650px"
        custom-class="lock-fail-detail-dialog"
        :visible.sync="showScreenContentOccupyList"
        :title="`${failDate} 失败详情`"
        append-to-body
        v-loading="dataLoading"
    >
        <el-form label-width="130px">
            <el-form-item label="大屏名称：">
                {{ screenName }}
            </el-form-item>
            <el-form-item label="屏幕可用时长：" class="leisure">
                {{ resData.leisure ? resData.leisure <  0 ? 0 : resData.leisure : 0 }}s
            </el-form-item>
            <el-form-item label="订单所需时长：">
                {{ orderDuration || 0 }}s
            </el-form-item>
            <el-form-item label="屏幕占用总时长：">
                {{ resData.occupation || 0 }}s
            </el-form-item>
        </el-form>

        <div class="project-list" v-if="resData.details && resData.details.length">
            <el-row class="item">
                <el-col :span="6">所属项目</el-col>
                <el-col :span="5">负责人</el-col>
                <el-col :span="8">订单时间</el-col>
                <el-col :span="5">订单占用情况</el-col>
            </el-row>
            <el-row class="item" v-for="(item, index) in resData.details" :key="index">
                <el-col :span="6">{{ item.projectName }}</el-col>
                <el-col :span="5">{{ item.nickname || '-' }}</el-col>
                <el-col :span="8">{{ item.publishDate }} -- {{ item.dueDate }}</el-col>
                <el-col :span="5">{{ item.duration }}s</el-col>
            </el-row>
        </div>

        <div class="mt20 flex-center">
            <el-button type="primary" @click="showScreenContentOccupyList=false">确认</el-button>
        </div>

    </el-dialog>
</template>

<script>
import { projectScreenUseDetail } from '@/api/project'
import { timeDifference } from '@/utils/index'

export default {
    data() {
        return {
            showScreenContentOccupyList: false,

            // 加载中
            dataLoading: false,
            
            // 失败日期
            failDate: null,

            // 大屏名称
            screenName: '',

            // 订单时长
            orderDuration: null,

            resData: {}
        }
    },
    methods: {
        showFailDetail(date, { displayName, id }, orderDuration){
            this.resData = {}
            this.failDate = date
            this.screenName = displayName
            this.showScreenContentOccupyList = true
            this.dataLoading = true
            this.orderDuration = orderDuration

            projectScreenUseDetail({ date, screen: id }).then(async res => {
                this.dataLoading = false
                if(res.code === this.$successCode){
                    let { projects, beginTime, endTime } = res.obj

                    // 总时长
                    let totalDuration = timeDifference(beginTime, endTime)
                    
                    // 占用时长 和 项目占用详情列表
                    let { details, occupation } = await this.calculateOccupancy(projects)

                    this.resData = {
                        total: totalDuration,
                        occupation,
                        leisure: totalDuration - occupation,
                        details
                    }
                }
            })
        },

        // 计算占用时长
        calculateOccupancy(projects){
            let details = []
            let occupation = 0
            for(let i = 0; i < projects.length; i++){
                let item = projects[i]
                let orderDuration = 0
                details.push({
                    projectName: item.name
                })

                for(let j = 0; j < item.orders.length; j++){
                    let { duration, times, type, publishDate, dueDate } = item.orders[j]
                    orderDuration += type === 1 ? duration * times : type === 3 ? duration : 0 
                    details[i].duration = orderDuration
                    details[i].publishDate = publishDate
                    details[i].dueDate = dueDate
                }

                occupation += orderDuration
            }
            return {
                details,
                occupation
            }
        }

    }
}
</script>

<style lang="scss">
    .lock-fail-detail-dialog{
        .el-form {
            font-weight: bold;

            .leisure{
                color: red;
            }
        }

        .item{
            text-align: center;
            padding: 10px 0;
        }
    }
</style>