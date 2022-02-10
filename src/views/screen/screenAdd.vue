<template>
    <el-card class="screen-add-wrap">
        <el-page-header @back="$router.go(-1)">
            <div slot="content">
                {{$route.params.id ? '编辑大屏' : '创建大屏'}}
            </div>
        </el-page-header>
        <el-row :gutter="10" class="mt30" v-loading="$route.params.id && loading">
            <el-col :xs="24" :sm="24" :md="18" :lg="16" :xl="12">
                <el-form 
                    label-width="160px"
                    ref="screenParams"
                    :model="screenParams"
                    :rules="screenRules"
                >
                    <el-form-item label="大屏名称" prop="displayName">
                        <el-input v-model="screenParams.displayName" placeholder="大屏名称"></el-input>
                    </el-form-item>
                    <el-form-item label="场所" prop="place">
                        <el-select filterable v-model="screenParams.place" placeholder="请选择场所" style="width:100%">
                            <el-option 
                                v-for="item in placeData" 
                                :label="item.displayName" 
                                :key="item.id"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="品牌" prop="brand">
                        <el-select v-model="screenParams.brand" placeholder="请选择所属品牌" style="width:100%">
                            <el-option 
                                v-for="item in groupData" 
                                :key="item.id"
                                :label="item.displayName" 
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input type="textarea" :rows="3" v-model="screenParams.description" placeholder="大屏描述"></el-input>
                    </el-form-item>
                    <el-form-item label="点距规格" prop="dotPitch">
                        <el-select v-model="screenParams.dotPitch" placeholder="请选择点距规格">
                            <el-option 
                                v-for="item in dotpitchData" 
                                :key="item.id"
                                :label="item.displayName" 
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分辨率(像素)" class="is-required">
                        <el-row>
                            <el-col :span="11">
                                <el-form-item prop='resolutionWidth'>
                                    <el-input type="number" v-model="screenParams.resolutionWidth" placeholder="宽"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2" style="text-align: center">
                                <span>x</span>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item prop='resolutionHeight'>
                                    <el-input type="number" v-model="screenParams.resolutionHeight" placeholder="高"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="物理尺寸(mm)" class="is-required">
                        <el-row>
                            <el-col :span="11">
                                <el-form-item prop='physicalWidth'>
                                    <el-input type="number" v-model="screenParams.physicalWidth" placeholder="宽"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2" style="text-align: center">
                                <span>x</span>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item prop='physicalHeight'>
                                    <el-input type="number" v-model="screenParams.physicalHeight" placeholder="高"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="分辨率(宽高比)" prop="aspectRatio">
                        <el-select v-model="screenParams.aspectRatio" placeholder="请选择分辨率">
                            <el-option 
                                v-for="item in aspectRatioData" 
                                :key="item.id"
                                :label="item.width + ' : ' + item.height"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="beginTime">
                        <el-time-picker
                            v-model="screenParams.beginTime"
                            type="datetime"
                            placeholder="选择开始时间"
                            value-format="HH:mm:ss"
                        >
                        </el-time-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="endTime">
                        <el-time-picker
                            v-model="screenParams.endTime"
                            type="datetime"
                            placeholder="选择结束时间"
                            value-format="HH:mm:ss"
                        >
                        </el-time-picker>
                    </el-form-item>
                    <el-form-item label="实景图片" prop="screenShowData">
                        <upload-img 
                            ref="uploadImg"
                            :isArray="true" 
                            :showCover="true"
                            :imgList="screenParams.screenShowData"
                            @deleteImg="ShowDelete"
                            @showDefault="showDefault"
                            @uploadImgPath="uploadImgSuccess"
                        ></upload-img>
                    </el-form-item>
                    <group-list 
                        v-if="!screenParams.id"
                        propValue="groupIds"
                        @groupSelected="$set(screenParams, 'groupIds', $event)"
                    ></group-list>

                    <el-form-item label="刊例价">
                        <el-button
                            type="primary"
                            plain
                            size="mini"
                            @click="$refs.createScreenPric.showCreateScreenPriceDialog()"
                        >
                            添加
                        </el-button>
                        <el-table
                            class="mb20"
                            stripe
                            size="small"
                            :data="screenParams.publishedPrices"
                        >
                            <el-table-column 
                                prop="price" 
                                label="刊例价" 
                                min-width="60"
                            >
                            </el-table-column>
                            <el-table-column 
                                prop="priceSystem" 
                                label="价格体系" 
                                min-width="100"
                            >
                                <template slot-scope="scope">
                                    {{ findPriceType(scope.row.priceSystem) }}
                                </template>
                            </el-table-column>
                            <el-table-column 
                                prop="beginTime" 
                                label="操作" 
                                width="100"
                            >
                                <template slot-scope="scope">
                                    <a 
                                        href="javascript:;"
                                        class="price-edit"
                                        @click="$refs.createScreenPric.showCreateScreenPriceDialog({...scope.row, index: scope.$index})"
                                    >
                                        编辑
                                    </a>
                                    <a 
                                        href="javascript:;" 
                                        class="ml10 price-delete"
                                        @click="screenParams.publishedPrices.splice(scope.$index, 1)"
                                    >
                                        删除
                                    </a>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>

                    <el-form-item label="">
                        <el-button type="primary" icon="el-icon-check" :loading="btnLoading" @click="screenSureBtn">提  交</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>


        <!-- 创建屏幕刊例价 -->
        <create-screen-pric
            ref="createScreenPric"
            @handleCreatePriceSuccess="handleCreatePriceSuccess"
        ></create-screen-pric>

    </el-card>
