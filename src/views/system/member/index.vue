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
                <el-table-column label="头像" width="80">
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
                    prop="homePages"
                    label="主页"
                    min-width="180">
                    <template slot-scope="scope">
                        <el-tag 
                            v-for="(item, index) in scope.row.homePages" 
                            :key="index" 
                            size="mini"
                            style="margin-right: 5px"
                        >{{item.displayName}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="150">
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

        </el-card>
        <!-- 创建组织 -->
        <created-group 
            ref="createdGroup"
            @createdSuccess="searchGroupInfo"
        ></created-group>

        <!-- 添加成员 -->
        <add-member ref="addMember" :groupId="this.groupData.id"></add-member>

        <!-- 编辑用户对应的主页 -->
        <update-member-home-page ref="updateMemberHomePage"></update-member-home-page>

    </div>
</template>

<script>
import { groupMemberList, memberDelete, organizationSearchId, organizationDelete } from '@/api/user';
import CreatedGroup from '@/views/system/organizations/components/CreatedOrganizations';
import AddMember from './components/AddMember';
import UpdateMemberHomePage from './components/UpdateMemberHomePage'

export default {
    data(){
        return {
            resData: [],
            tLoading: false,
            currentParams: {},            //选中的用户 参数
            groupData: {},                //组织信息
            pageLoad: false
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

        // 点击编辑用户  更新用户主页
        editCurrentMember(data){
            this.$refs.updateMemberHomePage.showDialog(data)
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
        AddMember,
        UpdateMemberHomePage
    }
}
</script>

<style lang="scss">
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