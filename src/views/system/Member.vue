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
            <el-table-column label="头像" min-width="70">
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
                    <el-tag v-for="(item, index) in scope.row.roles" :key="index+item.name" size="mini">{{item.displayName}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                min-width="180">
                <template slot-scope="scope">
                    <el-button 
                        size="mini"
                        type="success"
                    >
                        编辑
                    </el-button>
                    <el-popover
                        style="margin-left:10px"
                        placement="top"
                        :ref="scope.row.id"
                        width="200">
                        <p>此操作将永久删除此用户【{{scope.row.nickname}}】, 是否继续?</p>
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

        <!-- 添加用户 -->
        <el-dialog
            title="新增用户"
            :visible.sync="addMemberDialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            width="850px">
            <el-form 
                label-width="80px"
            >
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="登录名">
                            <el-input v-model="addParams.displayName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="昵称">
                            <el-input v-model="addParams.displayName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="email">
                            <el-input v-model="addParams.displayName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="手机号">
                            <el-input v-model="addParams.displayName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="QQ">
                            <el-input v-model="addParams.displayName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="微信">
                            <el-input v-model="addParams.displayName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="组织">
                            <template slot-scope="scope">
                                <el-select v-model="addParams.group" placeholder="请选择组织" style="width:100%">
                                    <el-option value="1" label="组织1"></el-option>
                                    <el-option value="2" label="组织2"></el-option>
                                </el-select>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="角色">
                            <template slot-scope="scope">
                                <el-select v-model="addParams.roleArry" multiple placeholder="请选择角色" style="width:100%">
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
                <el-button @click="addMemberDialog=false">取 消</el-button>
                <el-button type="primary" :loading="addBtnLoading" @click="addMemeberSureBtn">确 定</el-button>
            </span>
        </el-dialog>

    </el-card>
</template>

<script>
import { groupMemberList, getAllRoleList } from '@/api/user';
export default {
    data(){
        return {
            resData: [],
            tLoading: false,
            addMemberDialog: false,      //添加用户 modal   
            addParams: {},               //添加用户 参数
            roleData: [],                //角色列表
            addBtnLoading: false,
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

        //删除用户
        delCurrentMember(){

        },

        //添加用户
        addMemeberSureBtn(){
            
        },


        //所有角色列表
        roleList(){
            getAllRoleList().then(res => {
                if(res.code === this.$successCode){
                    this.roleData = res.obj;
                }
            })
        }
    },
}
</script>