<template>
    <el-dialog
        width="1100px"
        :title="`${screenName} - 播放限制`"
        :visible.sync="showPlayLimitList"
        append-to-body
    >

        <el-table
            class="mt20 mb20"
            stripe
            size="small"
            :data="resData"
            row-key="id"
            border>
            <el-table-column 
                prop="limitType" 
                label="限制类型" 
                min-width="60"
            >
                <template slot-scope="scope">
                    {{ scope.row.limitType == 1 ? '限制播放' : '禁止播放' }}
                </template>
            </el-table-column>
            <el-table-column 
                prop="limitBeginFormat" 
                label="开始时间" 
                min-width="80"
            >
                <template slot-scope="scope">
                    {{ formDataLimit(scope.row.limitBeginFormat) }}
                </template>
            </el-table-column>
            <el-table-column 
                prop="limitEndFormat" 
                label="结束时间" 
                min-width="80"
            >
                <template slot-scope="scope">
                    {{ formDataLimit(scope.row.limitEndFormat) }}
                </template>
            </el-table-column>
        </el-table>

    </el-dialog>
</template>

<script>
import { findTimeHasYtd } from '@/utils/index'

export default {
    data(){
        return {
            showPlayLimitList: false,

            // 播放限制列表
            resData: [],

            // 屏幕名称
            screenName: ''
        }
    },
    methods: {
        // 显示播放限制列表
        showPlayLimitListDialog(data, screenName){
            this.showPlayLimitList = true
            this.resData = data
            this.screenName = screenName
        },

        formDataLimit(val){
            return findTimeHasYtd(val)
        }
    }
}
</script>