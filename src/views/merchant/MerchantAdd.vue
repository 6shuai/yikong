<template>
    <div class="place-add-wrap">
        <el-card class="template-card">
            <el-page-header @back="$router.go(-1)">
                <div slot="content">
                    {{$route.params.id ? '编辑商户' : '创建商户'}}
                </div>
            </el-page-header>
            <el-row :gutter="10" class="mt30" v-loading="$route.params.id && loading">
                <el-col :xs="24" :sm="24" :md="12">
                    <el-form 
                        label-width="160px"
                        ref="placeForm"
                        :model="placeForm"
                        :rules="placeRules"
                    >
                        <el-form-item label="商户名称" prop="displayName">
                            <el-input v-model="placeForm.displayName" placeholder="商户名称"></el-input>
                        </el-form-item>
                        <el-form-item label="地理位置" class="is-required">
                            <el-input 
                                @focus="showMap=true" 
                                :value="`${placeForm.proName || ''}${placeForm.cityName ? ' - ' + placeForm.cityName : ''}${placeForm.areaName ? ' - ' + placeForm.areaName : ''}`" 
                                placeholder="地理位置"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="所属商场">
                            <el-select v-model="placeForm.placeId" filterable placeholder="请选择所属商场" style="width:100%">
                                <el-option 
                                    v-for="item in placeData" 
                                    :key="item.id"
                                    :label="item.displayName" 
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="详细地址" prop="address">
                            <el-input v-model="placeForm.address" placeholder="详细地址"></el-input>
                        </el-form-item>
                        <el-form-item label="店长手机" prop="bossMobile">
                            <el-input v-model="placeForm.bossMobile" placeholder="店长手机"></el-input>
                        </el-form-item>
                        <el-form-item label="展示图片" prop="image">
                            <upload-img 
                                ref="uploadImg"
                                :isArray="false" 
                                :imgList="placeForm.image"
                                :showCover="true"
                                @uploadImgPath="uploadImgSuccess"
                            ></upload-img>
                        </el-form-item>

                        <group-list 
                            v-if="!placeForm.id"
                            propValue="groupIds"
                            @groupSelected="$set(placeForm, 'groupIds', $event)"
                        ></group-list>

                        <el-form-item label="">
                            <el-button @click="$router.go(-1)">取  消</el-button>
                            <el-button type="primary" icon="el-icon-check" :loading="btnLoading" @click="placeSureBtn">提  交</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-card>

        <el-dialog
            width="640px"
            title="商户位置"
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
import { placeProvincesData, placeCitysData, placeAreasData, adcodeFindData } from '@/api/place';
import { merchantPlaceList, merchantCreated, merchantDetail } from '@/api/merchant';
import TheMap from '@/components/BaiduMap/index';
import UploadImg from '@/components/Upload/UploadImg';
import { objsDifferMethod } from '@/mixins';
import GroupList from '@/components/GroupList/index';

export default {
    mixins: [objsDifferMethod],
    data(){
        return {
            placeForm: {},
            placeData: [],                   //商户列表
            showMap: false,                  //显示百度地图
            region: {},                      //省市县
            btnLoading: false,               //确定按钮  loading
            addressJoin: '',
            placeRules: {
                displayName: [{ required: true, trigger: "blur", message: '请输入商户名称~' }],
                proName: [{ required: true, trigger: "blur", message: '请输入地理位置~' }],
                address: [{ required: true, trigger: "blur", message: '请输入详细地址~' }],
                image: [{ required: true, trigger: "change", message: '请上传展示图片~' }],
                bossMobile: [{ required: true, trigger: "blur", message: '请输入店长手机~' }],
                groupIds: [{ required: true, trigger: "blur", message: '请选择权限群组~' }]
            },
            loading: false,                  //编辑时获取详情loading
        }
    },
    mounted() {
        this.init();
        this.getPlaceList();
    },
    methods: {
        init(data){
            this.provincesList();
            if(this.$route.params.id){
                this.getDetail();
            }
        },

        //商户详情
        getDetail(){
            this.loading = true;
            merchantDetail(this.$route.params.id).then(res => {
                this.loading = false;
                this.placeForm = res.obj;
            })
        },

        //商户列表
        getPlaceList(){
            merchantPlaceList().then(res => {
                this.placeData = res.obj;
            })
        },

        //添加 编辑 商户
        placeSureBtn(){
            this.$refs.placeForm.validate((valid) => {
                
                if (valid) {
                    this.diffStatus = true;
                    if(this.placeForm.id && this.objsDiffer(this.oldParams, this.placeForm)){
                        this.$message.warning('你没有做任何更改~');
                        return
                    }
                    this.btnLoading = true;
                    merchantCreated(this.placeForm).then(res => {
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
                this.$router.push('/merchant');
                this.$message.success('操作成功~');
            }
        },


        //上传图片成功
        uploadImgSuccess(path){
            this.$set(this.placeForm, 'image', path)
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
        UploadImg,
        GroupList
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