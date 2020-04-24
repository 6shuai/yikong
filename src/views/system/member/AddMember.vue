<template>
    <!-- 添加成员 -->
    <el-dialog
        title="添加成员"
        :visible.sync="addMemberDialog"
        width="520px">
        <el-input 
            placeholder="请输入用户名" 
            @change="searchMemberChange" 
            v-model="keyword" 
            class="input-with-select" 
            style="width:380px"
        ></el-input>
        <el-button 
            type="primary" 
            :loading="searchLoading" 
            icon="el-icon-search"
            @click="searchMemberChange"
        >   
            搜索
        </el-button>
        <div v-loading="loadingSearchMember" class="search-result-wrap">
            <div v-if="searchMemberList.length">
                <ul class="search-member-list">
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
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addMemberDialog=false">关 闭</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { memberSearch, memberCreated } from '@/api/user';
export default {
    data(){
        return {
            searchLoading: false,        //搜索按钮  loaidng
            keyword: '',                 //搜索用户名
            addMemberDialog: false,      //添加用户 modal  
            searchMemberList: [],        //搜索返回的用户列表 
            loadingSearchMember: false,  //搜索  loading
            groupData: {},               //组织信息
        }
    },
    methods: {
        //搜索用户
        searchMemberChange(){
            if(!this.keyword){
                this.$message.warning('搜索不能为空~');
                return
            }
            this.loadingSearchMember = true;
            this.searchLoading = true;
            memberSearch(this.keyword).then(res => {
                this.loadingSearchMember = false;
                this.searchLoading = false;
                if(res.code === this.$successCode){
                    this.searchMemberList = res.obj;
                    if(!this.searchMemberList.length) this.$message.warning('暂无数据~');
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
                    this.$parent.init();
                }
            })
        },
    },
}
</script>
<style lang="scss">
    .search-result-wrap{
        min-height: 50px;
    }
</style>