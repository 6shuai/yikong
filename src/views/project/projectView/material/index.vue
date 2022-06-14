<template>
    <div class="material-manage-wrap">
        <div class="material-list-wrap" v-if="!showCreateMaterial" v-loading="tLoading">
    
            <div class="material-content-wrap">
                <div class="material-list">
                    <div class="title flex-between-center">
                        <span>素材</span>
                        <el-button
                            icon="el-icon-plus"
                            size="small"
                            type="primary"
                            @click="handleShowCreate"
                        >
                            添加素材
                        </el-button>
                    </div>
                    <el-scrollbar class="hidden-scroll-x">
                        <div class="not-data" v-if="!resData || !resData.length">该项目下暂无素材,请尽快添加素材</div>
                        <ul>
                            <li 
                                v-for="(item, index) in resData" 
                                :key="item.id"
                                :class="{ 'active': currentMaterialIndex==index }"
                                @click="currentMaterialIndex = index;currentPlaceholder = null;getScreenList(item.id)"
                            >   
                                <div class="delete-wrap flex-center" v-if="currentMaterialIndex==index">
                                    <div class="mask"></div>
                                    <div class="del-btn" @click.stop="handleDelete()">删除素材</div>
                                </div>
                                <p class="overflow">{{ item.name }}</p>
                                <div class="material-cover">
                                    <el-image 
                                        fit="cover" 
                                        :src="item.thumbnail" 
                                        @click.stop.native="$refs.materialPreview.showPreview(item)"
                                    ></el-image>
                                </div>
                                <p>{{ item.width }} * {{ item.height }}</p>
                            </li>
                        </ul>
                    </el-scrollbar>
                </div>
    
                <div class="material-screen-list" id="app-main-wrap" v-loading="screenLoading">
                    
                    <div class="head flex-between-center"> 
                        <div class="title">大屏内容</div>
                        <div class="right-tabs flex">
                            <span 
                                v-for="(item, index) in ['进行中', '全部']" 
                                :key="index" 
                                :class="{ 'active': showType==index }"
                                @click="showType = index"
                            >
                                {{ item }}
                            </span>
                        </div>
                    </div>

                    <el-scrollbar class="hidden-scroll-x">
                        <div class="not-data" v-if="!screenData.length">暂无物料，暂不可添加大屏</div>

                        <div 
                            class="order-list" 
                            v-for="(item, index) in screenData" :key="item.id"
                            v-show="showType==1 || isDuringDate(item.publishDate, item.dueDate)"
                        >
                            <div class="top-content">
                                <div class="left-time-info">
                                    <div class="limt">
                                        <p class="time-period">上刊时间段： {{ item.publishDate }} -- {{ item.dueDate }}</p>
                                        <p v-if="item.type == 1">
                                            <span class="play-type">轮播</span>
                                            <span class="play-duration ml20">播放时长： {{ item.duration }}s</span>
                                            <span class="play-count ml20">每日播放次数：{{ item.times }}次</span>
                                        </p>
                                        <p v-if="item.type == 3">
                                            <span class="play-type limit-2">插播</span>
                                            <span class="play-duration ml20">开始时间： {{ item.time }}</span>
                                            <span class="play-count ml20">每日时间：{{ item.duration }}秒</span>
                                        </p>
                                        <div class="limit-time-wrap">
                                            <p v-if="formatLimitTime(item.limits).limitTimeData.length">限制播放时间 ：
                                                <span v-for="(limitTime, index) in formatLimitTime(item.limits).limitTimeData" :key="index">
                                                    {{ limitTime.begin }} - {{ limitTime.end }}
                                                    <span v-if="index < formatLimitTime(item.limits).limitTimeData.length-1">, </span>
                                                </span>
                                            </p>
                                            <p v-if="formatLimitTime(item.limits).disableTimeData.length">禁止播放时间 ：
                                                <span v-for="(limitTime, index) in formatLimitTime(item.limits).disableTimeData" :key="index">
                                                    {{ limitTime.begin }} - {{ limitTime.end }}
                                                    <span v-if="index < formatLimitTime(item.limits).disableTimeData.length-1">, </span>
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="right-limit">
                                    <div class="order-number">订单编号: {{ item.orderNumber }}</div>
                                </div>
                            </div>

                            <div class="fold flex-center" @click="$set(screenData[index], 'fold', !item.fold)">
                                <div class="line"></div>
                                <div class="right">
                                    <i :class="item.fold ? 'el-icon-caret-bottom' : 'el-icon-caret-top'"></i>
                                    <span>{{ item.fold ? '展开' : '收起' }}</span>
                                </div>
                            </div>

                            <!-- 大屏列表 -->
                            <div class="screen-list-wrap" :class="{ 'to-fold': item.fold }">
                                <div 
                                    class="screen-item" 
                                    v-for="(child, cindex) in item.orderedScreens" 
                                    :key="child.id"
                                    @click.prevent="currentPlaceholder = child.id"
                                >

                                    <div class="delete-wrap flex-center" v-if="currentPlaceholder==child.id">
                                        <div class="mask"></div>
                                        <div class="del-btn" @click="handleDelete(child.placeholder)">删除素材</div>
                                    </div>
            
                                    <div class="content flex-between-center">
                                        
                                        <div class="screen-name overflow" :title="child.name + (child.location ? `(${child.location})` : '')">
                                            {{ child.name }} {{ child.location ? `(${child.location})` : '' }}
                                        </div>
            
                                        <div class="specification">{{ child.width }} * {{ child.height }}</div>
                                    </div>
            
                                    <div class="screen-img flex">
                                        <el-image fit="cover" :src="child.photo"></el-image> 
                                    </div>
  
                                </div>


                            </div>
                        </div>
                    </el-scrollbar>
    
                </div>
            </div>
        </div>


        <!-- 添加素材 -->
        <create-material-new 
            v-if="showCreateMaterial"
            @createMaterialSuccess="showCreateMaterial=false; getMaterial()"
        ></create-material-new>

        <!-- 素材预览 -->
        <material-preview ref="materialPreview"></material-preview>
    
    </div>
