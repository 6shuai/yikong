<template>
    <el-card class="screen-add-wrap">
        <el-page-header @back="$router.go(-1)">
            <div slot="content">
                {{$route.params.id ? '编辑大屏' : '创建大屏'}}
            </div>
        </el-page-header>
        <el-row :gutter="10" class="mt30">
            <el-col :xs="24" :sm="24" :md="12">
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
                    <el-form-item label="品牌" prop="owner">
                        <el-select v-model="screenParams.owner" @change="groupUserList(screenParams.owner)" placeholder="请选择所属品牌" style="width:100%">
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
                    <div v-if="!screenParams.id || showUserInput">
                        <el-form-item label="登录用户名" prop="account">
                            <el-row>
                                <el-col :span="18">
                                    <el-input v-model="screenParams.account" placeholder="登录用户名"></el-input>
                                </el-col>
                                <el-col :span="4" :offset="2">
                                    <el-button size="mini" type="info" @click="randomAccount">自动生成</el-button>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="登录密码" prop="password">
                            <el-row>
                                <el-col :span="18">
                                    <el-input v-model="screenParams.password" placeholder="登录密码"></el-input>
                                </el-col>
                                <el-col :span="4" :offset="2">
                                    <el-button size="mini" type="info" @click="randomPassword">自动生成</el-button>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </div>
                    <el-form-item v-if="screenParams.id && !showUserInput" label="登录用户名">
                        <span>{{screenParams.account}}</span>
                        <el-button 
                            size="mini" 
                            type="primary" 
                            style="margin-left: 15px"
                            @click="showUserInput=true;screenParams.isUpdateAccount=1">编辑
                        </el-button>
                    </el-form-item>
                    <el-form-item label="实景图片" prop="screenShowData">
                        <upload-img 
                            :isArray="true" 
                            :imgList="screenParams.screenShowData"
                            @deleteImg="ShowDelete"
                        ></upload-img>
                    </el-form-item>
                    <el-form-item label="联系人"  v-if="userData && userData.length">
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
                        <el-button type="primary" icon="el-icon-check" :loading="btnLoading" @click="screenSureBtn">提  交</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>
