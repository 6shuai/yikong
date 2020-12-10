<template>
    <el-drawer
        class="group-member-list"
        :show-close="true"
        title="madongdong"
        size="600px"
        :visible.sync="drawer">
        <div class="member-wrap">
            <el-button 
                size="small" 
                type="primary"
                icon="icon-plus"
                @click="$refs.addMember.showAddMemberDialog()"
            >添加成员</el-button>
            <el-scrollbar style="height: 100%;">
                <div class="member-list">
                    <el-card
                        class="box-card member clearfix"
                        :body-style="{ padding: '0px' }"
                        v-for="(item, index) in 20"
                        :key="item.id"
                    >
                        <div class="image-name">
                            <el-image fit="cover" src="https://game.xfengjing.com/app/upload/wx/ee0715e1-e905-4436-864c-62cd0480e37e.png"></el-image>
                            <div class="name">
                                <p>tiezhu</p>
                                <p class="nickname">铁柱</p>
                            </div>
                        </div>
                        <div class="info">
                            <p title="电话">
                                <span class="label"
                                    ><font-awesome-icon
                                        :icon="[
                                            'fas',
                                            'mobile-alt',
                                        ]"
                                /></span>
                                <span>{{
                                    item.mobile || "--"
                                }}</span>
                            </p>
                            <p title="微信">
                                <span class="label"
                                    ><font-awesome-icon
                                        :icon="['fab', 'weixin']"
                                /></span>
                                <span>{{
                                    item.wechat || "--"
                                }}</span>
                            </p>
                        </div>
                        <el-button class="del-btn" size="mini" type="danger">删除</el-button>
                    </el-card>
                </div>
            </el-scrollbar>

        </div>

        <!-- 添加成员 -->
        <add-member ref="addMember"></add-member>

    </el-drawer>
</template>

<script>
import AddMember from './AddMember';

export default {
    data(){
        return{
            drawer: false,
        }
    },
    methods: {
        showGroupMember(){
            this.drawer = true;
        }
    },
    components: {
        AddMember
    }
}
</script>

<style lang="scss" scope>
    .group-member-list{
        .el-drawer__body{
            height: calc(100% - 80px);
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
            .info{
                width: 250px;
                float: left;
                color: #999;
                line-height: 25px;
                .label{
                    width: 18px;
                    display: inline-block;
                    text-align: center;
                }
            }
            .el-image{
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
                }
            }

            .del-btn{
                float: right;
                margin: 10px;
            }
        }
    }
</style>