</template>

<script>
import { projectMaterialLists, projectMaterialScreenList, projectMaterialDelete } from '@/api/project'
import { screenSizeWatch } from '@/mixins'
import CreateMaterialNew from './components/CreateMaterialNew'
import MaterialPreview from './components/MaterialPreview'

export default {
    components: { 
        CreateMaterialNew,
        MaterialPreview
    },
    mixins: [screenSizeWatch],
    data() {
        return {
            // 列表加载loading
            tLoading: false,
            
            // 列表数据
            resData: [],

            // 素材投放的屏幕列表
            screenData: [],

            // 屏幕列表加载中
            screenLoading: false,

            // 当前查看的素材下标
            currentMaterialIndex: null,

            // 当前查看的素材id
            currentMaterialId: 0,

            // 大屏内容筛选  0 进行中  1全部
            showType: 0,

            // 显示投放素材
            showCreateMaterial: false,

            // 当前选中的屏幕
            currentPlaceholder: null,

            btnLoading: false

        }
    },
    mounted() {
        this.getMaterial()
    },
    methods: {
        // 获取素材列表
        getMaterial(){
            this.tLoading = true
            projectMaterialLists({ project: this.$route.params.id }).then(res => {
                this.tLoading = false
                if(res.code === this.$successCode){
                    this.resData = res.obj
                }
            })
        },

        // 获取素材投放的屏幕列表
        getScreenList(id){
            this.currentMaterialId = id
            this.screenLoading = true
            let data = {
                project: this.$route.params.id,
                content: id
            }
            projectMaterialScreenList(data).then(res => {
                this.screenLoading = false
                if(res.code === this.$successCode){
                    this.screenData = res.obj
                }
            })
        },

        // 格式化限制播放时间格式
        formatLimitTime(data){
            let obj = {
                limitTimeData: [],
                disableTimeData: []
            }

            for(let i = 0; i < data.length; i++){
                let { begin, end, type } = data[i]
                if(type == 1){
                    obj.limitTimeData.push(data[i])
                }else{
                    obj.disableTimeData.push(data[i])
                }
            }
            return obj
        },
    
        // 显示添加素材页
        handleShowCreate(){
            this.$router.push({
                path: this.$route.path,
                query: {
                    target: 'create'
                }
            })
            this.showCreateMaterial = true
        },


        // 当前时间是否在这个范围内
        isDuringDate (beginDateStr, endDateStr) {
            let curDate = new Date(),
                beginDate = new Date(beginDateStr + ' 00:00:00'),
                endDate = new Date(endDateStr + ' 23:59:59')
            
            if (curDate >= beginDate && curDate <= endDate) {
                return true
            }
            return false
        },

        // 下架素材  或 释放屏幕
        handleDelete(placeholder = null){
            let msg = '您是否要对所选物料进行下刊？'
            if(placeholder){
                msg = '您是否要对所选大屏进行物料释放？'
            }

            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                let data = {
                    project: this.$route.params.id,
                    content: this.currentMaterialId,
                    placeholders: placeholder ? [placeholder] : null
                }

                this.btnLoading = true
                projectMaterialDelete(data).then(res => {
                    this.btnLoading = false
                    if(res.code === this.$successCode){
                        this.$message.success('操作成功~')
                        this.getScreenList(this.currentMaterialId)
                    }
                })
            })

        }
    },
    watch: {
        '$route.query'(n, o){
            if(this.$route.query.target && this.$route.query.target === 'create'){
                this.showCreateMaterial = true
            }else {
                this.showCreateMaterial = false
            }
        }
    },
}
</script>
<style lang="scss">
    .material-manage-wrap{

        .not-data{
            line-height: calc(100vh - 320px);
            color: #A1A1AA;
            text-align: center;
        }

        .material-content-wrap{
            margin-top: 20px;
            width: 100%;
            height: calc(100vh - 198px);
            display: flex;

            .material-list{
                width: 322px;
                padding: 20px;
                background: #E0EAFF;
                border-radius: 12px;

                .title{
                    color: 16px;
                    font-weight: 500;
                    height: 40px;
                    line-height: 40px;
                }

                .el-scrollbar{
                    height: calc(100vh - 310px);
                    margin-top: 20px;
                }

                ul{
                    li{
                        padding: 8px;
                        margin-top: 30px;
                        cursor: pointer;
                        position: relative; 
                        background: #fff;
                        border-left: 25px solid #5996FF; 
                        border-radius: 16px 0px 0px 16px;
                        position: relative;
                        
                        .material-cover{
                            display: inline-block;
                            width: 238px;
                            height: 106px;

                            .el-image{
                                width: 100%;
                                height: 100%;
                            }
                        }

                        p{
                            color: #52525B;
                            line-height: 20px;
                            padding: 5px;
                        }
                    }
                }
            }

            .material-screen-list{
                background: #F3F4F6;
                border-radius: 12px;
                margin-left: 40px;
                padding: 16px;
                flex: 1;

                .head{
                    line-height: 42px;
                    font-size: 16px;

                    .right-tabs{
                        border: 1px solid #71717A;
                        border-radius: 3px;
                        span{
                            font-size: 12px;
                            line-height: 29px;
                            padding: 0 10px;
                            color: #71717A;
                            cursor: pointer;

                            &.active{
                                background: #71717A;
                                color: #fff;
                            }
                        }
                    }
                }

                &>.el-scrollbar{
                    height: calc(100vh - 310px);
                    margin-top: 20px;
                    margin-right: 20px;
                    background: #fff;

                    .order-list{
                        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                        background: #fff;
                        padding: 20px;
                        margin-bottom: 20px;

                        .top-content{
                            display: flex;
                            justify-content: space-between;
                            padding-bottom: 10px;

                            p{
                                line-height: 26px;
                                font-size: 14px;
                            }

                            .left-time-info{
                                display: flex;

                                .limt{
                                    font-weight: bold;
                                    display: inline-block;

                                    .play-type{
                                        display: inline-block;
                                        background: #0091C2;
                                        border-radius: 4px;
                                        color: #fff;
                                        padding: 2px 10px;
                                        font-size: 14px;
                                        line-height: 20px;

                                        &.limit-2{
                                            background: #C27B00;
                                        }
                                    }
                                }

                                .limit-time-wrap{
                                    padding-left: 70px;
                                }
                                


                                .tip{
                                    display: inline-block;
                                    background: #FF81B0;
                                    padding: 5px 10px;
                                    height: 36px;
                                    color: #fff;
                                    margin-left: 30px;
                                }
                            }


                            .right-limit{
                                font-size: 14px;
                                color: #787878;
                                line-height: 40px;
                            }
                        }   

                        .fold{
                            cursor: pointer;
                            
                            .line{
                                flex: 1;
                                height: 1px;
                                background: #6F6F6F;
                            }

                            .right{
                                width: 76px;
                                padding-left: 10px;

                                i{
                                    font-size: 20px;
                                    color: var(--color-primary);
                                    margin-right: 5px;
                                }

                                span{
                                    font-size: 14px;
                                    vertical-align: text-bottom;
                                }
                            }
                        }

                        .screen-list-wrap{
                            display: flex;
                            flex-wrap: wrap;
                            padding-top: 20px;

                            &.to-fold{
                                height: 0;
                                overflow: hidden;
                            }
                            
                            .screen-item{
                                width: 240px;
                                margin: 0 12px 20px 8px;
                                padding: 8px 12px;
                                position: relative;
                                cursor: pointer;
                                box-shadow: 0 2px 12px 0 rgba(0,0,0, .1);

                                &.active{
                                    background: #CBE2FF;
                                }

                                .content{
                                    line-height: 20px;
                                    padding: 2px 0 8px 0;

                                    .screen-name{
                                        width: 130px;
                                        color: #71717A;
                                        font-weight: 700;
                                    }

                                    .specification{
                                        font-size: 12px;
                                        color: #D4D4D8;
                                    }
                                }

                                .screen-img{
                                    width: 215px;
                                    height: 95px;
                                    background: #999;

                                    .el-image{
                                        width: 100%;
                                        height: 100%;
                                    }
                                }
                            }
                        }

                    }
                }
                
            }
        }

        .delete-wrap, .delete-wrap .mask{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 99;
            
        }

        .delete-wrap{
            .mask{
                background:rgba(124, 124, 124, 0.4);
            }

            .del-btn{
                width: 94px;
                height: 30px;
                line-height: 30px;
                font-size: 14px;
                background: rgba(255, 255, 255, 0.73);
                color: #111827;
                border-radius: 8px;
                text-align: center;
                z-index: 1000;
            }
        }
    }

    .delete-material-tip-dialog{
        .el-dialog__body{
            padding: 20px;
        }

        .msg{
            padding-bottom: 20px;
        }
    }

</style>