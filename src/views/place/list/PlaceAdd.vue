<template>
    <el-dialog
        title="添加场所"
        :visible.sync="addPlaceDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="800px">
        <el-form 
            label-width="160px"
        >
            <el-form-item label="场所名">
                <el-input v-model="placeForm.displayName" placeholder="场所名"></el-input>
            </el-form-item>
            <el-form-item label="场所类型">
                <el-select v-model="placeFormType" placeholder="请选择场所类型" style="width:100%">
                    <el-option label="类型1" :value="1"></el-option>
                    <el-option label="类型2" :value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="场所描述">
                <el-input type="textarea" :rows="2" v-model="placeForm.description" placeholder="场所描述"></el-input>
            </el-form-item>
            <el-form-item label="地区">
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
            </el-form-item>
            <el-form-item label="详细地址">
                <el-input v-model="placeForm.address" placeholder="详细地址"></el-input>
            </el-form-item>
            <el-form-item label="场所经纬度">
                <el-input @focus="showMap=true" :value="`${placeForm.longitude ? placeForm.longitude + ' , ' : ''}${placeForm.latitude || ''}`" placeholder="场所经纬度"></el-input>
            </el-form-item>
            <el-form-item label="场所照片">
                <upload-img :isArray="true" :imgList="[]"></upload-img>
            </el-form-item>
            <el-form-item label="场所微信号二维码">
                <upload-img :isArray="false" imgList=""></upload-img>
            </el-form-item>
            <el-form-item label="是否启用">
                <el-switch v-model="placeForm.enabled"></el-switch>
            </el-form-item>
            
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addPlaceDialog=false">取 消</el-button>
            <el-button type="primary" :loading="btnLoading" @click="placeSureBtn">确 定</el-button>
        </span>
        <el-dialog
            width="640px"
            title="场所位置"
            :visible.sync="showMap"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @close="hideMap"
            append-to-body>
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
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="hideMap">确 定</el-button>
            </span>
        </el-dialog>
    </el-dialog>
</template>
<script>
import { placeCreated, placeUpdate, placeProvincesData, placeCitysData, placeAreasData, adcodeFindData } from '@/api/place';
import { organizationSearchId } from '@/api/user';
import TheMap from '@/components/BaiduMap/index';
import UploadImg from '@/components/Upload/UploadImg';
import axios from 'axios';
export default {
    data(){
        return {
            addPlaceDialog: false,
            placeForm: {},
            showMap: false,                  //显示百度地图
            region: {},                      //省市县
            btnLoading: false,               //确定按钮  loading
            placeFormType: null,
            addressJoin: '',
        }
    },
    methods: {
        showDialog(data){
            this.placeForm = {
                ...data,
                country: 3,
                wechat: 'wechatqr.png'
            };
            this.addPlaceDialog = true;
            this.provincesList();
            if(!this.placeForm.owner) this.getGroupId();
        },

        //添加 编辑 场所
        placeSureBtn(){
            if(!this.placeForm.displayName){
                this.$message.warning('请输入场所名称~');
                return
            }
            this.btnLoading = true;
            if(!this.placeForm.id){
                //添加场所
                placeCreated(this.placeForm).then(res => {
                    this.placeRes(res);
                })
            }else{
                //编辑场所
                placeUpdate(this.placeForm).then(res => {
                    this.placeRes(res);
                })
            }
        },

        placeRes(res){
            this.btnLoading = false;
            if(res.code == this.$successCode){
                this.addPlaceDialog = false;
                this.$message.success(res.message);
                this.$parent.init();
            }
        },

        //获取位置的坐标
        getLocation(location) {
            //赋值经度纬度和地址   
            if (location) {       
                this.$set(this.placeForm, 'longitude', Number(location.lng));   //经度
                this.$set(this.placeForm, 'latitude', Number(location.lat));    //纬度 
            }
        },

        //关闭地图  
        hideMap(){
            //根据经纬度 获取行政编号
            this.showMap = false;
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
                    break;
                case 'cityName':
                    obj = this.region.city;
                    this.$set(this.placeForm, 'areaName', '');
                    this.$set(this.placeForm, 'areaNo', '');
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
        },

        //查询自己的组织id
        getGroupId(){
            organizationSearchId(Number(this.$store.state.user.loginData.id)).then(res => {
                if(res.code === this.$successCode){
                    this.placeForm.owner = res.obj.id;
                }
            })
        }
    },
    components: {
        TheMap,
        UploadImg
    }
}
</script>