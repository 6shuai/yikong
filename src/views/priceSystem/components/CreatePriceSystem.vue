<template>
    <!-- 新建价格体系 -->
    <el-dialog
        class="screen-attributes-dialog"
        width="620px"
        :title="addParams.id ? '编辑价格体系' : '新建价格体系'"
        :visible.sync="showCreatePriceSystem"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
    >
        <div class="cattributes-content">
            <el-form label-width="120px">
                <el-form-item label="价格体系名称">
                    <el-input v-model="addParams.displayName"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input 
                        v-model="addParams.description" 
                        type="textarea" 
                        :rows="3"
                    ></el-input>
                </el-form-item>
            </el-form>

            <div class="play-method">
                <div class="play-type-wrap">
                    <span 
                        v-for="item in playTypeData"
                        :key="item.id"
                        @click="handleChangePlayType(item.id)" 
                        :class="{ active: addParams.lockType==item.id }"
                    >{{ item.name }}</span>
                </div>

                <div class="content">
                    <!-- 轮播 -->
                    <div v-if="addParams.lockType == 1">
                        <p class="flex-center">
                            <label>素材时长</label>
                            <span class="flex">
                                <el-input-number 
                                    class="w200" 
                                    :controls="false"
                                    :min="1"
                                    v-model="addParams.priceSystemConfigCarouselTimes.duration"
                                ></el-input-number>
                                <div class="time-tab flex ml10">
                                    <div 
                                        class="tab-item" 
                                        v-for="item in [{ name: '秒', id: 1 }, { name: '分钟', id: 2 }]" 
                                        :key="item.id"
                                        :class="{ 'active': durationType==item.id}"
                                        @click="durationType=item.id"
                                    >{{ item.name }}</div>
                                </div>
                            </span>
                        </p>
                        <p class="flex-center">
                            <label>播放次数</label>
                            <span class="flex">
                                <el-input-number 
                                    class="w200" 
                                    :controls="false"
                                    :min="1"
                                    v-model="addParams.priceSystemConfigCarouselTimes.times"
                                ></el-input-number>
                                <label class="ml10">次/天</label>
                            </span>
                        </p>
                        <p class="flex-center">
                            <label>基础天数</label>
                            <span class="flex">
                                <el-input-number 
                                    class="w200" 
                                    :controls="false"
                                    :min="1"
                                    v-model="addParams.priceSystemConfigCarouselTimes.days"
                                ></el-input-number>
                                <label class="ml10">天</label>
                            </span>
                        </p>
                    </div>

                    <!-- 插播 -->
                    <div v-if="addParams.lockType == 3">
                        <p class="flex-center">
                            <label>播放时长</label>
                            <span class="flex">
                                <el-input-number 
                                    class="w200"
                                    :controls="false"
                                    :min="1"
                                    v-model="addParams.priceSystemConfigSpot.duration"
                                ></el-input-number>
                                <div class="time-tab flex ml10">
                                    <div 
                                        class="tab-item" 
                                        v-for="item in [{ name: '秒', id: 1 }, { name: '分钟', id: 2 }]" 
                                        :key="item.id"
                                        :class="{ 'active': durationType==item.id}"
                                        @click="durationType=item.id"
                                    >{{ item.name }}</div>
                                </div>
                            </span>
                        </p>
                        <p class="flex-center">
                            <label>基础天数</label>
                            <span class="flex">
                                <el-input-number 
                                    class="w200" 
                                    :controls="false"
                                    :min="1"
                                    v-model="addParams.priceSystemConfigSpot.days"
                                ></el-input-number>
                                <label class="ml10">天</label>
                            </span>
                        </p>
                    </div>

                    <p class="flex-center">
                        <label>失效日期</label>
                        <span class="flex">
                            <el-date-picker
                                class="w200"
                                v-model="addParams.dueDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期"
                            >
                            </el-date-picker>
                        </span>
                    </p>
                </div>    
            </div>

            <div class="capturing-bottom">
                <el-button @click="handleCancel">取 消</el-button>
                <el-button 
                    type="primary"
                    :loading="btnLoading"
                    @click="handleSavePlayRule"
                >
                    确 定
                </el-button>
            </div>

        </div>
    </el-dialog>
