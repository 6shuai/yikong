<template>
    <el-card shadow="never">
        <div slot="header" class="clearfix">
            成员管理
        </div>
        <div class="top-operation-wrap">
            <el-button size="small" type="primary" @click="addMemberDialog=true;">添加成员</el-button>
        </div>
        <el-table
            v-loading="tLoading"
            size="small"
            :data="resData"
            style="width: 100%;margin-bottom: 20px;"
            row-key="id"
            border>
            <el-table-column label="头像" min-width="80">
                <template slot-scope="scope">
                    <el-avatar :src="scope.row.avatar"></el-avatar>
                </template>
            </el-table-column>
            <el-table-column prop="accountName" label="登录名" min-width="80"></el-table-column>
            <el-table-column prop="nickname" label="昵称" min-width="80"></el-table-column>
            <el-table-column prop="email" label="email" min-width="80"></el-table-column>
            <el-table-column prop="mobile" label="手机" min-width="80"></el-table-column>
            <el-table-column prop="qq" label="QQ" min-width="80"></el-table-column>
            <el-table-column prop="wechat" label="微信" min-width="80"></el-table-column>
            <el-table-column prop="address" label="地址" min-width="80"></el-table-column>
            <el-table-column prop="enabled" label="用户状态" min-width="80"></el-table-column>
            <el-table-column
                prop="name"
                label="用户角色"
                min-width="180">
                <template slot-scope="scope">
                    <el-tag 
                        v-for="(item, index) in scope.row.roles" 
                        :key="index+item.name" 
                        size="mini"
                        style="margin-right: 5px"
                    >{{item.displayName}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                min-width="180">
                <template slot-scope="scope">
                    <el-button 
                        size="mini"
                        type="success"
                        @click="editCurrentMember(scope.row)"
                    >
                        编辑
                    </el-button>
                    <el-popover
                        style="margin-left:10px"
                        placement="top"
                        :ref="scope.row.id"
                        width="200">
                        <p>此操作将移除组织, 是否继续?</p>
                        <div style="text-align: right; margin: 0">
                            <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                            <el-button type="primary" size="mini" @click="delCurrentMember(scope.row.id)">确定</el-button>
                        </div>
                        <el-button 
                            size="mini"
                            type="danger"
                            slot="reference"
                        >
                            删除
                        </el-button>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>

        <!-- 编辑用户角色 -->
        <el-dialog
            title="编辑用户"
            :visible.sync="editMemberDialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            width="850px">
            <el-form 
                label-width="80px"
            >
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="登录名">
                            {{currentParams.accountName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="昵称">
                            {{currentParams.nickname}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="email">
                            {{currentParams.email}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="手机号">
                            {{currentParams.mobile}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="QQ">
                            {{currentParams.qq}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="微信">
                            {{currentParams.wechat}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="角色">
                            <template slot-scope="scope">
                                <el-select v-model="currentParams.roles" multiple placeholder="请选择角色" style="width:100%">
                                    <el-option
                                        v-for="item in roleData"
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
                <el-button @click="editMemberDialog=false">取 消</el-button>
                <el-button type="primary" :loading="editBtnLoading" @click="editMemeberSureBtn">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 添加成员 -->
        <el-dialog
            title="添加成员"
            :visible.sync="addMemberDialog"
            width="520px">
            <el-input placeholder="请输入用户名 回车搜索" @change="searchMemberChange" v-model="keyword" class="input-with-select"></el-input>
            <div v-if="searchMemberList.length">
                <ul class="search-member-list" v-loading="loadingSearchMember">
                    <li class="s-header">
                        <span>头像</span>
                        <span>登录名</span>
                        <span>昵称</span>
                        <span class="add-wrap"></span>
                    </li>
                    <li v-for="(item, index) in searchMemberList" :key="item.id">
                        <span><img :src="item.avatar"></span>
                        <span :title="item.accountName">{{item.accountName}}</span>
                        <span :title="item.nickname">{{item.nickname}}</span>
                        <span class="add-wrap">
                            <i 
                                v-if="!item.haveAdd" 
                                class="el-icon-circle-plus" 
                                title="添加此用户" 
                                @click="addCurrentMember(item.id, index)"
                            ></i>
                        </span>
                    </li>
                </ul>
            </div>
            <div class="search-member-list" v-if="!searchMemberList.length && keyword">暂无数据~</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addMemberDialog=false">取 消</el-button>
            </span>
        </el-dialog>

    </el-card>
</template>

<script>
import { groupMemberList, getAllRoleList, memberCreated, memberDelete, memberSearch, memberRoleUpdate } from '@/api/user';
export default {
    data(){
        return {
            resData: [],
            tLoading: false,
            editMemberDialog: false,      //编辑用户 modal   
            currentParams: {},            //选中的用户 参数
            roleData: [],                 //角色列表
            editBtnLoading: false,
            keyword: '',                 //搜索用户名
            addMemberDialog: false,      //添加用户 modal  
            searchMemberList: [],        //搜索返回的用户列表 
            loadingSearchMember: false,  //搜索  loading
        }
    },
    created() {
        this.init();
        this.roleList();
    },
    methods: {
        init(){
            this.tLoading = true;
            groupMemberList(1).then(res => {
                this.tLoading = false;
                if(res.code === this.$successCode){
                    this.resData = res.obj;
                }
            })
        },

        //更新用户角色
        editMemeberSureBtn(){
            this.editBtnLoading = true;
            memberRoleUpdate().then(res => {
                this.editBtnLoading = false;
                if(res.code === this.$successCode){
                    this.$message.success('更新成功~');
                    this.editMemberDialog = false;
                }
            })
        },

        //点击编辑用户
        editCurrentMember(data){
            this.currentParams = JSON.parse(JSON.stringify(data));
            let ids = [];
            this.currentParams.roles.forEach(item => {
                ids.push(item.id);
            })
            this.currentParams.roles = ids;
            this.editMemberDialog = true;
        },


        //所有角色列表
        roleList(){
            getAllRoleList().then(res => {
                if(res.code === this.$successCode){
                    this.roleData = res.obj;
                }
            })
        },

        //搜索用户
        searchMemberChange(){
            if(!this.keyword){
                this.$message.warning('搜索不能为空~');
                return
            }
            this.loadingSearchMember = true;
            memberSearch(this.keyword).then(res => {
                this.loadingSearchMember = false;
                if(res.code === this.$successCode){
                    this.searchMemberList = res.obj;
                }
            })
        },

        //添加用户到组织
        addCurrentMember(id, index){
            let data = {
                oid: 1,
                uid: id
            }
            memberCreated(data).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('添加成功~');
                    let d = this.searchMemberList[index];
                    d.haveAdd = true;
                    this.$set(this.searchMemberList, index, d);
                    this.init();
                }
            })
        },

        //将用户移除  组织
        delCurrentMember(id){
            let data = {
                oid: 1,
                uid: id
            }
            memberDelete(data).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('删除成功~');
                    this.init();
                }
            })
        },
    },
}
</script>

<style lang="scss" scope>
    .search-member-list{
        width: 100%;
        padding: 20px 0;
        text-align: center;
        li{
            display: flex;
            flex-wrap: nowrap;
            padding: 15px 0;
            line-height: 50px;
            &:hover{
                background: #e9f3fb;
            }
            &.s-header{
                background: #f5f5f5;
                line-height: 20px;
                &:hover{
                   background: #f5f5f5; 
                }
            }
            span{
                flex: 1;
                padding: 0 10px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                img{
                    width: 40px;
                    height: 40px;
                    border-radius: 20px;
                    display: block;
                    margin-top: 5px;
                }
                i{
                    color: #67c23a;
                    font-size: 18px;
                    cursor: pointer;
                }
            }
        }
    }
</style>