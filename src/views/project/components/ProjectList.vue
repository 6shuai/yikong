<template>
    <div class="project-list-wrap">
        <div class="project-list" v-loading="listLoading">
            <div 
                class="item" 
                :style="{ width: placeW }" 
                v-for="item in resData"
                :key="item.id"
                @click="$emit('jumpPage', item)"
            >
                <el-card shadow="hover">
                    <div class="name overflow">{{ item.displayName }}</div>
                    <div class="desc" :title="item.description">{{ item.description }}</div>
                    <el-tag 
                        type="primary" 
                        plain
                        size="mini"
                        v-show="item.clientName"
                    >
                        {{ item.clientName }}
                    </el-tag>

                    <div 
                        class="edit" 
                        v-show="!hideEdit"
                        @click.stop="$emit('handleShowCreateProject', item)"
                    >
                        <i class="el-icon-edit"></i>编辑
                    </div>
                    
                </el-card>
            </div>
        </div>
        <el-empty v-if="!resData.length && !listLoading" description="暂无项目"></el-empty>

        <el-pagination
            background
            :hide-on-single-page="true"
            layout="total, prev, pager, next, sizes"
            :current-page="Number(params.pageNo)"
            :page-size="Number(params.pageSize)"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :total="totalCount">
        </el-pagination>   

    </div>
</template>

<script>
import { screenSizeWatch } from '@/mixins'

export default {
    mixins: [screenSizeWatch],
    props: {
        listLoading: Boolean,
        resData: Array,
        totalCount: Number,
        hideEdit: Boolean
    },
    data(){
        return {
            params: {
                pageNo: 1,
                pageSize: 40
            }
        }
    },
    methods: {
         // 分页
        handleCurrentChange(page){
            this.params.pageNo = page
            this.$emit('getList', this.params)
        },

        // 每页多少条
        handleSizeChange(size){
            this.params.pageSize = size
            this.$emit('getList', this.params)
        },

    }
}
</script>

<style lang="scss" scoped>
.project-list-wrap{
    
    .project-list{
        display: flex;
        flex-wrap: wrap;
        margin-left: -10px;

        .item{
            cursor: pointer;

            .el-card{
                margin: 10px;
                position: relative;

                .el-card__body{
                    padding: 0;
                    margin: 20px 20px 15px;
                }
                
                .desc{
                    font-size: 12px;
                    color: #999;
                    line-height: 14px;
                    height: 14px;
                    overflow: hidden;
                    margin: 10px 0;
                }

                .edit{
                    font-size: 14px;
                    position: absolute;
                    right: 0;
                    bottom: 0px;
                    height: 30px;
                    line-height: 30px;
                    padding: 0 20px;
                    text-align: center;
                    color: #999;
                    background: #f9fafcd1;
                    display: none;

                    &:hover{
                        color: var(--color-primary);
                    }
                }

            }

            &:hover{
                .edit{
                    display: block;
                }
            }
        }
    }
}
</style>