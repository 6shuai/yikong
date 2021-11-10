<!--
 * @Author: liushuai
 * @Date: 2021-01-22 17:21:40
 * @LastEditors: liushuai
 * @LastEditTime: 2021-11-10 11:02:59
 * @Description: file content
 * @FilePath: \pclient\src\views\games\components\AdverList.vue
-->
<template>
    <el-select
        @change="changeSelectAdver"
        filterable
        clearable
        v-model="adverId"
        placeholder="请选择需要插播的广告"
        style="width: 100%"
    >
        <el-option
            v-for="item in adverData"
            :key="item.id"
            :label="item.displayName"
            :value="item.id"
        >
        </el-option>
        
        <el-pagination
            small
            hide-on-single-page
            @current-change="handleCurrentChange"
            :page-size="Number(adverListParams.pageSize)"
            :current-page="Number(adverListParams.pageNo)"
            layout="prev, pager,next,total"
            :total="adverTotal">
        </el-pagination>

    </el-select>
</template>

<script>
import { gameCutInAdver } from "@/api/game";

export default {
    props: ['spotId'],
    data(){
        return{
            adverId: null,
            adverData: [],   //插播广告数据列表
            adverTotal: 0,
            adverListParams: {}
        }
    },
    created() {
        this.showAdverList();
    },
    methods: {  
        showAdverList(){
            this.adverListParams = {  
                pageNo: 1,
                pageSize: 40,
            }
            this.gameCutInAdverList();
        },

        //游戏插播广告列表
        gameCutInAdverList(){
            gameCutInAdver(this.adverListParams).then(res => {
                if(res.code === this.$successCode){
                    let { list, totalRecords } = res.obj;
                    this.adverData = list;
                    this.adverTotal = totalRecords;
                }
            })
        },

        //插播广告分页
        handleCurrentChange(page){
            this.adverListParams.pageNo = page;
            this.gameCutInAdverList();
        },

        //选择插播广告
        changeSelectAdver(){
            this.$emit('selected', this.adverId);
        },

        //动态添加广告列表
        addCutinAdver(data){
            this.adverData.unshift(data);
            this.adverId = data.id;
            this.changeSelectAdver();
        }
        
    },
    watch: {
        spotId(){
            this.adverId = this.spotId;
        }
    }
}
</script>