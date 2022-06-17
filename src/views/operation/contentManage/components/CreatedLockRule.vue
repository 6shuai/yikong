<!--
 * @Author: liushuai
 * @Date: 2022-06-06 10:38:17
 * @LastEditors: liushuai
 * @LastEditTime: 2022-06-17 15:06:43
 * @Description: file content
 * @FilePath: \pclient\src\views\operation\contentManage\components\CreatedLockRule.vue
-->
<template>
    <el-dialog
        width="520px"
        title="创建屏幕时长规则"
        custom-class="operation-created-lock-rule"
        :visible.sync="showCreateRule"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
    >
        <el-form label-width="80px">
            <el-form-item label="时长类型">
                <el-radio-group 
                    class="text-zd"
                    v-model="addParams.type"
                    @change="addParams.duration = null"
                >
                    <el-radio-button :label="2"><svg-icon icon-class="time"></svg-icon>按时长</el-radio-button>
                    <el-radio-button :label="4"><svg-icon icon-class="%"></svg-icon>按比例</el-radio-button>
                </el-radio-group>

            </el-form-item>
            <el-form-item label="时长数值">
                <div class="duration-value" :class="{ active: isFocus }">
                    <svg-icon :icon-class="addParams.type == 4  ? '%' : 'time'"></svg-icon>
                    <el-input-number
                        v-model="addParams.duration" 
                        :controls="false"
                        :min="1"
                        :max="addParams.type == 4 ? 100 : addParams.durationType == 2 ? 24 : 24 * 60"
                        style="width: 200px"
                        :placeholder="addParams.type == 4 ? '请输入比例' : '请输入时长'"
                        @focus="isFocus = true"
                        @blur="isFocus = false"
                    >
                    </el-input-number>
                </div>

                <el-radio-group 
                    class="ml10"
                    v-if="addParams.type == 2"
                    v-model="addParams.durationType"
                    @change="addParams.durationType == 2 && addParams.duration > 24 ? addParams.duration = 24 : ''"
                >
                    <el-radio-button :label="2">小时</el-radio-button>
                    <el-radio-button :label="1">分钟</el-radio-button>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showCreateRule = false">取 消</el-button>
            <el-button
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
            isFocus:false
        }
    },
    methods: {
        // 显示新建屏幕时长窗口
        showCreateRuleDialog(){
            this.showCreateRule = true
            this.addParams = {
                type: 2, 
                durationType: 2
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

<style lang="scss">
    .operation-created-lock-rule{
        .el-radio-button svg{
            vertical-align: top;
            margin-right: 5px;
        }

        .el-input__prefix{
            display: flex;
            align-items: center;
            color: #333;
            padding-left: 3px;
        }

        .duration-value{
            display: inline-block;
            border: 1px solid #dcdfe6;
            border-radius: 4px;

            &.active{
                border-color: var(--color-primary);
            }

            svg{
                margin-left: 10px;
                vertical-align: middle;
            }
            
            .el-input input{
                border: none;
                text-align: left;
            }
        }
    }
</style>