<template>
    <el-dialog
        width="760px"
        title="播放限制"
        class="play-limit-edit"
        :visible.sync="showPlayLimit"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="showPlayLimit=false"
        append-to-body>
        <el-form 
            label-width="80px"
            ref="limitForm"
            :model="limitParams"
            :rules="limitRules"
        >
            <el-form-item label="周期" prop="validDate">
                <el-checkbox-group v-model="checkboxGroup">
                    <el-checkbox-button v-for="item in weekData" :label="item.id" :key="item.id">{{item.label}}</el-checkbox-button>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="时段" class="is-required">
                <el-form-item class="limit-time limit-star-time" prop="beginTime">
                    <el-time-select
                        placeholder="起始时间"
                        v-model="limitParams.beginTime"
                        :picker-options="{
                            start: '05:00',
                            step: '00:15',
                            end: '23:30'
                        }">
                    </el-time-select>
                </el-form-item>
                <el-form-item class="limit-time" prop="endTime">
                    <el-time-select
                        placeholder="结束时间"
                        v-model="limitParams.endTime"
                        :picker-options="{
                            start: '05:00',
                            step: '00:15',
                            end: '23:30',
                            minTime: limitParams.beginTime
                        }">
                    </el-time-select>
                </el-form-item>
            </el-form-item>
            <el-form-item label="规则" prop="rule">
                <el-radio-group v-model="limitParams.rule">
                    <el-radio-button :label="1">限制播放</el-radio-button>
                    <el-radio-button :label="2">禁止播放</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-button 
                class="created-btn" 
                type="primary" 
                @click="createdLimit"
                :loading="addLoading"
                size="small">
                添加规则
            </el-button>
            <el-form-item label="当前设置">
                <ul>
                    <li class="t-header clearfix">
                        <span class="week">周期</span>
                        <span class="date">时段</span>
                        <span class="type">限制</span>
                        <span class="del">操作</span>
                    </li>
                    <li class="clearfix" v-for="item in data" :key="item.id">
                        <span class="week">{{selectedDate(item.validDate)}}</span>
                        <span class="date">{{item.beginTimeFormat}} - {{item.endTimeFormat}}</span>
                        <span class="type">{{item.rule==1 ? '限制播放' : '禁止播放'}}</span>
                        <span class="del">
                            <el-popover
                                placement="top"
                                :ref="'del'+item.id"
                                width="200">
                                <p>此操作将删除此条限制, 是否继续?</p>
                                <div style="text-align: right; margin: 0">
                                    <el-button size="mini" type="text" @click="$refs['del'+item.id][0].doClose()">取消</el-button>
                                    <el-button type="primary" size="mini" :loading="delLoading" @click="limitDelete(item.id)">确定</el-button>
                                </div>
                                <font-awesome-icon slot="reference" :icon="['fas', 'trash-alt']" />
                            </el-popover>
                        </span>
                    </li>
                    <li v-if="data && !data.length" class="no-data">暂无播放限制~</li>
                </ul>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showPlayLimit = false">取 消</el-button>
            <el-button type="primary" @click="showPlayLimit = false">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { contentPlayLimitCreated, contentPlayLimitDelete } from '@/api/content';
export default {
    props: ['weekData', 'data'],
    data(){
        return {
            limitParams: {},                    //播放限制 编辑参数
            showPlayLimit: false,               //播放限制 编辑窗口
            checkboxGroup: [],                  //已选中的周期
            limitRules: {
                validDate: [{ required: true, trigger: "blur", message: '请选择周期~' }],
                beginTime: [{ required: true, trigger: "change", message: '请选择起始时间~' }],
                endTime: [{ required: true, trigger: "change", message: '请选择结束时间~' }],
                rule: [{ required: true, trigger: "change", message: '请选择规则~' }],
            },
            addLoading: false,                  //添加规则按钮loading
            delLoading: false,                  //删除按钮loading
        }
    },
    methods: {
        //显示播放限制 编辑模态框
        showDialog(){
            this.showPlayLimit = true;
        },

        //添加播放限制
        createdLimit(){
            let s = '';
            this.weekData.forEach(item => {
                s += this.checkboxGroup.includes(item.id) ? 2 : 1;
            })
            if(s.indexOf(2) > -1){
                this.limitParams.validDate = Number(s);
            }else{
                this.limitParams.validDate = undefined;
            }
            let params = JSON.parse(JSON.stringify(this.limitParams));
            params.content = Number(this.$route.params.id);
            //时间固定格式
            params.beginTime = '1970-01-01 ' + params.beginTime + ':00';
            params.endTime = '1970-01-01 ' + params.endTime + ':00';
            this.$refs.limitForm.validate((valid) => {
                if (valid) {
                    this.addLoading = true;
                    contentPlayLimitCreated(params).then(res => {
                        this.addLoading = false;
                        if(res.code === this.$successCode){
                            this.$message.success('添加成功~');
                            this.limitForm = {};
                            this.checkboxGroup = [];
                            this.$delete(this.limitParams, 'validDate');
                            this.$emit('updateDetail');
                        }
                    })
                }
            })
        },

        //删除播放限制
        limitDelete(id){
            this.delLoading = true;
            contentPlayLimitDelete(id).then(res => {
                this.delLoading = false;
                if(res.code === this.$successCode){
                    this.$message.success('删除成功~');
                    this.$refs['del'+id][0].doClose();
                    this.$emit('updateDetail');
                }
            })
        },

        //播放限制列表 已选中的日期 
        selectedDate(data){
            data = String(data);
            let arr = data.split("");
            let weekArr = [];
            for(let i = 0; i< arr.length; i++){
                if(arr[i] == 2){
                    weekArr.push(this.weekData[i].label);
                }
            }
            return weekArr.join('、');
        }
    },
}
</script>