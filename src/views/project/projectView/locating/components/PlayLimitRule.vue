<template>
    <!-- 选择播放规则 -->
    <el-dialog
        class="screen-attributes-dialog"
        width="620px"
        title="选择播放规则"
        :visible.sync="showPlayRule"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
    >
        <div class="cattributes-content">
            <div class="period">
                <label>上刊时间段</label>
                <el-date-picker
                    v-model="period"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </div>
            <div class="play-method">
                <div class="play-type-wrap">
                    <span 
                        v-for="item in playTypeData"
                        :key="item.id"
                        @click="handleChangePlayType(item.id)" 
                        :class="{ active: limitParams.type==item.id }"
                    >{{ item.name }}</span>
                </div>

                <div class="content">
                    <!-- 轮播 -->
                    <div v-if="limitParams.type == 1">
                        <p>
                            <label>物料时长</label>
                            <span>
                                <el-input-number 
                                    class="w200" 
                                    :controls="false"
                                    :min="1"
                                    v-model="limitParams.duration"
                                ></el-input-number>
                                秒
                            </span>
                        </p>
                        <p>
                            <label>播放次数</label>
                            <span>
                                <el-input-number 
                                    class="w200" 
                                    :controls="false"
                                    :min="1"
                                    v-model="limitParams.times"
                                ></el-input-number>
                                次/天
                            </span>
                        </p>
                    </div>

                    <!-- 插播 -->
                    <div v-if="limitParams.type == 3">
                        <p>
                            <label>开始时间</label>
                            <span>
                                <el-time-picker
                                    class="w200"
                                    v-model="limitParams.time"
                                    type="datetime"
                                    placeholder="选择开始时间"
                                    value-format="HH:mm:ss">
                                </el-time-picker>
                            </span>
                        </p>
                        <p>
                            <label>播放时长</label>
                            <span>
                                <el-input-number 
                                    class="w200"
                                    :controls="false"
                                    :min="1"
                                    v-model="limitParams.duration"
                                ></el-input-number>
                                秒
                            </span>
                        </p>
                    </div>

                    <!-- 价格体系 -->
                    <p>
                        <label>价格体系</label>
                        <span>
                            <el-select class="w200" v-model="limitParams.priceSystem" placeholder="请选择价格体系">
                                <el-option
                                    v-for="(item, index) in priceSystem"
                                    :key="index"
                                    :label="item.display_name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </span>
                    </p>

                    <div class="play-limit-wrap mt20" v-if="limitParams.type == 1">
                        <span class="value">
                            <el-button 
                                v-if="!showPlayLimit"
                                type="primary"
                                size="mini"
                                plain
                                @click="showPlayLimit=true"
                            >添加播放限制</el-button>
                        </span>

                        <div class="limit-time" v-if="showPlayLimit">
                            <label class="limit-label">限制类型</label>
                            <el-radio-group v-model="limitType" @change="limitTime=[{type: limitType}]">
                                <el-radio :label="1">限制时间</el-radio>
                                <el-radio :label="2">禁止时间</el-radio>
                            </el-radio-group>
                        </div>
                        
                        <div class="limit-time" v-if="showPlayLimit">
                            <label class="limit-label">{{ limitType==1 ? '限制时间' : '禁止时间' }}</label>
                            <div class="limit-time-list">
                                <div 
                                    class="time-item" 
                                    v-for="(item, index) in limitTime"
                                    :key="index"
                                >
                                    <el-time-picker
                                        is-range
                                        v-model="item.time"
                                        value-format="HH:mm:ss"
                                        range-separator="至"
                                        start-placeholder="开始时间"
                                        end-placeholder="结束时间"
                                        placeholder="选择时间范围">
                                    </el-time-picker>
                                    <i 
                                        class="el-icon-circle-plus" 
                                        v-if="limitTime.length <=1 || limitTime.length-1 == index" 
                                        @click="limitTime.push({type: limitType})"
                                    ></i>
                                    <i 
                                        class="el-icon-remove" 
                                        v-if="limitTime.length > 1" 
                                        @click="$delete(limitTime, index)"
                                    ></i>
                                </div>
                            </div>
                        </div>
                    
                    </div>
                </div>
                
            </div>

            <div class="capturing-bottom">
                <el-button @click="handleCancel">取 消</el-button>
                <el-button type="primary" @click="handleSavePlayRule">确 定</el-button>
            </div>

        </div>
    </el-dialog>
</template>

<script>
import { projectLockPriceSystemList } from '@/api/project'

