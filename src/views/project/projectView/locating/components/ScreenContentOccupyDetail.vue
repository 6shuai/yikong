<template>
    <!-- 屏幕 内容占用情况  上刊率-->
    <div class="screen-occupy-detail" v-loading="tLoading">
        <el-form 
            label-width="80px"
        >
            <el-form-item label="刊挂率" v-if="resData.occupancyRate">
                {{ resData.occupancyRate }}
            </el-form-item>
            <el-form-item label="总时长">
                {{ resData.total }} 秒
            </el-form-item>
            <el-form-item label="占用">
                {{ resData.occupation }} 秒
            </el-form-item>
            <el-form-item label="空闲">
                {{ resData.leisure > 0 ? resData.leisure : 0 }} 秒
            </el-form-item>
            <el-form-item label="详情">
            </el-form-item>
            <el-table
                class="occupy-detail"
                stripe
                size="small"
                :data="resData.details"
                border>
                <el-table-column 
                    prop="projectName" 
                    label="项目" 
                    min-width="100"
                >
                </el-table-column>
                <el-table-column 
                    prop="duration" 
                    label="时长(秒)" 
                    min-width="100"
                >
                </el-table-column>
                <el-table-column 
                    v-if="source != 'locating'"
                    prop="state" 
                    label="状态" 
                    min-width="100"
                >
                </el-table-column>
            </el-table>
        </el-form>

    </div>

</template>

<script>
import { projectScreenPublicDetail, projectScreenUseDetail } from '@/api/project'
import { timeDifference } from '@/utils/index'

export default {
    props: {
        data: Object,
        source: String
    },
    data(){
        return {
            resData: [],
            tLoading: false
        }
    },
    mounted() {
        if(this.source === 'locating'){
            this.getScreenUseDetail()
        }else{
            this.getScreenOccupyDetail()
        }
    },
    methods: {
        // 获取屏幕某天的刊挂信息  占用情况
        getScreenOccupyDetail(date){
            let data = {
                screenId: this.data.screenId,
                date: date ? date : this.data.date
            }
            this.tLoading = true
            projectScreenPublicDetail(data).then(res => {
                this.tLoading = false
                this.resData = res.obj
            })
        },

        // 寻位锁位失败后  查询某天的占用情况
        getScreenUseDetail(){
            let data = {
                screen: this.data.screenId,
                date: this.data.date
            }
            projectScreenUseDetail(data).then(async res => {
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
                    let { duration, times, type } = item.orders[j]
                    orderDuration += type === 1 ? duration * times : type === 3 ? duration : 0 
                    details[i].duration = orderDuration
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
    .screen-occupy-detail{
        cursor: pointer;

        .occupy-detail{
            width: 90%;
            margin-left: 40px;
        }
    }
</style>