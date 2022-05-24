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
                        <ul>
                            <li 
                                v-for="(item, index) in resData" 
                                :key="item.id"
                                :class="{ 'active': currentMaterialIndex==index }"
                                @click.stop="currentMaterialIndex = index;getScreenList(item.id)"
                            >   
                                <p class="overflow">{{ item.name }}</p>
                                <div class="material-cover">
                                    <el-image 
                                        fit="cover" 
                                        :src="item.content" 
                                        :preview-src-list="[item.content]"
                                        @click.stop.native="()=>{}"
                                    ></el-image>
                                </div>
                                <p>{{ item.width }} * {{ item.height }}</p>
                            </li>
                        </ul>
                    </el-scrollbar>
                </div>
    
                <div class="material-screen-list" id="app-main-wrap" v-loading="screenLoading">
                    
                    <div class="head">
                        <span class="title">大屏内容</span>
                    </div>

                    <el-scrollbar class="hidden-scroll-x">
                        <el-empty v-if="!screenLoading && !screenData.length"></el-empty>

                        <el-card class="item" v-for="item in screenData" :key="item.id">
                            <div class="top-content">
                                <div class="left-time-info">
                                    <p class="time-period">
                                        <span v-if="item.type == 1" class="play-type">轮播</span>
                                        <span v-if="item.type == 3" class="play-type limit-2">插播</span>
                                        上刊时间段： {{ item.publishDate }} -- {{ item.dueDate }}
                                    </p>
                                </div>
                                <div class="right-limit">
                                    <p v-if="item.limits && item.limits.length ">{{ item.limits[0].type == 2 ? '禁止播放时间' : '限制播放时间' }} ：
                                        <span v-for="(limitTime, index) in item.limits" :key="index">{{ limitTime.begin }} - {{ limitTime.end }}</span>
                                    </p>
                                </div>
                            </div>
            
                            <el-scrollbar class="hidden-scroll-y" style="width: 100%;">
                                <div class="screen-list mt20" :style="{ width: item.placeholders.length * 270 +'px' }">
                                    <div class="screen-item" 
                                        v-for="screen in item.placeholders" 
                                        :key="screen.id"
                                    >
                                        <div class="screen-img">
                                            <el-image fit="cover" :src="screen.photo"></el-image>
                                            <div class="screen-name overflow">{{ screen.name }} {{ screen.location ? `(${screen.location})` : '' }}</div>
                                        </div>
                                        <div class="screen-bottom">
                                            <el-tag size="small" v-if="screen.city">{{ screen.city }}</el-tag>
                                            <el-tag size="small" v-if="screen.level">{{ screen.level }}</el-tag>
                                        </div>
                                    </div>
                                </div>
                            </el-scrollbar>
                            <div class="bottom mt20 flex-between-center clearfix">
                                <p v-if="item.type == 1">
                                    <span class="play-duration ml20">播放时长： {{ item.duration }}s</span>
                                    <span class="play-count ml20">每日播放次数：{{ item.times }}次</span>
                                </p>
                                <p v-if="item.type == 3">
                                    <span class="play-duration ml20">开始时间： {{ item.time }}</span>
                                    <span class="play-count ml20">播放时长：{{ item.duration }}秒</span>
                                </p>
                                <span class="locating-time">订单号: {{ item.orderNumber }}</span>
                            </div>
            
                        </el-card>
                    </el-scrollbar>
    
                </div>
            </div>
        </div>

        <!-- 下架素材 -->
        <div class="delete-material-wrap" v-if="showDeleteCheckbox">
            <el-button @click="showDeleteCheckbox=false">取消</el-button>
            <el-button 
                :loading="btnLoading"
                type="primary"
                :disabled="!materialIds.length ? true : false"
                @click="handleDelete"
            >确定</el-button>
        </div>


        <!-- 添加素材 -->
        <create-material-new 
            v-if="showCreateMaterial"
            @createMaterialSuccess="showCreateMaterial=false; getMaterial()"
        ></create-material-new>
    
    </div>
</template>

<script>
import { projectMaterialLists, projectMaterialScreenList, projectMaterialDelete } from '@/api/project'
import { screenSizeWatch } from '@/mixins'
import CreateMaterialNew from './components/CreateMaterialNew'