export default {
    data() {
        return {
            // 显示选择播放规则
            showPlayRule: false,

            // 上刊时间段
            period: [],
            
            // 播放类型
            playTypeData: [
                { id: 1, name: '轮播' },
                { id: 3, name: '插播' }
            ],

            // 价格体系
            priceSystem: [],

            // 播放规则
            limitParams: {},

            // 限制类型
            limitType: 1,

            // 限制时间
            limitTime: [{ type: 1 }],
            
            // 是否显示播放限制
            showPlayLimit: false
        }
    },
    methods: {
        init(){
            this.limitParams = {
                type: 1,

                // 物料时长 默认15秒
                duration: 15,

                // 播放次数 默认120
                times: 120,

                limits: [{ type: 1 }]
            }
            this.period = []
            
            this.showPlayRule = true

            if(this.$route.query.type == 'again' && this.$store.state.project.againReserveData){
                let { publishDate, dueDate, duration, type, time, times, limits, priceSystem } = this.$store.state.project.againReserveData
                this.period = [publishDate, dueDate]
                this.limitParams = {
                    duration,
                    type,
                    time,
                    times,
                    priceSystem
                }
                this.limitTime = this.formatLimitTime(limits)
                this.showPlayLimit = limits.length ? true : false
            }

            // 获取价格体系列表
            this.getPriceSystemList()
        },

        getPriceSystemList(){
            let user = JSON.parse(localStorage.loginData)
            let data = {
                user: user.id,
                type: this.limitParams.type
            }
            projectLockPriceSystemList(data).then(res => {
                if(res.code === this.$successCode){
                    this.priceSystem = res.obj
                }
            })
        },

        // 选择播放方式
        handleChangePlayType(id){
            this.limitParams.type = id
            this.getPriceSystemList()
        },

        // 取消锁位
        handleCancel(){
            this.showPlayRule = false
        },

        // 确定播放规则
        async handleSavePlayRule(){
            let { type, duration, times, time, priceSystem } = this.limitParams

            if(!this.period.length){
                this.$message.warning('请选择上刊时间段~')
                return
            }else if(type == 1 && !duration){
                this.$message.warning('请输入物料时长~')
                return
            }else if(type == 1 && !times){
                this.$message.warning('请输入播放次数~')
                return
            }else if(type == 3 && !time){
                this.$message.warning('请输入开始时间~')
                return
            }else if(type == 3 && !duration){
                this.$message.warning('请输入播放时长~')
                return
            }else if(!priceSystem) {
                this.$message.warning('请选择价格体系~')
                return
            }

            this.limitParams = {
                ...this.limitParams,

                // 上刊日期
                publishDate: this.period[0],
    
                // 下刊日期
                dueDate: this.period[1]
            }

            if(type == 1){
                this.$delete(this.limitParams, 'time')
                this.limitParams.limits = await this.getLimitTimeList(this.limitTime)
                if(!this.limitParams.limits.length) this.$delete(this.limitParams, 'limits')

            }else if(type == 3){
                this.$delete(this.limitParams, 'limits')
                this.$delete(this.limitParams, 'times')
            }

            this.showPlayRule = false
            this.$store.state.project.playRuleData = this.limitParams
            this.$router.push(`/project/${this.$route.params.id}/locating/selectScreen`)
        },

        // 获取限制时间列表
        getLimitTimeList(data){
            let list = []
            for(let i = 0; i < data.length; i++){
                if(data[i].time && data[i].time.length){
                    list.push({
                        begin: data[i].time[0],
                        end: data[i].time[1],
                        type: data[i].type
                    })
                    
                }
            }
            return list
        },

        // 格式化限制播放时间格式
        formatLimitTime(data){
            for(let i = 0; i < data.length; i++){
                let { begin, end } = data[i]
                data[i].time = [begin, end]
            }
            return data
        }
    }
}
</script>

<style lang="scss">
$borderColor: #e5e5e5;

.screen-attributes-dialog{
    .cattributes-content{
        padding: 0 20px;

        .period{
            text-align: center;
            label{
                padding-right: 20px;
            }
        }

        .play-method{
            border: 1px solid $borderColor;
            border-radius: 4px;
            padding: 10px;
            margin: 20px 0;

            .play-type-wrap{
                line-height: 24px;
                display: flex;
                justify-content: space-around;
                border-bottom:  1px solid $borderColor;

                span{
                    border-bottom: 2px solid transparent;
                    cursor: pointer;

                    &.active{
                        border-color: var(--color-primary);
                        color: var(--color-primary);
                    }
                }
            }

            .content{
                p{
                    padding-top: 10px;
                    text-align: center;

                    label{
                        display: inline-block;
                        width: 100px;
                        padding-right: 20px;
                    }

                    &>span{
                        display: inline-block;
                        width: 240px;
                        text-align: left;
                    }

                    .el-date-editor .el-input__inner{
                        text-align: center;
                    }
                }
            }
        }

        .play-limit-wrap{
            text-align: center;

            .limit-time{
                padding-bottom: 10px;
                display: flex;
                
                .limit-label{
                    width: 100px;
                    line-height: 40px;
                    padding-right: 20px;
                    text-align: center;
                }

                .el-radio-group{
                    padding-top: 12px;
                }

                .limit-time-list{
                    flex: 1;


                    .time-item{
                        margin-bottom: 10px;

                        .el-icon-circle-plus, .el-icon-remove{
                            margin-left: 10px;
                            font-size: 18px;
                            cursor: pointer;
                            
                            &:hover{
                                transform: scale(1.2);
                            }
                        }
                    }
                }
            }
        }

        .capturing-bottom{
            padding-top: 20px;
            text-align: center;

            .el-button{
                margin: 0 20px;
            }
        }
    }
}
</style>