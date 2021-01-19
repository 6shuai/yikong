<template>
    <div class="system-member-wrap">
        <el-card class="template-card" shadow="never">
            <div slot="header" class="clearfix">
                <span>成员管理</span>
                <div class="card-header-right" v-if="groupData && groupData.id">
                    <span>【{{groupData.displayName}}】</span>
                    <!-- 只有创建者才能解散 -->
                    <el-link type="danger" @click="deleteGroup" v-if="isCreator">解散品牌组织</el-link>
                </div>
            </div>
            <div v-if="!groupData.id && pageLoad">
                <p>还没有品牌组织，<el-link type="primary" @click="$refs.createdGroup.showDialog()">创建品牌组织</el-link></p>
            </div>

            <div class="top-operation-wrap">
                <el-button size="small" type="primary" icon="el-icon-plus" @click="$refs.addMember.addMemberDialog=true;">添加成员</el-button>
            </div>
            <el-table
                v-loading="tLoading"
                v-if="groupData.id"
                stripe
                size="small"
                :data="resData"
                style="width: 100%;margin-bottom: 20px;"
                row-key="id"
                border>
                <el-table-column label="头像" min-width="50">
                    <template slot-scope="scope">
                        <el-image
                            class="member-header-img"
                            :src="scope.row.avatar">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="accountName" label="登录名" min-width="80"></el-table-column>
                <el-table-column prop="nickname" label="昵称" min-width="80"></el-table-column>
                <el-table-column prop="email" label="email" min-width="80"></el-table-column>
                <el-table-column prop="mobile" label="手机" min-width="80"></el-table-column>
                <el-table-column prop="qq" label="QQ" min-width="80"></el-table-column>
                <el-table-column prop="wechat" label="微信" min-width="80"></el-table-column>
                <el-table-column prop="address" label="地址" min-width="80"></el-table-column>
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
                    v-if="isCreator"
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

        </el-card>
        <!-- 创建组织 -->
        <created-group 
            ref="createdGroup"
            @createdSuccess="searchGroupInfo"
        ></created-group>

        <!-- 添加成员 -->
        <add-member ref="addMember" :groupId="this.groupData.id"></add-member>
    </div>
</template>

<script>
import { groupMemberList, getAllRoleList, memberDelete, memberRoleUpdate, organizationSearchId, organizationDelete } from '@/api/user';
import CreatedGroup from '@/views/system/organizations/components/CreatedOrganizations';
import AddMember from './AddMember';
export default {
    data(){
        return {
            resData: [],
            tLoading: false,
            editMemberDialog: false,      //编辑用户 modal   
            currentParams: {},            //选中的用户 参数
            roleData: [],                 //角色列表
            editBtnLoading: false,
            groupData: {},                //组织信息
            pageLoad: false,
        }
    },
    computed: {
        isCreator(){
            return this.groupData.owner == this.$store.state.user.loginData.id;
        }
    },
    created() {
        this.searchGroupInfo();
    },
    methods: {
        init(){
            this.tLoading = true;
            groupMemberList(this.groupData.id).then(res => {
                this.tLoading = false;
                if(res.code === this.$successCode){
                    this.resData = res.obj;
                }
            })
        },

        //更新用户角色
        editMemeberSureBtn(){
            let data = `?uid=${this.currentParams.id}`;
            this.currentParams.roles.forEach(key => {
                data += '&rid=' + key;
            })
            this.editBtnLoading = true;
            memberRoleUpdate(data).then(res => {
                this.editBtnLoading = false;
                if(res.code === this.$successCode){
                    this.editMemberDialog = false;
                    this.$message.success('更新成功~');
                    this.init();
                }
            })
        },

        //点击编辑用户  更新用户角色
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
            getAllRoleList(this.groupData.organizationType).then(res => {
                if(res.code === this.$successCode){
                    this.roleData = res.obj;
                }
            })
        },

        //将用户移除  组织
        delCurrentMember(id){
            let data = {
                oid: this.groupData.id,
                uid: id
            }
            memberDelete(data).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('删除成功~');
                    this.init();
                }
            })
        },

        //查询自己的组织信息
        searchGroupInfo(){
            organizationSearchId(Number(this.$store.state.user.loginData.id)).then(res => {
                this.pageLoad = true;
                if(!res.obj && typeof(res.obj)!='undefined' && res.obj!=0){
                    this.groupData = {};
                }else if(!res.obj){
                    this.groupData = {};
                }else{
                    this.groupData = res.obj;
                    this.init();
                    if(this.isCreator) this.roleList();
                }
            })
        },

        //解散组织
        deleteGroup(){
            this.$confirm('此操作将解散该组织, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                organizationDelete(this.groupData.id).then(res => {
                    if(res.code === this.$successCode){
                        this.$message.success('操作成功~');
                        this.groupData = {};
                        this.resData = [];
                        this.searchGroupInfo();
                    }
                })
            })
        }
    },
    components: {
        CreatedGroup,
        AddMember
    }
}
</script>

<style lang="scss" scope>
    .system-member-wrap{
        .card-header-right{
            float: right; 
            span{
                margin-right: 5px;
            }
        }
        .member-header-img{
            width: 45px;
            height: 45px;
            border-radius: 50%;
        }
        .search-member-list{
            width: 100%;
            padding: 20px 0;
            min-height: 50px;
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
    }
</style>