export default {
    components: { 
        CreateMaterialNew
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
            currentMaterialIndex: 0,

            // 当前查看的素材id
            currentMaterialId: 0,

            // 显示投放素材
            showCreateMaterial: false,

            // 显示下架素材
            showDeleteCheckbox: false,

            // 已选择的素材id
            materialIds: {},

            // 已选择的屏幕id
            screenIds: [],

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
                    if(this.resData.length) this.getScreenList(this.currentMaterialId ? this.currentMaterialId : this.resData[0].id)
                    else this.showCreateMaterial = true
                }
            })
        },

        // 获取素材投放的屏幕列表
        getScreenList(id){
            this.currentMaterialId = id
            this.screenLoading = true
            this.screenIds = []
            let data = {
                project: this.$route.params.id,
                content: id
            }
            projectMaterialScreenList(data).then(res => {
                this.screenLoading = false
                if(res.code === this.$successCode){
                    this.screenData = res.obj
                    console.log(this.screenData)
                }
            })
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

        // 选择素材
        handelSelectMaterial(id, index){
            if(this.materialIds[id]){
                this.$set(this.materialIds, id, false)
                this.screenIds[index] = []
            }else{
                this.$set(this.materialIds, id, true)
            }
        },

        // 选择屏幕
        handleSelectScreen({ placeholder }){
            let index = this.currentMaterialIndex
            if(!this.screenIds[index]) this.screenIds[index] = []
            if(this.screenIds[index].includes(placeholder)){
                let i = this.screenIds[index].findIndex((item) => item == placeholder)
                this.screenIds[index].splice(i, 1)
            }else{
                this.screenIds[index].push(placeholder)
            }
            // this.materialIds[this.currentMaterialId] = (this.screenIds[index].length == this.screenData.length)
            this.$set(this.materialIds, this.currentMaterialId, this.screenIds[index].length == this.screenData.length)
        },

        // 下架素材
        handleDelete(){

            let data = {
                materials: []
            }

            for (const key in this.materialIds) {
                if(this.materialIds[key]){
                    data.materials.push({
                        packageId: key,
                        placeholders: null
                    })
                }
            }

            for(let i = 0; i < this.screenIds.length; i++){
                let id = this.resData[i].id
                if(this.screenIds[i] && this.screenIds[i].length && !this.materialIds[id]){
                    data.materials.push({
                        packageId: id,
                        placeholders: this.screenIds[i] 
                    })
                }
            }


            this.$confirm('您确定要对选择的素材进行下架吗?', '提示', {
                confirmButtonText: '提交',
                cancelButtonText: '我再想想',
                type: 'warning'
            }).then(() => {
                this.btnLoading = true
                projectMaterialDelete(data).then(res => {
                    this.btnLoading = false
                    if(res.code === this.$successCode){
                        this.$message.success('操作成功~')
                        this.screenIds = {}
                        this.materialIds = []
                        this.getMaterial()
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

        .material-content-wrap{
            margin-top: 20px;
            width: 100%;
            height: calc(100vh - 220px);
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
                    height: calc(100vh - 410px);
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
                        
                        // &:hover{
                        //     background: #e3fdfd;
                        // }

                        // &.active{
                        //     background: #e3fdfd;
                        // }

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
                }

                &>.el-scrollbar{
                    height: calc(100vh - 310px);
                    margin-top: 20px;
                    margin-right: 20px;

                    .item{
                        margin-bottom: 20px;
                        padding: 0 10px;

                        .top-content{
                            display: flex;
                            justify-content: space-between;
                            padding-bottom: 10px;
                            border-bottom: 1px solid #e5e5e5;

                            p{
                                line-height: 26px;
                                font-size: 14px;
                            }

                            .left-time-info{
                                width: 400px;
                                font-weight: bold;

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

                            .right-limit{
                                display: flex;
                                align-items: end;
                            }
                        }   

                        .el-scrollbar{
                            border-bottom: 1px solid #e5e5e5;
                        }

                        .screen-list{
                            display: flex;
                            flex-wrap: wrap;
                            margin-left: -20px;

                            .screen-item{
                                width: 250px;
                                margin: 0 0 20px 20px;
                                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

                                .screen-img{
                                    width: 100%;
                                    height: 180px;
                                    position: relative;
                                    background: #999;

                                    .el-image{
                                        width: 100%;
                                        height: 100%;
                                    }

                                    .screen-name{
                                        position: absolute;
                                        left: 0;
                                        bottom: 0;
                                        width: 100%;
                                        text-align: center;
                                        color: #fff;
                                        background: rgba($color: #000000, $alpha: 0.6);
                                        padding: 5px;
                                    }
                                }

                                .screen-bottom{
                                    text-align: center;
                                    padding: 10px 0;
                                }
                            }
                        }

                        .bottom{
                            .locating-time{
                                float: right;
                                font-size: 14px;
                                color: #999;
                                line-height: 40px;
                            }
                        }
                    }
                }
                
            }
        }

        .delete-material-wrap{
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 20px;
            text-align: right;
            z-index: 99;
            background: #eeeeee;
        }
    }

</style>