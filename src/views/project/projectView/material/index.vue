<template>
    <div class="material-manage-wrap">
        <div class="material-list-wrap" v-if="!showCreateMaterial" v-loading="tLoading">
            <div class="material-top-head">
                <div class="head-left">
                    <span class="page-title">物料列表</span>
                    <!-- <div class="screen-count">
                        (<b>17/27</b>您还有<b>10</b>块大屏未投放物料<i class="el-icon-caret-bottom"></i>)
                        
                        <div class="unprotected-list">
                            <el-scrollbar 
                                class="hidden-scroll-x"
                                :style="{ height: 5 >= 10 ? '440px' : 5 * 44 + 'px' }"
                            >
                                <ul>
                                    <li 
                                        v-for="(item, index) in 5"
                                        :key="index"
                                    >
                                        大屏名称{{index}}
                                    </li>
                                </ul>
                            </el-scrollbar>
                        </div>
    
                    </div> -->
                </div>

                <div class="right-btn">
                    <el-button
                        type="danger"
                        @click="showDeleteCheckbox = true; materialIds=[]"
                    >
                        下架物料
                    </el-button>
                    <el-button
                        icon="el-icon-plus"
                        type="primary"
                        @click="handleShowCreate"
                    >
                        添加物料
                    </el-button>
                </div>
            </div>
    
            <div class="material-content-wrap">
                <div class="material-list">
                    <div class="title">物料</div>
                    <el-scrollbar class="hidden-scroll-x">
                        <ul>
                            <li 
                                v-for="(item, index) in resData" 
                                :key="item.id"
                                :class="{ 'active': currentMaterialIndex==index }"
                                @click.stop="currentMaterialIndex = index;getScreenList(item.id)"
                            >   
                                <el-checkbox 
                                    :val="materialIds.includes(item.id)"
                                    @change="handelSelectMaterial(item.id)"
                                    @click.stop.native="()=>{}"
                                    v-if="showDeleteCheckbox"
                                ></el-checkbox>
                                <div class="material-cover">
                                    <el-image fit="cover" :src="item.regions[0].content"></el-image>
                                </div>
                            </li>
                        </ul>
                    </el-scrollbar>
                </div>
    
                <div class="material-screen-list" id="app-main-wrap" v-loading="screenLoading">
                    <!-- <div class="material-detail">
                        <p>
                            <span>物料状态： 进行中</span>
                            <span>上刊时间： 2022-04-12 -- 2022-04-22</span>
                        </p>
                        <p>
                            <span>物料尺寸： 1080*1920</span>
                            <span>宽高比： 16:9</span>
                        </p>
                    </div> -->
    
                    <el-scrollbar class="hidden-scroll-x">
                        <el-empty v-if="!screenLoading && !screenData.length"></el-empty>

                        <ul class="screen-list">
                            <li 
                                :style="{ width: placeW }"
                                v-for="(item, index) in screenData"
                                :key="index"
                                @click="handleSelectScreen(item)"
                            >
                                <div class="screen-content">

                                    <div class="mask" v-show="screenIds.includes(item.placeholder)"></div>

                                    <div class="screen-image" :style="{ height: imageH + 'px' }">
                                        <el-image 
                                            fit="cover" 
                                            :src="item.photo"
                                            :style="{ height: imageH + 'px' }"
                                        ></el-image>
                                    </div>
                                    <div class="screen-play-detail">
                                        <div class="title overflow">{{ item.position_name }} {{ item.location ? `(${item.location})` : '' }}</div>
                                        <!-- <p>应播放次数: 120次</p>
                                        <p>已播放次数: 100次</p> -->
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </el-scrollbar>
    
                </div>
            </div>
        </div>

        <!-- 下架物料 -->
        <div class="delete-material-wrap" v-if="showDeleteCheckbox">
            <el-button @click="showDeleteCheckbox=false">取消</el-button>
            <el-button 
                type="primary"
                :disabled="!materialIds.length ? true : false"
                @click="handleDelete"
            >确定</el-button>
        </div>


        <!-- 添加物料 -->
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

            // 物料投放的屏幕列表
            screenData: [],

            // 屏幕列表加载中
            screenLoading: false,

            // 当前查看的物料下标
            currentMaterialIndex: 0,

            // 显示投放物料
            showCreateMaterial: false,

            // 显示下架物料
            showDeleteCheckbox: false,

            // 已选择的物料id
            materialIds: [],

            // 已选择的屏幕id
            screenIds: []

        }
    },
    mounted() {
        this.getMaterial()
    },
    methods: {
        // 获取物料列表
        getMaterial(){
            this.tLoading = true
            projectMaterialLists({ project: this.$route.params.id }).then(res => {
                this.tLoading = false
                if(res.code === this.$successCode){
                    this.resData = res.obj
                    if(this.resData.length) this.getScreenList(this.resData[0].id)
                    else this.showCreateMaterial = true
                }
            })
        },

        // 获取物料投放的屏幕列表
        getScreenList(id){
            this.screenLoading = true
            this.screenIds = []
            projectMaterialScreenList({ package: id }).then(res => {
                this.screenLoading = false
                if(res.code === this.$successCode){
                    this.screenData = res.obj
                }
            })
        },
    
        // 显示添加物料页
        handleShowCreate(){
            this.$router.push({
                path: this.$route.path,
                query: {
                    target: 'create'
                }
            })
            this.showCreateMaterial = true
        },

        // 选择物料
        handelSelectMaterial(id){
            if(this.materialIds.includes(id)){
                let index = this.materialIds.indexOf(id)
                this.materialIds.splice(index, 1)
            }else{
                this.materialIds.push(id)
            }
        },

        // 选择屏幕
        handleSelectScreen({ placeholder }){
            if(this.screenIds.includes(placeholder)){
                let index = this.screenIds.findIndex((item) => item == placeholder)
                this.screenIds.splice(index, 1)
            }else{
                this.screenIds.push(placeholder)
            }
        },

        // 下架
        handleDelete(id){
            projectMaterialDelete({ package: id }).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('下架成功~')
                    this.getMaterial()
                }
            })
        },

        // 下架物料
        handleDelete(){
            this.$confirm('您确定要对选择的物料进行下架吗?', '提示', {
                confirmButtonText: '提交',
                cancelButtonText: '我再想想',
                type: 'warning'
            }).then(() => {
                this.distributeLoading = true
                projectReturnMoneyDistribute(params).then(res => {
                    this.distributeLoading = false
                    if(res.code === this.$successCode){
                        this.$message.success('操作成功~')
                        this.getDetail()
                    }
                })
            })

            let data = {
                materials: []
            }

            for(let i = 0; i < this.materialIds.length; i++){
                data.materials.push({
                    packageId: this.materialIds[i],
                    placeholders: null
                })
            }

            projectMaterialDelete(data).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('下架成功~')
                    this.getMaterial()

                }
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
        position: relative;

        .material-top-head{
            display: flex;
            justify-content: space-between;
            align-items: center;

            .head-left{
                .page-title{
                    font-size: 18px;
                    font-weight: bold;
                }

                .screen-count{
                    display: inline-block;
                    color: #999;
                    padding-left: 20px;
                    position: relative;
                    cursor: pointer;

                    b{
                        color: var(--color-danger);
                        padding: 0 5px;
                    }

                    .unprotected-list{
                        position: absolute;
                        top: 20px;
                        right: 0px;
                        z-index: 200;
                        width: 160px;
                        background: #fff;
                        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
                        transform: all .3s;
                        opacity: 0;

                        .el-scrollbar{
                            height: 100%;
                            max-height: 400px;
                        }

                        li{
                            padding: 12px 20px;
                            line-height: 20px;
                            cursor: pointer;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            
                            &:hover{
                                color: var(--color-primary);
                                background: #f3f3ff;
                            }
                        }
                    }

                    &:hover{
                        .unprotected-list{
                            opacity: 1;
                        }
                    }
                }    
            }
        }

        .material-content-wrap{
            margin-top: 20px;
            width: 100%;
            height: calc(100vh - 350px);
            border: 1px solid #dbdbdb;
            display: flex;

            .material-list{
                width: 300px;

                .title{
                    color: 18px;
                    font-weight: bold;
                    height: 60px;
                    line-height: 60px;
                    text-align: center;
                    border-bottom: 1px solid #dbdbdb;
                }

                .el-scrollbar{
                    height: calc(100vh - 410px);
                }

                ul{
                    li{
                        padding: 20px;
                        border-bottom: 1px solid #dbdbdb;
                        text-align: center;
                        cursor: pointer;
                        position: relative;

                        .el-checkbox{
                            position: absolute;
                            top: 0;
                            left: 0;
                            z-index: 99;

                            .el-checkbox__inner{
                                width: 20px !important;
                                height: 20px !important;
                                
                                &::after{
                                    height: 10px;
                                    left: 7px;
                                    top: 2px;
                                }
                            }
                        }
                        
                        &:hover{
                            background: #e3fdfd;
                        }

                        &.active{
                            background: #e3fdfd;
                        }

                        .material-cover{
                            display: inline-block;
                            max-width: 200px;
                            position: relative;

                            .material-name{
                                position: absolute;
                                bottom: 0;
                                left: 0;
                                width: 100%;
                                padding: 0 10px;
                                line-height: 30px;
                                background: rgba($color: #000000, $alpha: 0.5);
                                color: #fff;
                            }
                        }
                    }
                }
            }

            .material-screen-list{
                flex: 1;
                border-left: 1px solid #dbdbdb;

                .material-detail{
                    background: #FFECB8;
                    height: 60px;
                    padding: 5px 20px;

                    p{
                        line-height: 26px;
                        span{
                            padding-right: 20px;
                        }
                    }
                }

                .serarh-and-add-wrap{
                    padding: 20px;
                    display: flex;

                    .el-input{
                        flex: 1;
                    }

                    .el-button{
                        margin-left: 20px;
                    }
                }

                .el-scrollbar{
                    height: calc(100vh - 380px);
                    margin-top: 20px;
                    margin-right: 20px;

                    .screen-list{
                        display: flex;
                        flex-wrap: wrap;
                        
                        li{
                            cursor: pointer;

                            .screen-content{
                                border: 1px solid #e5e5e5;
                                box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
                                margin: 0 0 20px 20px;
                                position: relative;

                                .mask{
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    width: 100%;
                                    height: 100%;
                                    z-index: 10;
                                    background: rgba(32,160,255,0.4);
                                }

                                .screen-image{
                                    width: 100%;

                                    .el-image{
                                        width: 100%;
                                    }
                                }
                                
                                .screen-play-detail{
                                    padding: 0 20px 10px 20px;
                                    text-align: center;

                                    .title{
                                        font-size: 16px;
                                        font-weight: bold;
                                        padding: 10px 0;
                                    }

                                    p{
                                        line-height: 26px;
                                    }
                                }
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