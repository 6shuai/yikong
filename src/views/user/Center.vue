<template>
    <el-card shadow="never" class="user-center-wrap">
        <div slot="header" class="clearfix">
            个人中心
        </div>
        <el-row :gutter="10">
            <el-col :xs="24" :sm="12">
                <el-form
                    label-width="80px"
                >
                    <el-form-item label="头像：">
                        <upload-img 
                            :isArray="false" 
                            :imgList="userData.avatar"
                            @uploadImgPath="handleAvatarSuccess"
                        ></upload-img>
                    </el-form-item>
                    <el-form-item label="昵称：">
                        <el-input  placeholder="昵称" v-model="userData.nickname"></el-input>
                    </el-form-item>
                    <el-form-item label="email：">
                        <el-input  placeholder="email" v-model="userData.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号：">
                        <el-input  placeholder="手机号" v-model="userData.mobile"></el-input>
                    </el-form-item>
                    <el-form-item label="QQ号：">
                        <el-input  placeholder="QQ号" v-model="userData.qq"></el-input>
                    </el-form-item>
                    <el-form-item label="微信号：">
                        <el-input  placeholder="微信号" v-model="userData.wechat"></el-input>
                    </el-form-item>
                    <el-form-item label="性别：">
                        <el-radio-group v-model="userData.gender">
                            <el-radio :label="true">男</el-radio>
                            <el-radio :label="false">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="通信地址">
                        <el-input  placeholder="通信地址" v-model="userData.address"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-link type="primary" @click="pwParams={};updatePasswordDialog=true">修改密码</el-link>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button size="normal" :loading="loading" type="primary" @click="updateUser">更新用户信息</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>


        <!-- 修改密码 -->
        <el-dialog
            width="500px"
            title="修改密码"
            :visible.sync="updatePasswordDialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            class="time-interval-pub"
            @close="updatePasswordDialog = false"
            append-to-body
        >
            <div class="clearfix">
                <el-form label-width="80px">
                    <el-form-item label="密码" class="is-required">
                        <el-input type="password" v-model="pwParams.password"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" class="is-required">
                        <el-input type="password" v-model="pwParams.confirmPassword"></el-input>
                    </el-form-item>
                </el-form>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button
                    @click="updatePasswordDialog = false"
                    >取 消
                </el-button>
                <el-button
                    type="primary"
                    :loading="btnLoading"
                    @click="handleChangePassword"
                    >确 定</el-button
                >
            </span>
        </el-dialog>

    </el-card>
</template>
<script>
import { userUpdate, userPasswordUpdate } from '@/api/user';
import UploadImg from '@/components/Upload/UploadImg';
export default {
    data() {
        return {
            userData: {},
            loading: false, 
            rawData: null, 
            rules: {},
            updatePasswordDialog: false,
            pwParams: {},
            btnLoading: false
        }
    },
    mounted() {
            // 初始化界面
            this.initialize();
    },
    methods: {
        updateUser() {
            let difference = null;
            for (let k in this.rawData) {
                if (this.rawData[k] !== this.userData[k]) {
                    if (difference === null) {
                        difference = {};
                    }
                    difference[k] = this.userData[k];
                }
            }

            if (difference === null) {
                this.$message.warning('你没有做任何更改~');
            } else {
                difference.id = this.rawData.id;

                // 暂时这样避免后端的boolean成员不能正确判断null的序列号问题
                difference.enabled = this.rawData.enabled;
                this.loading = true;
                userUpdate(difference).then(resp => {
                    this.loading = false;
                    if (resp && resp.obj) {
                        let d = Object.assign(JSON.parse(localStorage.loginData), difference);
                        localStorage.loginData = JSON.stringify(d);
                        this.$message.success("资料更新成功！");
                        this.$store.commit('user/SET_LOGIN_DATA', d);
                    }
                })
            }
        }, 
        initialize() {              
            this.userData = JSON.parse(localStorage.loginData);
            this.rawData = {... this.userData};
        },

        //上传头像成功
        handleAvatarSuccess(path){
            this.userData.avatar = path;
        },

        //修改密码
        handleChangePassword(){
            var testPassword = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,15}$/;
            if(!this.pwParams.password){
                this.$message.error('请输入密码~');
                return
            }else if(!testPassword.test(this.pwParams.password)){
                this.$message.error('至少包含大小写字母、数字和特殊字符的其中3种，长度不小于8位');
                return
            }else if(!this.pwParams.confirmPassword){
                this.$message.error('请输入确认密码~');
                return
            }else if(this.pwParams.password != this.pwParams.confirmPassword){
                this.$message.error('两次输入的密码不一致');
                return
            }
            this.btnLoading = true;

            this.pwParams.id = this.$store.state.user.loginData.id;
            userPasswordUpdate(this.pwParams).then(res => {
                this.btnLoading = false;
                if(res.code === this.$successCode){
                    this.$message.success('修改成功~');
                    this.updatePasswordDialog = false;
                }
            })

        }
    },
    components: {
        UploadImg
    }
}
</script>
