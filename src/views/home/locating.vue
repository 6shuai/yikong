<template>
    <div class="locating-wrap">
        <div class="screen-list">
            <el-form 
                label-width="80px"
            >
                <el-form-item label="屏幕名称" prop="displayName">
                    <el-input 
                        class="w220" 
                        size="small" 
                        clearable 
                        placeholder="屏幕名称" 
                        v-model="searchParams.displayName" 
                        @input="$debounce(searchScreen)"
                    ></el-input>
                </el-form-item>
                <el-form-item label="选择地区" prop="displayName">
                    <select-region 
                        @selectArea="searchParams={...searchParams, ...$event};searchScreen()"
                    ></select-region>
                </el-form-item>
            </el-form>

            <div class="list">
                <el-scrollbar>
                    <el-card class="item" v-for="item in 20">
                        <i class="el-icon-plus"></i>
                        北京通州万达
                    </el-card>
                </el-scrollbar>
            </div>

        </div>

        <!-- 选中的屏幕列表 -->
        <div class="selected-screen-list">
            <h3>请从左侧列表选择需要寻位的屏幕</h3>

            <div class="form-screen">
                <ul class="item" v-for="item in 6">
                    <li class="title">
                        北京通州万达
                    </li>
                    <li>
                        <span class="label">物料时长</span>
                        <span class="value">
                            <el-input-number 
                                class="w200"
                                :controls="false"
                                v-model="addParams.duration" 
                                :min="0"
                            ></el-input-number>
                        </span>
                    </li>
                    <li>
                        <span class="label">每日播放次数</span>
                        <span class="value">
                            <el-input-number 
                                class="w200"
                                :controls="false"
                                v-model="addParams.duration" 
                                :min="0"
                            ></el-input-number>
                        </span>
                    </li>
                    <li>
                        <span class="label">开始日期</span>
                        <span class="value">
                            <el-input-number 
                                class="w200"
                                :controls="false"
                                v-model="addParams.duration" 
                                :min="0"
                            ></el-input-number>
                        </span>
                    </li>
                    <li>
                        <span class="label">结束日期</span>
                        <span class="value">
                            <el-input-number 
                                class="w200"
                                :controls="false"
                                v-model="addParams.duration" 
                                :min="0"
                            ></el-input-number>
                        </span>
                    </li>
                    <li>
                        <span class="label">数量</span>
                        <span class="value">
                            <el-input-number 
                                class="w200"
                                :controls="false"
                                v-model="addParams.duration" 
                                :min="0"
                            ></el-input-number>
                        </span>
                    </li>
                </ul>
            </div>

        </div>

    </div>
</template>

<script>
import SelectRegion from '@/components/SelectRegion/index';
export default {
    components: {
        SelectRegion
    },
    data(){
        return {
            searchParams: {},

            // 选中的屏幕
            selectedScreen: [],
            addParams: {}
        }
    },
    methods: {
        // 搜索屏幕
        searchScreen(){

        }
    }
}
</script>

<style lang="scss">
    .locating-wrap{
        height: calc(100vh - 280px);
        display: flex;

        .el-scrollbar{
            height: 100%;

            .el-scrollbar__wrap{
                overflow-x: hidden;
            }
        }

        .screen-list{
            flex: 1;
            border-right: 1px solid #e5e5e5;

            .list{
                height: calc(100% - 150px);

                .item{
                    margin-bottom: 20px;
                    margin-right: 20px;
                    cursor: pointer;

                    i{
                        margin-right: 10px;
                    }

                    &:hover{
                        box-shadow: 0 2px 12px 0 rgba(241, 2, 2, 0.3);
                    }
                }
            }
        }

        .selected-screen-list{
            flex: 1;
            margin: 0 20px;

            .form-screen{
                display: flex;
                flex-wrap: wrap;
            }


            h3{
                text-align: center;
            }

            .item{
                display: inline-block;
                border: 1px solid #e5e5e5;
                border-radius: 6px;
                padding: 10px;
                margin: 20px;
                li{
                    margin-bottom: 10px;

                    &.title{
                        text-align: center;
                        font-weight: bold;
                    }
                    
                    span{
                        display: inline-block;

                        &.label{
                            width: 95px;
                            text-align: right;
                            padding-right: 10px;
                            font-size: 13px;
                        }
                    }
                }
            }
        }
    }
</style>