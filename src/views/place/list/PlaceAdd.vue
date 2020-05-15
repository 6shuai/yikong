<template>
    <div class="place-add-wrap">
        <el-card class="template-card">
            <el-page-header @back="$router.go(-1)">
                <div slot="content">
                    {{$route.params.id ? '编辑场所' : '创建场所'}}
                </div>
            </el-page-header>
            <el-row :gutter="10" class="mt30">
                <el-col :xs="24" :sm="24" :md="12">
                    <el-form 
                        label-width="160px"
                        ref="placeForm"
                        :model="placeForm"
                        :rules="placeRules"
                    >
                        <el-form-item label="场所名称" prop="displayName">
                            <el-input v-model="placeForm.displayName" placeholder="场所名称"></el-input>
                        </el-form-item>
                        <el-form-item label="场所类型" prop="placeType">
                            <el-select v-model="placeForm.placeType" filterable placeholder="请选择场所类型" style="width:100%">
                                <el-option 
                                    v-for="item in placeTypeData" 
                                    :key="item.id"
                                    :label="item.displayName" 
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="所属品牌" prop="owner">
                            <el-select v-model="placeForm.owner" filterable @change="groupUserList(placeForm.owner)" placeholder="请选择所属品牌" style="width:100%">
                                <el-option 
                                    v-for="item in groupData" 
                                    :key="item.id"
                                    :label="item.displayName" 
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="场所描述">
                            <el-input type="textarea" :rows="3" v-model="placeForm.description" placeholder="场所描述"></el-input>
                        </el-form-item>
                        <el-form-item label="地理位置">
                            <el-input 
                                @focus="showMap=true" 
                                :value="`${placeForm.proName || ''}${placeForm.cityName ? ' - ' + placeForm.cityName : ''}${placeForm.areaName ? ' - ' + placeForm.areaName : ''}`" 
                                placeholder="地理位置"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="详细地址">
                            <el-input v-model="placeForm.address" placeholder="详细地址"></el-input>
                        </el-form-item>
                        <el-form-item label="展示图片" prop="placeShowData">
                            <upload-img 
                                :isArray="true" 
                                :imgList="placeForm.placeShowData"
                                :showCover="true"
                                @deleteImg="ShowDelete"
                                @showDefault="showDefault"
                            ></upload-img>
                        </el-form-item>
                        <el-form-item label="场所微信二维码">
                            <upload-img :isArray="false" imgList=""></upload-img>
                        </el-form-item>
                        <el-form-item label="联系人" v-if="userData && userData.length">
                            <ul class="contact-wrap">
                                <li class="clearfix" v-for="(item, index) in userData" :key="index" >
                                    <div class="left" >
                                        <el-checkbox :border="true" :value="isChecked(item)" @change="selectedContact($event, index)"><span class="name">{{item.accountName}}</span></el-checkbox>
                                    </div>
                                    <div class="right">
                                        <el-input v-model="item.description" placeholder="备注"></el-input>
                                    </div>
                                </li>
                            </ul>
                        </el-form-item>
                        <el-form-item label="">
                            <el-button type="primary" icon="el-icon-check" :loading="btnLoading" @click="placeSureBtn">提  交</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-card>

        <el-dialog
            width="640px"
            title="场所位置"
            :visible.sync="showMap"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @close="showMap=false"
            append-to-body>
            <div style="width: 600px;height: 400px">
                <the-map 
                    ref="theMap"
                    v-if="showMap"
                    @getLocation="getLocation" 
                    :visible="true"
                    :lng="placeForm.longitude"
                    :lat="placeForm.latitude"
                    :showSearch="true"
                    :address="addressJoin"
                ></the-map>
            </div>
            <div class="mt20">
                <el-select 
                    v-model="placeForm.proNo" 
                    placeholder="请选择省份" 
                    @change="cityList();findRegion('proName', 'proNo')" 
                    style="width:196px"
                >
                    <el-option
                        v-for="item in region.provinces"
                        :key="item.id"
                        :label="item.proName"
                        :value="item.proNo">
                    </el-option>
                </el-select>
                <el-select 
                    v-model="placeForm.cityNo" 
                    placeholder="请选择市" 
                    @change="areasList();findRegion('cityName', 'cityNo')" 
                    style="width:196px"
                >
                    <el-option
                        v-for="item in region.city"
                        :key="item.id"
                        :label="item.cityName"
                        :value="item.cityNo">
                    </el-option>
                </el-select>
                <el-select 
                    v-model="placeForm.areaNo" 
                    placeholder="请选择区" 
                    @change="findRegion('areaName', 'areaNo')"
                    style="width:196px"
                >
                    <el-option
                        v-for="item in region.areas"
                        :key="item.id"
                        :label="item.areaName"
                        :value="item.areaNo">
                    </el-option>
                </el-select>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { placeCreated, placeProvincesData, placeCitysData, placeAreasData, adcodeFindData, placeShowDelete, placeContactDelete, placeShowDefault } from '@/api/place';