<script>
import { screenPlaceList, screenCreated, screenShowDelete, screenContactDelete } from '@/api/screen';
import { getOrganizationList, getOrganizationUserList, objsDifferMethod } from '@/mixins';
import { getDotPitch, getAspectRatio, getScreenDetail } from '@/views/screen/mixins';
import uploadImg from '@/components/Upload/UploadImg';
export default {
    mixins: [getOrganizationList, getOrganizationUserList, objsDifferMethod, getDotPitch, getAspectRatio, getScreenDetail],
    data(){
        // 校验密码是否  包含大写字母、小写字母、数字和特殊字符其中 两种 不能低于八位
		let validatePass = (rule, value, callback) => {
			if (value.length < 8) {
				callback(new Error("密码长度不能低于八位~"));
			} else if (this.passwordLevel(value) < 2) {
				callback(new Error("必须包含大写字母、小写字母、数字和特殊字符其中两种~"));
			} else {
				callback();
			}
		};
        return {
            screenParams: {
                screenShowData: [
                    {uri: 'https://game.xfengjing.com/app/upload/market/photo/SNeDQguJTPQdWASQB0FuGF3xk5sjkooJZaAPxmAB.jpeg'},
                    {uri: 'https://game.xfengjing.com/app/upload/market/photo/SNeDQguJTPQdWASQB0FuGF3xk5sjkooJZaAPxmAB.jpeg'},
                    {uri: 'https://game.xfengjing.com/app/upload/market/photo/SNeDQguJTPQdWASQB0FuGF3xk5sjkooJZaAPxmAB.jpeg'}
                ]
            },
            screen_contact: [],           //联系人
            btnLoading: false,     
            placeData: [],                //场所列表         
            showUserInput: false,         //是否显示用户名密码框
            screenRules: {
                displayName: [{ required: true, trigger: "blur", message: '请输入大屏名称~' }],
                place: [{ required: true, trigger: "change", message: '请选择场所~' }],
                owner: [{ required: true, trigger: "change", message: '请选择品牌~' }],
                dotPitch: [{ required: true, trigger: "change", message: '请选择点距规格~' }],
                resolutionWidth: [{ required: true, trigger: "blur", message: '请输入分辨率宽~' }],
                resolutionHeight: [{ required: true, trigger: "blur", message: '请输入分辨率高~' }],
                physicalWidth: [{ required: true, trigger: "blur", message: '请输入物理尺寸宽~' }],
                physicalHeight: [{ required: true, trigger: "blur", message: '请输入物理尺寸高~' }],
                aspectRatio: [{ required: true, trigger: "change", message: '请选择分辨率(宽高比)~' }],
                account: [{ required: true, trigger: "blur", message: '请输入登录用户名~' }],
                password: [{ required: true, trigger: "blur", message: '请输入登录密码~' },{ validator: validatePass, trigger: "blur" },],
                screenShowData: [{ required: true, trigger: "change", message: '请上传大屏截图~' }]
            }
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init(){
            this.getplaceList();
            if(this.$route.params.id){
                new Promise((resolve) => {
                    this.initDetail(resolve);
                }).then(res => {
                    this.screenParams = this.resData;
                    this.screenParams.place = this.resData.placeId;
                    this.contactList();
                })
            }
        },

        //联系人列表
        contactList(){
            new Promise((resolve) => {
                this.groupUserList(this.screenParams.owner, resolve);
            }).then(res => {
                this.screenParams.screenContactData.forEach(item => {
                    item.screenId = Number(this.$route.params.id);
                    this.screen_contact.push(item.userId);
                    var index = this.indexOf(item.userId, this.userData, 'userId');
                    this.userData[index].description = item.description;
                })
                this.oldParams = JSON.parse(JSON.stringify(this.screenParams));
            })
        },

        //提交
        screenSureBtn(){
            this.$refs.screenParams.validate((valid) => {
                if (valid) {
                    this.screenParams.screenContactData = this.contactParams();
                    this.diffStatus = true;
                    if(this.screenParams.id && this.objsDiffer(this.oldParams, this.screenParams)){
                        this.$message.warning('你没有做任何更改~');
                        return
                    }
                    this.btnLoading = true;
                    screenCreated(this.screenParams).then(res => {
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

        //联系人参数 整理
        contactParams(){
            let s = [];
            for(let i = 0; i< this.screen_contact.length; i++){
                var index = this.indexOf(this.screen_contact[i], this.userData, 'userId');
                if(this.screenParams.screenContactData && this.screenParams.screenContactData[i]){
                    this.screenParams.screenContactData[i].description = index>-1 ? this.userData[index].description : '';
                    s.push(this.screenParams.screenContactData[i]);
                }else{
                    s.push({
                        userId: this.screen_contact[i],
                        description: index>-1 ? this.userData[index].description : ''
                    });
                }
            }
            return s;
        },

        //场所列表
        getplaceList(){
            screenPlaceList().then(res => {
                this.placeData = res.obj;
            })
        },

        //删除实景图片
        ShowDelete(id, resolve){
            screenShowDelete(id).then(res => {
                if(res.code === this.$successCode){
                    resolve('success');
                }
            })
        },

        //选择联系人
        selectedContact(value, index){
            let userId = this.userData[index].userId;
            if(value){
                this.screen_contact.push(userId);
            }else{
                this.screen_contact.splice(this.indexOf(userId, this.screen_contact), 1);
                this.screenParams.screenContactData.forEach((item, index) => {
                    if(item.userId === userId){
                        this.contactDelete(item.id);
                        this.screenParams.screenContactData.splice(index, 1);
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

        //删除联系人
        contactDelete(id){
            screenContactDelete(id).then(res =>{
                if(res.code === this.$successCode){
                    this.$message.success('操作成功~');
                }
            })
        },

        isChecked(item){
            return this.screen_contact.includes(item.userId);
        },

        //用户名自动生成   Admin+6位随机数字
        randomAccount(){
            let n = Math.random().toString().slice(-6);
            this.$set(this.screenParams, 'account', 'Admin' + n);
        },

        //密码自动生成  8位随机内容，可以包含大写字母、小写字母、数字和特殊字符，至少包含其中3种。  
        //自己输入的必须包含两种 不能低于八位
        randomPassword() {
            let length = 8;
            let passwordArray = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '1234567890', '~!@#$%&*()'];
            let password = [];
            let n = 0;
            for (let i = 0; i < length; i++) {
                // 如果密码长度小于9，则全部为随机值
                if ( password.length < (length - 4) ) {
                    // 获取随机密码索引
                    let arrayRandom = Math.floor(Math.random() * 4);
                    // 获取密码数组值
                    let passwordItem = passwordArray[arrayRandom];
                    // 获取密码数组值随机索引
                    // 得到随机实值
                    let item = passwordItem[Math.floor(Math.random() * passwordItem.length)];
                    password.push(item);
                } else {
                    // 如果密码大则9，最新的4个密码将推入根据随机密码索引
                    // 按顺序获取数组值
                    let newItem = passwordArray[n];
                    let lastItem = newItem[Math.floor(Math.random() * newItem.length)];
                    // G获取数组拼接索引
                    let spliceIndex = Math.floor(Math.random() * password.length);
                    password.splice(spliceIndex, 0, lastItem);
                    n++
                }
            }
            this.$set(this.screenParams, 'password', password.join(""));
        },

        passwordLevel(password) {  
            let Modes = 0;  
            for (let i = 0; i < password.length; i++) {  
                Modes |= CharMode(password.charCodeAt(i));  
            }  
            return bitTotal(Modes);  
        
            //CharMode函数  
            function CharMode(iN) {  
                if (iN >= 48 && iN <= 57)//数字  
                    return 1;  
                if (iN >= 65 && iN <= 90) //大写字母  
                    return 2;  
                if ((iN >= 97 && iN <= 122) || (iN >= 65 && iN <= 90)) //大小写  
                    return 4;  
                else  
                    return 8; //特殊字符  
            }  
        
            //bitTotal函数  
            function bitTotal(num) {  
                let modes = 0;  
                for (let i = 0; i < 4; i++) {  
                    if (num & 1) modes++;  
                    num >>>= 1;  
                }  
                return modes;  
            }  
        }
    },
    components: {
        uploadImg
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
    }
</style>