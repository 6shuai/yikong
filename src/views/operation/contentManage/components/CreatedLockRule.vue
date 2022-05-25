<template>
    <el-dialog
        width="520px"
        title="创建屏幕时长规则"
        :visible.sync="showCreateRule"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
    >
        <el-form label-width="80px">
            <el-form-item label="时长类型">
                <el-radio-group 
                    size="mini" 
                    v-model="addParams.type"
                >
                    <el-radio-button :label="4">按比例</el-radio-button>
                    <el-radio-button :label="2">按时长</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="时长数值">
                <el-input-number
                    size="mini" 
                    v-model="addParams.duration" 
                    :controls="false"
                    :min="0"
                    :placeholder="addParams.type == 4 ? '请输入比例' : '请输入时长'"
                ></el-input-number>
                <span v-if="addParams.type==4">%</span>
                <el-radio-group 
                    size="mini" 
                    v-if="addParams.type == 2"
                    v-model="addParams.durationType"
                >
                    <el-radio-button :label="1">分钟</el-radio-button>
                    <el-radio-button :label="2">小时</el-radio-button>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="showCreateRule = false">取 消</el-button>
            <el-button
                size="mini"
                type="primary"
                :loading="createdLoading"
                @click="handleCreate"
                >确 定</el-button
            >
        </span>
    </el-dialog>
</template>

<script>

export default {
    data(){
        return {
            showCreateRule: false,
            createdLoading: false,
            addParams: {},
        }
    },
    methods: {
        // 显示新建屏幕时长窗口
        showCreateRuleDialog(){
            this.showCreateRule = true
            this.addParams = {
                type: 4, 
                durationType: 1
            }
        },

        // 创建屏幕时长规则
        handleCreate(){
            let data = JSON.parse(JSON.stringify(this.addParams))
            if(data.durationType == 1 && data.type == 2) {
                let minute = data.duration % 60
                let hour = (data.duration - minute < 60) ? 0 : (data.duration - minute) / 60
                let msg = ''
                if(hour) msg += `${hour}小时`
                if(minute) msg += `${minute}分钟`
                data.durationText = msg   
            }else if(data.durationType == 2 && data.type == 2){
                data.durationText = `${data.duration}小时`
            }
            if(data.duration){
                this.$emit('addLockRule', data)
                this.showCreateRule = false
            }
        }
    },
}
</script>