import TheMap from '@/components/BaiduMap/index';
import UploadImg from '@/components/Upload/UploadImg';
import { getOrganizationList, getOrganizationUserList, objsDifferMethod } from '@/mixins';
import { getPlaceTypeList, placeDetailData } from '@/views/place/mixins';
import axios from 'axios';
export default {
    mixins: [getOrganizationList, getOrganizationUserList, objsDifferMethod, getPlaceTypeList, placeDetailData],
    data(){
        return {
            placeForm: {
                wechat: 'wechat.png',
                placeShowData: [
                    {uri: 'https://game.xfengjing.com/app/upload/market/photo/SNeDQguJTPQdWASQB0FuGF3xk5sjkooJZaAPxmAB.jpeg'},
                    {uri: 'https://game.xfengjing.com/app/upload/market/photo/SNeDQguJTPQdWASQB0FuGF3xk5sjkooJZaAPxmAB.jpeg'},
                    {uri: 'https://game.xfengjing.com/app/upload/market/photo/SNeDQguJTPQdWASQB0FuGF3xk5sjkooJZaAPxmAB.jpeg'},
                    {uri: 'https://game.xfengjing.com/app/upload/market/photo/SNeDQguJTPQdWASQB0FuGF3xk5sjkooJZaAPxmAB.jpeg'},
                    {uri: 'https://game.xfengjing.com/app/upload/market/photo/SNeDQguJTPQdWASQB0FuGF3xk5sjkooJZaAPxmAB.jpeg'},
                    {uri: 'https://game.xfengjing.com/app/upload/market/photo/SNeDQguJTPQdWASQB0FuGF3xk5sjkooJZaAPxmAB.jpeg'},
                ]
            },
            place_contact: [],               //联系人 【1,2】
            showMap: false,                  //显示百度地图
            region: {},                      //省市县
            btnLoading: false,               //确定按钮  loading
            placeFormType: null,
            addressJoin: '',
            placeRules: {
                displayName: [{ required: true, trigger: "blur", message: '请输入场所名称~' }],
                placeType: [{ required: true, trigger: "change", message: '请选择场所类型~' }],
                owner: [{ required: true, trigger: "change", message: '请选择所属品牌~' }],
                placeShowData: [{ required: true, trigger: "change", message: '请至少上传一张展示图片~' }]
            }
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init(data){
            this.provincesList();
            if(this.$route.params.id){
                new Promise((resolve) => {
                    this.initDetail(resolve);
                }).then(res => {
                    this.placeForm = this.resData;
                    this.contactList();
                })
            }
        },

        //联系人列表
        contactList(){
            new Promise((resolve) => {
                this.groupUserList(this.placeForm.owner, resolve);
            }).then(res => {
                this.placeForm.placeContactData.forEach(item => {
                    item.placeId = Number(this.$route.params.id);
                    this.place_contact.push(item.userId);
                    var index = this.indexOf(item.userId, this.userData, 'userId');
                    this.userData[index].description = item.description;
                })
                this.oldParams = JSON.parse(JSON.stringify(this.placeForm));
            })
        },

        //添加 编辑 场所
        placeSureBtn(){
            this.$refs.placeForm.validate((valid) => {
                
                if (valid) {
                    this.placeForm.placeContactData = this.contactParams();
                    this.diffStatus = true;
                    if(this.placeForm.id && this.objsDiffer(this.oldParams, this.placeForm)){
                        this.$message.warning('你没有做任何更改~');
                        return
                    }
                    this.btnLoading = true;
                    placeCreated(this.placeForm).then(res => {
                        this.placeRes(res);
                    })
                }else{
                    this.$message.warning('必填项未填写完整~');
                }
            })
        },

        placeRes(res){
            this.btnLoading = false;
            if(res.code == this.$successCode){
                this.$router.push('/place/index');
                this.$message.success('操作成功~');
            }
        },

        //联系人参数 整理
        contactParams(){
            let s = [];
            for(let i = 0; i< this.place_contact.length; i++){
                var index = this.indexOf(this.place_contact[i], this.userData, 'userId');
                if(this.placeForm.placeContactData && this.placeForm.placeContactData[i]){
                    this.placeForm.placeContactData[i].description = index>-1 ? this.userData[index].description : '';
                    s.push(this.placeForm.placeContactData[i]);
                }else{
                    s.push({
                        userId: this.place_contact[i],
                        description: index>-1 ? this.userData[index].description : ''
                    });
                }
            }
            return s;
        },

        //选择联系人
        selectedContact(value, index){
            let userId = this.userData[index].userId;
            if(value){
                this.place_contact.push(userId);
            }else{
                this.place_contact.splice(this.indexOf(userId, this.place_contact), 1);
                this.placeForm.placeContactData.forEach((item, index) => {
                    if(item.userId === userId){
                        this.contactDelete(item.id);
                        this.placeForm.placeContactData.splice(index, 1);
                    }
                })
            }
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

        isChecked(item){
            return this.place_contact.includes(item.userId);
        },

        //删除联系人
        contactDelete(value){
            placeContactDelete(value).then(res =>{
                if(res.code === this.$successCode){
                    this.$message.success('删除成功~');
                }
            })
        },

        //删除场所图片
        ShowDelete(id, resolve){
            placeShowDelete(id).then(res => {
                if(res.code === this.$successCode){
                    resolve('success');
                }
            })
        },

        //图片设置为场所默认图
        showDefault(id){
            placeShowDefault(id).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('列表封面图片设置成功~');
                }
            })
        },

        //获取位置的坐标
        getLocation(location) {
            //赋值经度纬度和地址   
            if (location) {       
                this.$set(this.placeForm, 'longitude', Number(location.lng));   //经度
                this.$set(this.placeForm, 'latitude', Number(location.lat));    //纬度 
                this.geocoding();
            }
        },

        //根据经纬度 获取行政编号  
        geocoding(){
            if(!this.placeForm.longitude) return
            let script = document.createElement("script")
            script.src = `http://api.map.baidu.com/reverse_geocoding/v3/?ak=WpKtslGW53yQ5v1ehnCYKVqSlloS7R7p&output=json&coordtype=wgs84ll&location=${this.placeForm.latitude},${this.placeForm.longitude}&callback=showLocation`
            document.head.appendChild(script);
            window.showLocation = (res) => {
                this.findCurrentAdressCode(res.result.addressComponent.adcode);
            }
        },


        //根据区县代码获取省市区数据
        findCurrentAdressCode(code){
            adcodeFindData(code).then(res => {
                this.placeForm = {
                    ...this.placeForm,
                    ...res.obj
                }
                if(this.placeForm.proNo){
                    this.cityList();
                }
            })
        },

        //省份
        provincesList(){
            placeProvincesData().then(res => {
                this.$set(this.region, 'provinces', res.obj);
                if(this.placeForm.proNo){
                    this.cityList();
                }
            })
        },

        //市
        cityList(){
            placeCitysData(this.placeForm.proNo).then(res => {
                this.$set(this.region, 'city', res.obj);
                if(this.placeForm.cityNo){
                    this.areasList();
                }
            })
        },

        //县
        areasList(){
            placeAreasData(this.placeForm.cityNo).then(res => {
                this.$set(this.region, 'areas', res.obj);
            })
        },

        //获取省市县 名称
        findRegion(type, codeKey){
            let obj = '';
            switch (type) {
                case 'proName':
                    obj = this.region.provinces;
                    this.$set(this.placeForm, 'cityName', '');
                    this.$set(this.placeForm, 'cityNo', '');
                    this.$set(this.placeForm, 'areaName', '');
                    this.$set(this.placeForm, 'areaNo', '');
                    this.$set(this.region, 'city', []);
                    this.$set(this.region, 'areas', []);
                    break;
                case 'cityName':
                    obj = this.region.city;
                    this.$set(this.placeForm, 'areaName', '');
                    this.$set(this.placeForm, 'areaNo', '');
                    this.$set(this.region, 'areas', []);
                    break;
                case 'areaName':
                    obj = this.region.areas;
                    break;
                default:
                    break;
            }
            obj.forEach(item => {
                if(item[codeKey] === this.placeForm[codeKey]){
                    this.placeForm[type] = item[type];
                }
            })
            this.placeForm.longitude = '';
            this.placeForm.latitude = '';
            this.addressJoin = this.placeForm.proName + this.placeForm.cityName + this.placeForm.areaName;
        }
    },
    components: {
        TheMap,
        UploadImg
    }
}
</script>
<style lang="scss" scope>
    .place-add-wrap{
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
    }
</style>