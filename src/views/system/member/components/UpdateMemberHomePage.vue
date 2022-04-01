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
                <el-col :span="24">
                    <el-form-item label="主页">
                        <template slot-scope="scope">
                            <el-select 
                                v-model="homePageIds" 
                                multiple 
                                placeholder="请选择主页" 
                                style="width:100%"
                                @change="handleChangeSeletPageHome"
                            >
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
                <el-col :span="24">
                    <el-form-item label="主页角色">
                        <template slot-scope="scope">
                            <ul class="home-page-role" v-show="bindHomePageList && bindHomePageList.length">
                                <li v-for="(item, index) in bindHomePageList" :key="item.id">
                                    <p>{{ item.displayName }}</p>
                                    <el-checkbox 
                                        v-for="(ritem, rindex) in item.roles" 
                                        :labe="ritem.id"
                                        :key="rindex"
                                        :value="bindHomePageRoleIds[item.id] && bindHomePageRoleIds[item.id].includes(ritem.id)"
                                        :disabled="bindHomePageRoleIds[item.id] && bindHomePageRoleIds[item.id].length==1 && bindHomePageRoleIds[item.id].includes(ritem.id)"
                                        @change="handleChangeCheckbox(index, item.id, ritem.id)"
                                    >{{ ritem.displayName }}</el-checkbox>
                                </li>
                            </ul>
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

            // 已绑定的主页
            bindHomePageList: [],

            // 已绑定的主页 对应的角色列表
            bindHomePageRoleIds: {},

            updateBtnLoading: false,
            checkList:[]
        }
    },
    methods: {
        // 显示用户数据
        showDialog(data){
            this.showUserDetailDialog = true
            this.userData = JSON.parse(JSON.stringify(data))
            this.homePageIds = []
            this.bindHomePageList = []
            this.bindHomePageRoleIds = {}
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
                    this.setBindHomePage(this.userData.homePages)
                }
            })
        },

        // 选择主页
        handleChangeSeletPageHome(){
            this.bindHomePageList = this.homePageListData.filter((item) => {
                return this.homePageIds.includes(item.id)
            })

            for(let i in this.bindHomePageRoleIds){
                if(!this.homePageIds.includes(Number(i))) {
                    this.bindHomePageRoleIds[i] = []
                }
            }

            this.setBindHomePageRole(this.bindHomePageList)
        },

        // 显示已绑定的主页
        setBindHomePage(data){
            this.bindHomePageList = this.homePageListData.filter((item) => {
                return this.homePageIds.includes(item.id)
            })
            this.setBindHomePageRole(data ? data : this.bindHomePageList)
        },

        // 设置已绑定的主页  选中的角色
        setBindHomePageRole(data){
            for(let i = 0; i < data.length; i++){
                let item = data[i]
                if(this.bindHomePageRoleIds[item.id] && this.bindHomePageRoleIds[item.id].length) continue
                this.bindHomePageRoleIds[item.id] = []
                item.roles.forEach((e) => {
                    this.bindHomePageRoleIds[item.id].push(e.id)
                })

            }
        },

        // 修改主页角色
        handleChangeCheckbox(index, pageId, roleId){
            let result = this.bindHomePageRoleIds[pageId].includes(roleId)
            if(result){
                let index = this.bindHomePageRoleIds[pageId].findIndex((item) => item == roleId )
                this.$delete(this.bindHomePageRoleIds[pageId], index)
            }else{
                this.bindHomePageRoleIds[pageId].push(roleId)
            }
            try {
                this.bindHomePageList[index].state = !this.bindHomePageList[index].state
            } catch (error) {
                
            }
            this.$set(this.bindHomePageList, index, this.bindHomePageList[index])
        },

        // 更新用户主页
        handleUpdateUserHomePage(){
            if(!this.homePageIds.length){
                this.$message.error('请至少选择一个主页~')
                return
            }

            // 主页角色
            let roleIds = []
            for(let i in this.bindHomePageRoleIds){
                roleIds =  Array.from(new Set(roleIds.concat(this.bindHomePageRoleIds[i])))
            }

            let data = `?userId=${this.userData.id}&homePageIds=${this.homePageIds.join(',')}&roleIds=${roleIds.join(',')}`;
            
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

<style lang="scss" scoped>
    .home-page-role{
        border: 1px solid #e5e5e5;
        border-radius: 4px;
        padding: 10px;

        li{
            padding-bottom: 10px;
        }

        p{
            font-weight: bold;
        }

        .el-checkbox{
            width: 100px;
        }
    }
</style>