<template>
    <el-drawer
        class="group-member-list"
        :show-close="true"
        :title="groupInfo.displayName"
        size="600px"
        :visible.sync="drawer">

        <el-scrollbar style="height: 100%;" v-loading="detailLoading">
            <div class="detail">
                <p><i class="el-icon-time"></i>{{formatTime(groupInfo.createTime)}}</p>
                <p>{{groupInfo.description}}</p>
            </div>


            <div class="member-wrap">
                <el-button 
                    v-if="groupPerm.addGroupUser"
                    size="small" 
                    type="primary"
                    icon="icon-plus"
                    @click="$refs.addMember.showAddMemberDialog(groupInfo.id)"
                >添加成员</el-button>
                <div class="member-list">
                    <el-card
                        class="box-card member clearfix"
                        :body-style="{ padding: '0px' }"
                        v-for="(item, index) in resData"
                        :key="index"
                    >
                        <div class="image-name">
                            <el-avatar class="avatar" :src="item.avatar"></el-avatar>
                            <div class="name">
                                <p>{{item.accountName}}</p>
                                <p class="nickname">{{item.nickname}}</p>
                            </div>
                        </div>
                        <div class="role-list">
                            <div class="tag">
                                <el-tag
                                    v-for="(item, index) in item.roleNames"
                                    :key="index"
                                    size="mini"
                                    effect="dark">
                                    {{item.displayName}}
                                </el-tag>
                            </div>
                        </div>
                        <div class="del-btn">
                            <p>
                                <el-popover
                                    v-if="groupPerm.deleteGroupUser"
                                    placement="top"
                                    :ref="item.id"
                                    width="200"
                                >
                                    <p>
                                        此操作将删除成员：【{{
                                            item.accountName
                                        }}】, 是否继续?
                                    </p>
                                    <div style="text-align: right; margin: 0">
                                        <el-button
                                            size="mini"
                                            type="text"
                                            @click="$refs[item.id][0].doClose()"
                                            >取消</el-button
                                        >
                                        <el-button
                                            type="primary"
                                            size="mini"
                                            @click="deleteMember(item.id, index)"
                                            >确定</el-button
                                        >
                                    </div>
                                    <el-link type="danger" slot="reference">删除</el-link>
                                </el-popover>
                            </p>
                            <p><el-link 
                                v-if="groupPerm.editGroupUser"
                                type="primary" 
                                @click="$refs.changeRole.showChangeRoleDialog(item)"
                                >修改角色</el-link>
                            </p>
                        </div>
                    </el-card>

                    <el-pagination
                        background
                        hide-on-single-page
                        layout="total, prev, pager, next, sizes"
                        :page-sizes="[40, 80, 100]"
                        :current-page="Number(params.pageNo)"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :total="totalCount"
                    >
                    </el-pagination>

                </div>
            </div>
        </el-scrollbar>

        <!-- 添加成员 -->
        <add-member 
            ref="addMember"
            @addMemberSuccess="getGroupDetail"
        ></add-member>

        <!-- 修改成员角色 -->
        <change-role
            ref="changeRole"
            @changeRoleSuccess="getGroupDetail"
        ></change-role>

    </el-drawer>
</template>

<script>
import AddMember from './AddMember';
import ChangeRole from './ChangeRole';
import { timeDisposeTool } from '@/mixins';
import { groupDetail, groupResRole, groupMemberDelete } from '@/api/group';

export default {
    mixins: [timeDisposeTool],
    data(){
        return{
            drawer: false,
            params: {
                pageNo: 1,
                pageSize: 20,
            },
            totalCount: 0,
            resData: [],          //群组成员列表
            groupInfo: {},        //群组详情
            detailLoading: false,      
            groupPerm: {},        //权限信息  
        }
    },
    methods: {
        showGroupDetail(data){
            let { id } = data; 
            this.params.id = id;
            this.drawer = true;
            this.groupPerm = data;
            this.detailLoading = true;
            this.resRole().then(res => {
                this.getGroupDetail();
            })
        },

        //内容角色
        resRole(){
            return new Promise((resolve) => {
                groupResRole().then(res => {
                    if(res.code === this.$successCode){
                        this.resRoleData = res.obj;
                        resolve('success');
                    }
                })
            })
        },

        //群组详情  成员列表
        getGroupDetail(){
            groupDetail(this.params).then(res => {
                this.detailLoading = false;
                if(res.code === this.$successCode){
                    let { list, totalRecords } = res.obj.page;
                    this.resData = list;
                    this.totalCount = totalRecords;
                    this.groupInfo = res.obj.resourceGroup;
                    
                    this.resData.forEach((item, index) => {
                        this.resData[index].roleNames = this.findMemberRole(item.roleIds);
                    })
                }
            })
        },

        //查找成员的角色
        findMemberRole(roles){
            let data = [];
            if(roles){
                let roleIds = roles.split(',');
                data = this.resRoleData.filter((item) => {
                    return roleIds.includes(String(item.id))
                })
            }
            return data
        },

        //删除成员
        deleteMember(id, index){
            groupMemberDelete(`?id=${id}`).then(res => {
                if(res.code === this.$successCode){
                    this.$refs[id][0].doClose();
                    this.$message.success('删除成功~');
                    this.resData.splice(index, 1);
                }
            })
        },

        //页码
        handleCurrentChange(page){
            this.params.pageNo = page;
            this.getGroupDetail();
        },
        
        //每页多少条
        handleSizeChange(size){
            this.params.pageSize = size;
            this.getGroupDetail();
        }
    },
    components: {
        AddMember,
        ChangeRole
    }
}
</script>

<style lang="scss">
    .group-member-list{
        .el-drawer__header{
            margin-bottom: 10px;
        }
        .detail{
            padding: 10px;
            line-height: 20px;
            color: #999;
            p{
                margin-bottom: 10px;
            }
            .el-icon-time{
                margin-right: 5px;
            }
        }

        .el-drawer__body{
            height: calc(100% - 30px);
            .member-wrap{
                height: 100%;
            }
        }


        .member-wrap{
            padding: 0 20px;
            &>.el-button{
                margin-bottom: 20px;
            }
        }
        .member-list{
            padding-bottom: 50px;
        }
        .member{
            margin-bottom: 10px;

            padding: 5px 10px;
            .image-name{
                width: 200px;
                float: left;
            }
            .role-list{
                width: 250px;
                float: left;
                color: #999;
                line-height: 25px;
                display: flex;
                align-items: center;

                .el-tag{
                    margin-right: 5px;
                }
            }
            .avatar{
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: inline-block;
                margin-right: 10px;
            }
            .name{
                display: inline-block;
                line-height: 25px;
                vertical-align: top;
                .nickname{
                    color: #999;
                    font-size: 13px;
                }
            }

            .del-btn{
                float: right;
                p{
                    line-height: 25px;
                }
            }
        }
    }
</style>