</template>

<script>
import { priceSystemCreate } from '@/api/priceSystem'

export default {
    data() {
        return {
            // 显示选择播放规则
            showCreatePriceSystem: false,
            
            // 播放类型
            playTypeData: [
                { id: 1, name: '轮播' },
                { id: 3, name: '插播' }
            ],

            // 时长单位  秒 分钟
            durationType: 1,

            // 播放规则
            addParams: {},
            
            // 是否显示播放限制
            showPlayLimit: false,

            // 创建按钮loading
            btnLoading: false
        }
    },
    methods: {
        init(data){
            if(data){
                this.addParams = JSON.parse(JSON.stringify(data))
                if(!data.priceSystemConfigCarouselTimes) this.addParams.priceSystemConfigCarouselTimes = {}
                if(!data.priceSystemConfigSpot) this.addParams.priceSystemConfigSpot = {}
                this.addParams.dueDate = data.dueDateFormat
            }else{
                this.addParams = {
                    lockType: 1,
                
                    priceSystemConfigCarouselTimes: {},
                    priceSystemConfigSpot: {}
                }
            }
            
            this.showCreatePriceSystem = true
        },

        // 选择播放方式
        handleChangePlayType(id){
            this.addParams.lockType = id
        },

        // 取消锁位
        handleCancel(){
            this.showCreatePriceSystem = false
        },

        // 确定播放规则
        async handleSavePlayRule(){
            let { displayName, lockType, dueDate, priceSystemConfigCarouselTimes, priceSystemConfigSpot } = this.addParams

            if(!displayName){
                this.$message.warning('请输入体系名称~')
                return
            }else if(lockType == 1 && !priceSystemConfigCarouselTimes.duration){
                this.$message.warning('请输入素材时长~')
                return
            }else if(lockType == 1 && !priceSystemConfigCarouselTimes.times){
                this.$message.warning('请输入播放次数~')
                return
            }else if(lockType == 1 && !priceSystemConfigCarouselTimes.days){
                this.$message.warning('请输入基础天数~')
                return
            }else if(lockType == 3 && !priceSystemConfigSpot.duration){
                this.$message.warning('请输入播放时长~')
                return
            }else if(lockType == 3 && !priceSystemConfigSpot.days){
                this.$message.warning('请输入基础天数~')
                return
            }else if(!dueDate){
                this.$message.warning('请输入失效日期~')
                return
            }

            let data = JSON.parse(JSON.stringify(this.addParams))
            if(data.lockType == 1) delete data.priceSystemConfigSpot
            if(data.lockType == 3) delete data.priceSystemConfigCarouselTimes

            if(this.durationType == 2 && lockType == 1) data.priceSystemConfigCarouselTimes.duration = data.priceSystemConfigCarouselTimes.duration * 60
            if(this.durationType == 2 && lockType == 3) data.priceSystemConfigSpot.duration = data.priceSystemConfigSpot.duration * 60

            this.btnLoading = true
            priceSystemCreate(data).then(res => {
                this.btnLoading = false
                if(res.code === this.$successCode){
                    this.$message.success('创建成功~')
                    this.showCreatePriceSystem = false
                    this.$emit('createSuccess')
                }
            })

        }
    }
}
</script>

<style lang="scss">
$borderColor: #e5e5e5;

.screen-attributes-dialog{
    .cattributes-content{
        padding: 0 20px;

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
                    line-height: 40px;
                    padding-top: 10px;
                    text-align: center;

                    label{
                        display: inline-block;
                        width: 100px;
                        padding-right: 20px;
                    }

                    &>span{
                        width: 330px;
                        text-align: left;
                    }

                    .el-date-editor .el-input__inner{
                        text-align: center;
                    }

                    .time-tab{
                        height: 40px;
                        line-height: 40px;
                        border: 1px solid var(--color-primary);
                        color: var(--color-primary);
                        border-radius: 6px;
                        overflow: hidden;

                        .tab-item{
                            width: 60px;
                            text-align: center;
                            cursor: pointer;
                        }

                        .active{
                            background: var(--color-primary);
                            color: #fff;
                        }
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
                    text-align: left;


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