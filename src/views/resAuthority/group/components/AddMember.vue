<template>
    <!-- 添加成员 -->
    <el-dialog
        title="添加成员"
        :append-to-body="true"
        :visible.sync="addMemberDialog"
        :before-close="handleClose"
        width="520px">
        <el-input 
            placeholder="请输入用户名" 
            @input="searchMemberChange" 
            v-model="keyword" 
            clearable
            class="input-with-select w200" 
            size="small"
        ></el-input>
        <div v-loading="loadingSearchMember" class="search-result-wrap">
            <div v-if="memberList.length">
                <ul class="search-member-list">
                    <li class="s-header">
                        <span>头像</span>
                        <span>登录名</span>
                        <span>昵称</span>
                        <span class="add-wrap">添加</span>
                    </li>
                    <li v-for="(item, index) in memberList" :key="item.id">
                        <span>
                            <el-avatar class="avatar" :src="item.avatar"></el-avatar>
                        </span>
                        <span :title="item.accountName">{{item.accountName}}</span>
                        <span :title="item.nickname">{{item.nickname}}</span>
                        <span class="add-wrap">
                            <i 
                                v-if="!item.haveAdd" 
                                class="el-icon-circle-plus" 
                                title="添加此用户" 
                                @click="addCurrentMember(item.userId, index)"
                            ></i>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">关 闭</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { groupMemberList, groupAddMember } from '@/api/group';
export default {
    data(){
        return {
            searchLoading: false,        //搜索按钮  loaidng
            keyword: '',                 //搜索用户名
            addMemberDialog: false,      
            memberList: [],               //用户列表 
            loadingSearchMember: false,  //搜索  loading
            groupId: null,               //群组id
            haveAddMember: false,    
            userId: [],       
        }
    },
    methods: {
        showAddMemberDialog(id, userList){
            this.addMemberDialog = true;
            this.groupId = id;
            this.userId = [];
            userList.forEach(e => {
                this.userId.push(e.userId)
            });
            this.getMemberList();
        },

        //用户列表
        getMemberList(){
            this.loadingSearchMember = true;
            groupMemberList({ name: this.keyword }).then(res => {
                this.loadingSearchMember = false;
                if(res.code === this.$successCode){
                    this.memberList = res.obj;
                    this.memberList.forEach(item =>{
                        if(this.userId.includes(item.userId)){
                            item.haveAdd = true;
                        }
                    })
                }
            })
        },
        
        //搜索用户
        searchMemberChange(){
            this.getMemberList();
        },

        //添加用户到群
        addCurrentMember(id, index){
            let data = {
                userId: id,
                groupId: this.groupId
            }
            groupAddMember(data).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('添加成功~');
                    this.haveAddMember = true;
                    this.$set(this.memberList[index], 'haveAdd', true);
                }
            })
        },

        handleClose(){
            this.addMemberDialog = false;
            if(this.haveAddMember){
                this.$emit('addMemberSuccess');
            }
        }
    },
}
</script>
<style lang="scss">
    .search-result-wrap{
        min-height: 50px;

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
                padding: 10px 0;
                height: 70px;
                line-height: 40px;
                &:hover{
                    background: #e9f3fb;
                }
                &.s-header{
                    background: #f5f5f5;
                    &:hover{
                    background: #f5f5f5; 
                    }
                }
                &>span{
                    flex: 1;
                    padding: 0 10px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
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