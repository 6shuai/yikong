<template>
    <div class="content_play_count_wrap">

        <div 
            class="mb20"
        >   
            <el-input
                class="w220 mr10"
                placeholder="请输入内容名称"
                v-model="params.displayName"
                @input="$debounce(handleSearch)"
            ></el-input>

            <el-select
                class="mr10"
                v-model="params.project"
                clearable
                filterable
                remote
                reserve-keyword
                placeholder="选择项目"
                :remote-method="getProjectList"
                :loading="projectLoading"
                @change="handleSearch"
            >
                <el-option
                    v-for="item in projectData"
                    :key="item.id"
                    :label="item.displayName"
                    :value="item.id">
                </el-option>

                <el-pagination
                    v-if="projectData.length"
                    small
                    layout="total, prev, pager, next"
                    :current-page="Number(params.pageNo)"
                    :page-size="40"
                    @current-change="handleProjectCurrentChange"
                    :total="projectTotalCount">
                </el-pagination>

            </el-select>

            <el-time-picker
                class="mr10"
                v-model="params.beginTime"
                value-format="HH:mm:ss"
                format="HH:mm:ss"
                placeholder="开始时间"
                @change="handleSearch"
            >
            </el-time-picker>
            <el-time-picker
                class="mr10"
                v-model="params.endTime"
                value-format="HH:mm:ss"
                format="HH:mm:ss"
                placeholder="结束时间"
                @change="handleSearch"
            >
            </el-time-picker>

        </div>
        
        <el-table
            v-loading="tLoading"
            stripe
            size="small"
            :data="resData"
            style="width: 100%;margin-bottom: 20px;"
            row-key="id"
            border>
            <el-table-column 
                prop="image" 
                label="缩略图" 
                width="200"
            >
                <template slot-scope="scope">

                    <screen-layout 
                        :screen="scope.row" 
                        :maxWidth="180"
                        :showBorder="false"
                    >
                        <template v-slot="dataDefalut">
                        
                            <img 
                                class="content-image"
                                :src="dataDefalut.data.image" 
                            >
                        </template>
                    </screen-layout>

                </template>
            </el-table-column>
            <el-table-column 
                prop="displayName" 
                label="内容" 
                min-width="120"
            >
                <template slot-scope="scope">
                    <p v-for="(item, index) in scope.row.materialInfo">{{ item.displayName }}</p>
                </template>
            </el-table-column>
            <el-table-column 
                prop="begin" 
                label="播放时间" 
                min-width="60"
            ></el-table-column>
            <el-table-column 
                prop="duration" 
                label="时长(秒)" 
                min-width="60"
            ></el-table-column>
        </el-table>
        
        <el-pagination
            v-if="resData.length"
            background
            layout="total, prev, pager, next"
            :current-page="Number(params.pageNo)"
            :page-size="Number(params.pageSize)"
            @current-change="handleCurrentChange"
            :total="totalCount">
        </el-pagination>

    </div>
</template>

<script>
import { screenTimelineData } from '@/api/screen'
import { projectList } from '@/api/project'
import ScreenLayout from '@/views/screenLayout/components/ScreenLayout'

export default {
    components: {
        ScreenLayout
    },
    data(){
        return {
            tLoading: false,
            params: {
                pageNo: 1,
                pageSize: 40,
                screenId: Number(this.$route.params.id)
            },

            // 播放次数统计列表
            resData: [],

            // 总条数
            totalCount: 0,

            // 项目列表
            projectData: [],

            // 项目列表loading
            projectLoading: false,

            // 项目总条数
            projectTotalCount: 0,

            // 项目搜索条件
            projectParams: {
                pageNo: 1,
                pageSize: 40
            }

        }
    },
    mounted() {
        this.getScreenTimeline()
        this.getProjectList()
    },
    methods: {
        // 获取时间轴数据
        getScreenTimeline(){
            this.tLoading = true
            screenTimelineData(this.params).then(res => {
                this.tLoading = false
                if(res.code === this.$successCode){
                    let { list, totalRecords } = res.obj
                    this.resData = list
                    this.totalCount = totalRecords
                }
            })
        },

        //分页
        handleCurrentChange(page){
            this.params.pageNo = page
            this.getScreenTimeline()
        },
        
        //搜索
        handleSearch(){
            this.params.pageNo = 1
            this.getScreenTimeline()
        },

        // 项目列表
        getProjectList(keyword = ''){
            this.projectParams.displayName = keyword
            projectList(this.projectParams).then(res => {
                this.projectData = res.obj
                let { list, totalRecords } = res.obj
                this.projectData = list
                this.projectTotalCount = totalRecords
            })
        },

        // 项目分页
        handleProjectCurrentChange(page){
            this.projectParams.pageNo = page
            this.getProjectList()
        }

    }
}
</script>
