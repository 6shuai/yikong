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
                        <el-upload
                            class="avatar-uploader"
                            action=""
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="userData.avatar" :src="userData.avatar" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
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
                            <el-radio :label="1">男</el-radio>
                            <el-radio :label="0">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="通信地址">
                        <el-input  placeholder="通信地址" v-model="userData.address"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button size="normal" :loading="loading" type="primary" @click="updateUser">更新用户信息</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>
<script>
import { userUpdate } from '@/api/user';
export default {
    data() {
        return {
            userData: {},
            loading: false, 
            rawData: null, 
            rules: {}
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
                    difference.gender = this.rawData.gender
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
            handleAvatarSuccess(){

            },

            //上传之前
            beforeAvatarUpload(){

            }
        }
}
</script>

<style lang="scss" scope>
    .user-center-wrap{
        .header-img{
            width: 100%;
            height: 100%;
            border: 6px;
        }
        .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
            border-color: #409EFF;
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 128px;
            height: 128px;
            line-height: 128px;
            text-align: center;
        }
        .avatar {
            width: 128px;
            height: 128px;
            display: block;
        }
    }
</style>