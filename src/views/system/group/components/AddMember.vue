<template>
    <!-- 添加成员 -->
    <el-dialog
        title="添加成员"
        :append-to-body="true"
        :visible.sync="addMemberDialog"
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
                        <span class="add-wrap"></span>
                    </li>
                    <li v-for="(item, index) in memberList" :key="item.id">
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
export default {
    data(){
        return {
            searchLoading: false,        //搜索按钮  loaidng
            keyword: '',                 //搜索用户名
            addMemberDialog: false,      
            memberList: [],               //用户列表 
            loadingSearchMember: false,  //搜索  loading
        }
    },
    methods: {
        showAddMemberDialog(){
            this.addMemberDialog = true;
        },
        
        //搜索用户
        searchMemberChange(){

        },

        //添加用户到群
        addCurrentMember(id, index){
            
        },
    },
}
</script>
<style lang="scss">
    .search-result-wrap{
        min-height: 50px;
    }
</style>