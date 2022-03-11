<!--
 * @Author: liushuai
 * @Date: 2022-03-01 15:02:50
 * @LastEditors: liushuai
 * @LastEditTime: 2022-03-01 15:19:55
 * @Description: file content
 * @FilePath: \pclient\src\views\screenLayout\components\ScreenLayoutTemplateList.vue
-->
<template>
    <ul class="temp-list clearfix" v-loading="tempLoading">
        <li 
            v-for="(item, index) in tempList" 
            :key="index"
            :class="{active: item.id==tempId}"
            @click="handleSelected(item)"
            :title="item.displayName"
        >
            <div class="layout-warp">
                <div 
                    class="temp-layout"
                    :style="{
                        width: item.height > item.width ? item.width / item.height * 100 + 'px' : '100px',
                        height: item.height > item.width ? '100px' : item.height / item.width * 100 + 'px'
                    }"
                >
                    <div 
                        class="item" 
                        v-for="sub in item.logicRegionSubs" 
                        :key="sub.id"
                        :style="{
                            width: sub.percentageWidth + '%',
                            height: sub.percentageHeight + '%',
                            top: sub.percentageY + '%',
                            left: sub.percentageX + '%'
                        }"
                    ></div>
                </div>
            </div>
            <div class="title">{{item.displayName}}</div>
        </li>
        <li 
            class="created-temp"
            @click="$router.push('/screen/layout/add')"
        >   
            <i class="el-icon-right"></i>
            <p>去创建布局模板</p>
        </li>
    </ul>
</template>

<script>
import { timelineStageTempList } from '@/api/timeline'
import { projectScreenLayoutTempList } from '@/api/project'

export default {
    data() {
        return {
            tempLoading: false,
            tempList: [],
            tempId: null
        }
    },
    methods: {
        // 获取模板列表
        getScreenTemplateList(source){
            this.tempId = null
            this.tempLoading = true

            let getScreenTempApi = timelineStageTempList
            if(source === 'project') getScreenTempApi = projectScreenLayoutTempList

            getScreenTempApi().then(res => {
                this.tempLoading = false
                if(res.code === this.$successCode){
                    this.tempList = res.obj
                }
            })
        },  

        //选择模板
        handleSelected(data){
            this.tempId = data.id
            let timelineRegions = []

            data.logicRegionSubs.forEach((item, index) => {
                timelineRegions.push({
                    regionSubId: item.id
                })
            })

            this.$emit('layoutTemplateSelected', timelineRegions, data)
        }
    }
}
</script>

<style lang="scss" scoped>
    .temp-list{
        display: flex;
        flex-wrap: nowrap;
        li{
            margin-right: 10px;
            margin-bottom: 20px;
            width: 120px;
            height: 140px;
            padding: 10px;
            text-align: center;
            border: 1px solid #e5e5e5;
            border-radius: 4px;
            cursor: pointer;

            &.created-temp{
                color: #fc5185;
                i{
                    font-size: 22px;
                }
            }

            &:hover{
                border-color: #6a2c70;
            }

            &.active{
                border-color: #6a2c70;
            }

            .layout-warp{
                width: 100px;
                height: 100px;
                .temp-layout{
                    display: block;
                    height: 100px;
                    position: relative;
                    border: 1px solid #ffdc93;
                    margin: 0 auto;
                    .item{
                        position: absolute;
                        border: 1px solid #ff2e63;
                    }
                }
            }

            .title{
                line-height: 20px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
</style>