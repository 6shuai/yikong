<template>
    <el-dialog title="选择内容" width="1000px" :visible.sync="showContentList" class="atlas-content-list">
        <div class="search-wrap">
            <el-input 
                prefix-icon="el-icon-search" 
                clearable
                v-model="params.displayName" 
                placeholder="内容名称"
            ></el-input>
            <el-select v-model="params.contentType" clearable placeholder="请选择内容类型">
                <el-option 
                    v-for="item in typeList" 
                    :key="item.id"
                    :label="item.displayName" 
                    :value="item.id">
                </el-option>
            </el-select>
            <el-button type="primary" @click="params.pageNo=1;init()">搜索</el-button>
        </div>
        <div class="content-wrap" v-loading="loading">
            <div 
                v-for="(item, index) in resData" 
                :key="index" 
                class="content-list" 
                @click="item.selected = !item.selected; $set(resData, index, item)"
            >
                <i v-if="item.selected" class="el-icon-success"></i>
                <el-image 
                    fit="cover" 
                    class="img" 
                    :src="item.image"
                ></el-image>
                <div class="desc">
                    <p class="title overflow" :title="item.displayName">{{item.displayName}}</p>
                </div>
            </div>
        </div>
        <el-pagination
            background
            layout="total, prev, pager, next, sizes"
            :page-sizes="[48, 80, 100]"
            :current-page="Number(params.pageNo)"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :total="totalCount">
        </el-pagination>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showContentList = false">取 消</el-button>
            <el-button type="primary" @click="handleSaveBtn">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { contentListPage } from '@/api/content';
export default {
    props: ['typeList'],
    data(){
        return{
            resData: [],
            showContentList: false,
            totalCount: 0,
            loading: false,
            params: {
                pageNo: 1,
                pageSize: 48,
            },
        }
    },
    created() {
        this.init();
    },
    methods: {
        init(){
            this.loading = true;
            contentListPage(this.params).then(res => {
                this.loading = false;
                if(res.code === this.$successCode){
                    this.resData = res.obj.list;
                    this.totalCount = res.obj.totalRecords;
                }
            })
        },

        //分页
        handleCurrentChange(page){
            this.params.pageNo = page;
            this.init();
        },

        //每页多少条
        handleSizeChange(size){
            this.params.pageSize = size;
            this.init();
        },

        //点击确定按钮
        handleSaveBtn(){
            let arr = [];
            this.resData.forEach((item, index) => {
                if(item.selected){
                    item.contentId = item.id;
                    delete item.selected;
                    delete item.id;
                    arr.push(item);
                }
            })
            this.showContentList = false;
            this.$emit('selectedContent', arr);
        }
    },
}
</script>

<style lang="scss" scope>
    .atlas-content-list{
        .search-wrap{
            margin-bottom: 10px;
            .el-input{
                width: 200px;
                margin-right: 10px;
            }
        }
        .content-wrap{
            display: inline-block;
            .content-list{
                width: 140px;
                margin: 0 0 10px 10px;
                float: left;
                cursor: pointer;
                border: 1px solid #eee;
                border-radius: 3px;
                box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
                background: #fff;
                position: relative;
                .el-icon-success{
                    position: absolute;
                    top: 5px;
                    left: 5px;
                    z-index: 99;
                    color: #FF4066;
                    background: #fff;
                    font-size: 22px;
                    border-radius: 50%;
                }
                img{
                    width: 140px;
                    height: 80px;
                    z-index: 99;
                }
                .desc{
                    width: 140px;
                    background: #fff;
                    .title{
                        line-height: 26px;
                        font-size: 14px;
                        padding: 0 3px;
                    }
                }
            }
        }

    }
</style>