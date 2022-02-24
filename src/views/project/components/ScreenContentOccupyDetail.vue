<template>
    <!-- 屏幕 内容占用情况  上刊率-->
    <div class="screen-occupy-detail" v-loading="tLoading">
        <el-form 
            label-width="80px"
        >
            <el-form-item label="刊挂率">
                {{ resData.occupancyRate }}
            </el-form-item>
            <el-form-item label="总时长">
                {{ resData.total }} 秒
            </el-form-item>
            <el-form-item label="占用">
                {{ resData.occupation }} 秒
            </el-form-item>
            <el-form-item label="空闲">
                {{ resData.leisure }} 秒
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
import { projectScreenPublicDetail } from '@/api/project'

export default {
    props: ['data'],
    data(){
        return {
            resData: [],
            tLoading: false
        }
    },
    mounted() {
        this.getScreenOccupyDetail()
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
                if(res.code === this.$successCode){
                    this.resData = res.obj
                }
            })
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