<template>
<!-- 导入时间轴 -->
    <el-dialog
        width="500px"
        title="选择要导入的时间轴"
        :visible.sync="showImportList"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="showImportList=false"
        append-to-body>
        <div class="clearfix import-timeline-list timeline-wrap"  v-loading="dataLoading">
            <el-input size="small" placeholder="时间轴名称" clearable v-model="params.name" @input="init"></el-input>
            <el-card class="box-card timeline-list" :body-style="{ padding: '0px' }" v-for="(item, index) in resData" :key="index">
                <div class="timeline-info">
                    <div class="title">{{item.displayName}}</div>
                    <div class="import add-btn" v-if="!item.hide" @click="hadleImport(item.id)"><i class="el-icon-download"></i>导入</div>
                </div>
            </el-card>
        </div>

        <span slot="footer" class="dialog-footer">
            <el-button @click="showImportList=false">取  消</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { timelineContainerList, copyTimelineContainer } from '@/api/timeline';
export default {
    inject: ["reload"],
    data(){
        return{
            showImportList: false,
            dataLoading: false,
            resData: [],
            params: {
                pageNo: 1,
                pageSize: 999999
            }
        }
    },
    methods: {
        //加载时间轴列表
        init(){
            this.showImportList = true;
            this.dataLoading = true;
            timelineContainerList(this.params).then(res => {
                this.dataLoading = false;
                if(res.code === this.$successCode){
                    this.resData = res.obj.list;
                }
            })
        },

        //选中时间轴导入
        hadleImport(id){
            //id     当前时间轴容器ID
            //copyId  被复制时间轴容器ID
            let data = `?id=${this.$route.params.id}&copyId=${id}`;
            copyTimelineContainer(data).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('时间轴导入成功~');
                    this.reload(); //刷新页面
                }
            })
        }

    }
}
</script>

<style lang="scss" scope>
    @import '../../../styles/variables.scss';
    .import-timeline-list{
        &.timeline-wrap{
            height: 100%;
            .timeline-list{
                width: 100%;
                height: 50px;
                line-height: 50px;
                margin: 10px 0;
                cursor: pointer;
                .timeline-info{
                    display: flex;
                    .title{
                        padding: 0 10px;
                        flex: 1;
                    }
                    .import{
                        float: right;
                        width: 80px;
                        color: $--color-primary;
                        &:hover{
                            color: $--color-danger;
                            text-decoration: underline;
                        }
                    }
                }
            }
            .no-data{
                line-height: 40px;
                text-align: center;
            }
        }

    }
</style>