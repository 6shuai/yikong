<template>
    <el-dialog
        title="编辑用户"
        :visible.sync="showUserDetailDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="850px">
        <el-form 
            label-width="80px"
        >
            <el-row>
                <el-col :span="12">
                    <el-form-item label="登录名">
                        {{ userData.accountName }}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="昵称">
                        {{ userData.nickname }}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="email">
                        {{ userData.email }}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="手机号">
                        {{ userData.mobile }}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="QQ">
                        {{ userData.qq }}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="微信">
                        {{ userData.wechat }}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="主页">
                        <template slot-scope="scope">
                            <el-select v-model="homePageIds" multiple placeholder="请选择主页" style="width:100%">
                                <el-option
                                    v-for="item in homePageListData"
                                    :key="item.id"
                                    :label="item.displayName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </template>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showUserDetailDialog=false">取 消</el-button>
            <el-button type="primary" :loading="updateBtnLoading" @click="handleUpdateUserHomePage">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { getHomePageList } from '@/api/common'
import { memberHomePageUpdate } from '@/api/user'

export default {
    data() {
        return {
            // 是否显示用户详情
            showUserDetailDialog: false,

            // 主页列表
            homePageListData: [],

            // 用户详情数据
            userData: {},

            // 用户绑定的主页id
            homePageIds: [],

            updateBtnLoading: false,
        }
    },
    methods: {
        // 显示用户数据
        showDialog(data){
            this.showUserDetailDialog = true
            this.userData = JSON.parse(JSON.stringify(data))
            this.homePageIds = []
            this.userData.homePages.forEach((item) => {
                this.homePageIds.push(item.id)
            })
            this.homePageList()
        },

        // 获取主页列表
        homePageList(){
            getHomePageList().then(res => {
                if(res.code === this.$successCode){
                    this.homePageListData = res.obj
                }
            })
        },

        // 更新用户主页
        handleUpdateUserHomePage(){
            let data = `?userId=${this.userData.id}&homePageIds=${this.homePageIds.join(',')}`;

            this.updateBtnLoading = true;
            memberHomePageUpdate(data).then(res => {
                this.updateBtnLoading = false;
                if(res.code === this.$successCode){
                    this.showUserDetailDialog = false;
                    this.$message.success('更新成功~');
                    this.$parent.init();
                }
            })
        },
    }
}
</script>