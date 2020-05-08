<template>
    <el-card>
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
                        <el-select filterable v-model="screenParams.place" placeholder="请选择场所">
                            <el-option label="场所1" :value="1"></el-option>
                            <el-option label="场所2" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="品牌" prop="owner">
                        <el-select v-model="screenParams.owner" @change="groupUserList(placeForm.owner)" placeholder="请选择所属品牌" style="width:100%">
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
                            <el-option label="规格1" :value="1"></el-option>
                            <el-option label="规格2" :value="2"></el-option>
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
                            <el-option label="16 : 9" :value="1"></el-option>
                            <el-option label="21 : 9 " :value="2"></el-option>
                        </el-select>
                    </el-form-item>
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
                    <el-form-item label="大屏截图" prop="placeShowData">
                        <upload-img :isArray="true" :imgList="screenParams.placeShowData"></upload-img>
                    </el-form-item>
                    <el-form-item label="联系人">
                        <el-select v-model="place_contact" multiple placeholder="请选择联系人" style="width:100%">
                            <el-option 
                                v-for="item in userData" 
                                :key="item.userId"
                                :label="item.accountName" 
                                :value="item.userId">
                            </el-option>
                        </el-select>
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
import { getOrganizationList, getOrganizationUserList } from '@/mixins';
import uploadImg from '@/components/Upload/UploadImg';
export default {
    mixins: [getOrganizationList, getOrganizationUserList],
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
                placeShowData: [
                    {uri: 'https://game.xfengjing.com/app/upload/market/photo/SNeDQguJTPQdWASQB0FuGF3xk5sjkooJZaAPxmAB.jpeg'},
                ]
            },
            place_contact: [],      //联系人
            btnLoading: false,                
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
                placeShowData: [{ required: true, trigger: "change", message: '请上传大屏截图~' }]
            }
        }
    },
    methods: {
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
        }, 
        
        //提交
        screenSureBtn(){
            this.$refs.screenParams.validate((valid) => {
                if (valid) {

                }else{
                    this.$message.warning('必填项未填写完整~');
                }
            })
        }
    },
    components: {
        uploadImg
    }
}
</script>