</template>
<script>
import { getPriceTypeList } from '@/api/common';
import { screenPlaceList, screenCreated, screenShowDelete, screenShowDefault } from '@/api/screen';
import { getOrganizationList, objsDifferMethod } from '@/mixins';
import { getDotPitch, getAspectRatio, getScreenDetail } from '@/views/screen/mixins';
import { findTimeHasYtd } from '@/utils/index';
import uploadImg from '@/components/Upload/UploadImg';
import GroupList from '@/components/GroupList/index';
import CreateScreenPric from './components/CreateScreenPrice';


export default {
    mixins: [getOrganizationList, objsDifferMethod, getDotPitch, getAspectRatio, getScreenDetail],
    data(){
        return {
            screenParams: {
                screenShowData: [],

                // 刊例价
                publishedPrices: [],

                beginTime: '10:00:00',

                endTime: '22:00:00'
            },
            btnLoading: false,     
            placeData: [],                //场所列表         
            showUserInput: false,         //是否显示用户名密码框
            screenRules: {
                displayName: [{ required: true, trigger: "blur", message: '请输入大屏名称~' }],
                place: [{ required: true, trigger: "change", message: '请选择场所~' }],
                brand: [{ required: true, trigger: "change", message: '请选择品牌~' }],
                dotPitch: [{ required: true, trigger: "change", message: '请选择点距规格~' }],
                resolutionWidth: [{ required: true, trigger: "blur", message: '请输入分辨率宽~' }],
                resolutionHeight: [{ required: true, trigger: "blur", message: '请输入分辨率高~' }],
                physicalWidth: [{ required: true, trigger: "blur", message: '请输入物理尺寸宽~' }],
                physicalHeight: [{ required: true, trigger: "blur", message: '请输入物理尺寸高~' }],
                aspectRatio: [{ required: true, trigger: "change", message: '请选择分辨率(宽高比)~' }],
                beginTime: [{ required: true, trigger: "change", message: '请选择开始时间~' }],
                endTime: [{ required: true, trigger: "change", message: '请选择开始时间~' }],
                screenShowData: [{ required: true, trigger: "change", message: '请选择结束时间~' }],
                groupIds: [{ required: true, trigger: "blur", message: '请选择权限群组~' }]
            },
            loading: false,          //编辑时获取详情  loading
        }
    },
    mounted() {
        this.hasPagePerm('Screen').then(res => {
            if(res){
                this.getPriceType()
                this.init()
            }
        })
    },
    methods: {
        init(){
            this.getplaceList();
            if(this.$route.params.id){
                new Promise((resolve) => {
                    this.loading = true;
                    this.initDetail(resolve);
                }).then(res => {
                    this.loading = false;
                    this.screenParams = this.resData;
                    this.screenParams.place = this.resData.placeId;
                    this.screenParams.beginTime = findTimeHasYtd(this.screenParams.beginTime)
                    this.screenParams.endTime = findTimeHasYtd(this.screenParams.endTime)
                })
            }
        },

        //提交
        screenSureBtn(){
            this.$refs.screenParams.validate((valid) => {
                if (valid) {
                    this.diffStatus = true;
                    this.btnLoading = true;

                    let data = JSON.parse(JSON.stringify(this.screenParams))

                    data.beginTime = findTimeHasYtd(data.beginTime)
                    data.endTime = findTimeHasYtd(data.endTime)

                    screenCreated(data).then(res => {
                        this.btnLoading = false;
                        if(res.code === this.$successCode){
                            this.$router.push('/screen/index');
                            this.$message.success('操作成功~');
                        }
                    })
                }else{
                    this.$message.warning('必填项未填写完整~');
                }
            })
        },

        //场所列表
        getplaceList(){
            screenPlaceList().then(res => {
                this.placeData = res.obj;
            })
        },

        //图片上传成功
        uploadImgSuccess(path){
            this.screenParams.screenShowData.push({
                uri: path,
                isDefault: this.screenParams.screenShowData.length ? 0 : 1,
                newUpload: 1
            })
        },

        //删除实景图片
        ShowDelete(file, resolve){
            if(file.isDefault){
                this.$message.warning('不可以删除封面图~');
                return
            }else if(file.id){
                screenShowDelete(file.id).then(res => {
                    if(res.code === this.$successCode){
                        this.screenParams.screenShowData.splice(file.index, 1);
                        resolve('success');
                    }
                })
            }else{
                this.screenParams.screenShowData.splice(file.index, 1);
            }
        },

        //图片设置为列表默认图
        showDefault(id, index){
            if(id){
                screenShowDefault(id).then(res => {
                    if(res.code === this.$successCode){
                        this.$message.success('列表封面图片设置成功~');
                        this.currentImgDefault(index, id);
                    }
                })
            }else{
                this.currentImgDefault(index);
            }
        },

        //设置默认图片 isDefault=1； 图片上显示置顶图标
        currentImgDefault(index, id){
            this.screenParams.screenShowData.forEach((item, i) => {
                item.isDefault = 0;
                if((item.id && item.id === id) || index === i){
                    item.isDefault = 1;
                }
            })
            this.$refs.uploadImg.changeImgUri(this.screenParams.screenShowData);
        },

        //查询下标
        indexOf(val, arr, key){
            for(var i = 0; i < arr.length; i++){
                if(key){
                    if(arr[i][key] == val) {return i;}
                }else if(arr[i] == val){return i;}
            }
            return -1;
        },

        //用户名自动生成   Admin+6位随机数字
        randomAccount(){
            let n = Math.random().toString().slice(-6);
            this.$set(this.screenParams, 'account', 'Admin' + n);
        },

        // 价格体系列表
        getPriceType(){
            let p = this.$store.state.user.priceTypeData
            if(p.length) return
            getPriceTypeList().then(res => {
                this.$store.state.user.priceTypeData = res.obj
            })
        },

        // 刊例价 创建或编辑成功
        handleCreatePriceSuccess(data){
            if(typeof data.index === 'number' && !isNaN(data.index)){
                this.screenParams.publishedPrices[data.index] = data
                this.$set(this.screenParams.publishedPrices, data.index, data)
            }else{
                this.screenParams.publishedPrices.push(data)
            }
        },

        // 根据刊例价体系id 查找刊例价体系名称
        findPriceType(id){
            let p = this.$store.state.user.priceTypeData || []
            let obj = {}
            obj = p.find(item => {
                return item.id == id
            })
            return obj.displayName
        }
    },
    components: {
        uploadImg,
        GroupList,
        CreateScreenPric
    }
}
</script>
<style lang="scss" scope>
    .screen-add-wrap{
        .edit-btn{
            line-height: 1;
            margin: -3px 0 0 15px;
        }
        .contact-wrap{
            li{
                padding-bottom: 10px;
                .left{
                    width: 142px;
                    float: left;
                    .name{
                        display: inline-block;
                        width: 85px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        line-height: 12px;
                    }
                }
                .right{
                    margin-left: 10px;
                    width: calc(100% - 152px);
                    float: left;
                }
            }
        }

        .price-edit:hover{
            color: var(--color-success);
        }

        .price-delete:hover{
            color: var(--color-danger);
        }
    }
</style>