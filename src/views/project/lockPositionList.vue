<template>
    <div class="lock-position-list">
        <div class="mb20">
            <el-tag class="mr20" type="primary">总刊例价: {{ resData.totalPrice }}</el-tag>

            <el-button 
                type="primary"
                size="small"
                @click="$refs.locating.showLoacting()"
            >
                寻 位
            </el-button>
        </div>
        
        <h3 class="mb10">锁位列表</h3>
        <el-table
            class="mt20 mb20"
            stripe
            size="small"
            :data="resData.publishedPlaceholders"
            row-key="id"
            v-loading="tLoading"
            border>
            <el-table-column 
                prop="screenName" 
                label="屏幕名称" 
                min-width="100"
            >
            </el-table-column>
            <el-table-column 
                prop="materialDuration" 
                label="物料时长" 
                min-width="50"
            >
            </el-table-column>
            <el-table-column 
                prop="publishedTimes" 
                label="播放次数" 
                min-width="50"
            >
            </el-table-column>
            <el-table-column 
                prop="fromTimeFormat" 
                label="上刊时间" 
                min-width="80"
            >
                <template slot-scope="scope">
                    {{ dateAddHMS(scope.row.fromTimeFormat) }}
                </template>
            </el-table-column>
            <el-table-column 
                prop="toTimeFormat" 
                label="下刊时间" 
                min-width="80"
            >
                <template slot-scope="scope">
                    {{ dateAddHMS(scope.row.toTimeFormat) }}
                </template>
            </el-table-column>
            <el-table-column 
                prop="count" 
                label="数量" 
                min-width="50"
            ></el-table-column>
            <el-table-column 
                prop="beginTime" 
                label="操作"
                width="180"
            >
                <template slot-scope="scope">
                    <el-popconfirm
                        confirm-button-text='删除'
                        cancel-button-text='取消'
                        icon="el-icon-info"
                        icon-color="red"
                        title="此操作将删除此锁位, 是否继续?"
                        class="mr10"
                        @confirm="handleDelete(scope.row.id)"
                    >
                        <el-button 
                            type="danger" 
                            slot="reference"
                            size="mini"
                            plain
                        >
                            删除
                        </el-button>
                    </el-popconfirm>

                    <el-button
                        type="primary"
                        size="mini"
                        plain
                        v-if="scope.row.publishedLimitPlaceholders && scope.row.publishedLimitPlaceholders.length"
                        @click="$refs.lockPositionPlayLimitList.showPlayLimitListDialog(scope.row.publishedLimitPlaceholders, scope.row.screenName)"
                    >
                        播放限制
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 播放限制列表 -->
        <lock-position-play-limit-list ref="lockPositionPlayLimitList"></lock-position-play-limit-list>

        <!-- 寻位 -->
        <locating ref="locating" @lockPositionSuccess="getScreenList"></locating>

    </div>
</template>

<script>
import { projectLockPositionList, projectLockPositionDelete } from '@/api/project'
import { dateAddHMS } from '@/utils/index'
import LockPositionPlayLimitList from '@/views/project/components/LockPositionPlayLimitList'
import Locating from '@/views/project/components/Locating'

export default {
    components: {
        LockPositionPlayLimitList,
        Locating
    },
    data(){
        return {
            resData: [],
            tLoading: false
        }
    },
    mounted() {
        this.getScreenList()
    },
    methods: {
        // 获取锁位列表
        getScreenList(){
            let data = {
                project: this.$route.params.id
            }
            this.tLoading = true
            projectLockPositionList(data).then(res => {
                this.tLoading = false
                if(res.code === this.$successCode){
                    this.resData = res.obj
                }
            })
        },

        // 删除
        handleDelete(id){
            projectLockPositionDelete(id).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('删除成功~')
                    this.getScreenList()
                }
            })
        },

        dateAddHMS(val){
            return dateAddHMS(val)
        }
    }
}
</script>

<style lang="scss">
    .material_screen_tag{
        cursor: pointer;
    }
</style>