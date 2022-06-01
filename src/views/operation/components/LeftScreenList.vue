<template>
    <div 
        class="left-screen-list" 
        :class="{ 'fold': foldList }"
        v-loading="screenLoading"
    >
        <div class="screen-content-wrap" v-show="!foldList">
            <div class="head-wrap">
                <el-dropdown 
                    v-if="!hideConfig" 
                    class="head-left-icon" 
                    placement="bottom-start"
                    @command="handleCommand"
                >
                    <span class="el-dropdown-link">
                        <i class="el-icon-s-operation"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>配置内容组</el-dropdown-item>
                        <el-dropdown-item command="/operation/screenLayout">配置屏幕布局</el-dropdown-item>
                        <el-dropdown-item command="/operation/lockPosition">配置屏幕时长</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-input 
                    clearable
                    prefix-icon="el-icon-search"
                    size="small"
                    v-model="searchParams.displayName"
                    @input="$debounce(getScreenList)"
                ></el-input>
            </div>
            <!-- <div class="screen-list-tab">
                <span 
                    v-for="(item, index) in [{ id: 1, name: '按城市' }, { id: 2, name: '按屏幕比例' }]"
                    :key="index"
                    :class="{ 'active': searchParams.groupType == item.id }"
                    @click="searchParams.groupType = item.id; getScreenList()"
                >{{ item.name }}</span>
            </div> -->
            <el-scrollbar class="screen-list hidden-scroll-x">
                <div 
                    class="screen-group-wrap"
                    v-for="(group, groupName, index) in screenData"
                    :key="index"
                >
                    <div class="group-title flex-between-center" @click="handleToggleHide(index)">
                        <span>{{ groupName }} ({{ group.length }})</span>
                        <span :class="hideListIndex.includes(index) ? 'el-icon-arrow-right' : 'el-icon-arrow-down'"></span>
                    </div>
                    <ul :class="{ 'hide-list': hideListIndex.includes(index) }">
                        <li 
                            v-for="item in group" 
                            :key="item.id"
                            :class="{ 'active': screenId == item.id }"
                            :title="item.displayName + (item.location ? `(${item.location})` : '')"
                            @click="handleClickScreen(item)"
                        >
                            <span class="title overflow">{{ item.displayName }} {{ item.location ? `(${item.location})` : '' }}</span>
                            <span v-if="groupName!='收藏'" class="collection" @click="handleFavorite(item)"><i :class="item.isFavorite ? 'el-icon-star-on' : 'el-icon-star-off'"></i></span>
                        </li>
                    </ul>
                </div>
            </el-scrollbar>
            <div class="toggel-fold-list" @click="foldList = !foldList">
                <a href="javascript:;"><i class="el-icon-arrow-left"></i>点击折叠商场列表</a>
            </div>
        </div>
        <div v-show="foldList" class="fold-list">
            <a href="javascript:;" @click="foldList = !foldList">
                <span>点击展开商场列表<i class="el-icon-arrow-right"></i></span>
            </a>
        </div>
    </div>
</template>

<script>
import { getScreenGoupList } from '@/api/contentManage'
import { screenFavorite } from '@/api/screen'

export default {
    props: {
        hideConfig: Boolean
    },
    data() {
        return {
            // 折叠组index
            hideListIndex: [],

            // 折叠商场列表
            foldList: false,

            // 屏幕列表
            screenData: {},

            // 筛选参数
            searchParams: {},

            // 屏幕列表数据加载中
            screenLoading: false,

            // 选中的屏幕id
            screenId: null,
        }
    },
    mounted() {
        this.getScreenList()
    },
    methods: {
        getScreenList(){
            this.screenLoading = true
            getScreenGoupList(this.searchParams).then(res => {
                this.screenLoading = false
                this.screenData = res.obj
            })
        },

        // 收藏或取消收藏
        handleFavorite({ isFavorite, id }){
            let data = {
                isFavorite: isFavorite ? 0 : 1,
                screenId: id,
                userId: this.$store.state.user.loginData.id,
            };
            let s = `?isFavorite=${data.isFavorite}&screenId=${data.screenId}&userId=${data.userId}`
            screenFavorite(s).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('操作成功~')
                    this.getScreenList()
                }
            })
        },

        // 折叠大屏列表
        handleToggleHide(index){
            if(this.hideListIndex.includes(index)){
                this.hideListIndex.splice(this.hideListIndex.indexOf(index), 1)
            }else{
                this.hideListIndex.push(index)
            }
        },

        // 点击大屏列表
        handleClickScreen(data){
            this.screenId = data.id
            this.$emit('currentScreenId', data)
        },

        // 下拉菜单跳转对应页
        handleCommand(path){
            this.$router.push(path)
        },
    }
}
</script>

<style lang="scss">
    $bgColor: #F3F4F6;

    .content-manage-wrap{
        display: flex;
        height: calc(100vh - 40px);
        background: #fff;

        .left-screen-list{
            width: 240px;
            background: $bgColor;

            &.fold{
                width: 36px;

                .fold-list {
                    height: 100%;
                    a{
                        padding: 10px;
                        height: 100%;
                        display: flex;
                        align-items: center;
                    }
                } 
            }

            .head-wrap{
                padding: 12px;
                display: flex;
                align-items: center;
                
                .head-left-icon{
                    font-size: 18px;
                    margin-right: 12px;
                    cursor: pointer;
                }

                .el-input{
                    flex: 1;
                }
            }

            .screen-list-tab{
                margin: 6px 12px;
                height: 27px;
                line-height: 27px;
                display: flex;
                border: 1px solid #6B7280;
                border-radius: 3px;
                
                span{
                    flex: 1;
                    font-size: 12px;
                    color: #6B7280;
                    text-align: center;
                    cursor: pointer;

                    &:first-child{
                        border-right: 1px solid #6B7280;
                    }

                    &.active{
                        background: #6B7280;
                        color: #fff
                    }
                }
            }

            .screen-list{
                height: calc(100vh - 125px);

                .screen-group-wrap{
                    .group-title{
                        font-size: 12px;
                        line-height: 15px;
                        color: #374151;
                        padding: 12px;
                        cursor: pointer;
                    }

                    .hide-list{
                        height: 0;
                        overflow: hidden;
                    }

                    li{
                        padding: 0 18px;
                        line-height: 36px;
                        color: #111827;
                        cursor: pointer;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        display: flex;
                        align-items: center;

                        &.active{
                            background: var(--color-primary);
                            color: #fff;

                            &:hover{
                                background: var(--color-primary);
                            }
                        }


                        .title{
                            flex: 1;
                        }

                        .collection{
                            width: 30px;
                            text-align: right;
                            font-size: 20px;
                            
                            .el-icon-star-on{
                                color: #e6a23c;
                            }
                            
                            .el-icon-star-off{
                                display: none;
                            }
                        }
                        
                        &:hover{
                            background: rgba(17, 24, 39, 0.1);

                            .el-icon-star-off{
                                display: block;
                            }
                        }
                    }
                }
            }

            .toggel-fold-list, .fold-list{
                font-size: 12px;
                line-height: 29px;
                text-align: center;
                color: #9CA3AF;

                &:hover{
                    color: var(--color-primary)
                }
            }
        }
    }
</style>