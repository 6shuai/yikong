<template>
    <el-select
        @change="handleSelected"
        filterable
        clearable
        v-model="activityId"
        placeholder="请选择活动"
        style="width: 100%"
    >
        <el-option
            v-for="item in activityData"
            :key="item.id"
            :label="item.displayName"
            :value="item.id"
        >
        </el-option>

        <el-pagination
            small
            hide-on-single-page
            @current-change="handleCurrentChange"
            :page-size="Number(activityListParams.pageSize)"
            :current-page="Number(activityListParams.pageNo)"
            layout="prev, pager,next,total"
            :total="activityTotal">
        </el-pagination>

    </el-select>
</template>

<script>
import { gameActivity } from "@/api/game";

export default {
    props: ['promotionId'],
    data(){
        return{
            activityId: null,
            activityData: [],   //插播广告数据列表
            activityTotal: 0,
            activityListParams: {}
        }
    },
    created() {
        this.showAdverList();
    },
    methods: {  
        showAdverList(){
            this.activityListParams = {  
                pageNo: 1,
                pageSize: 40,
            }
            this.gameActivityList();
        },

        //游戏插播广告列表
        gameActivityList(){
            gameActivity(this.adverListParams).then(res => {
                if(res.code === this.$successCode){
                    let { list, totalRecords } = res.obj;
                    this.activityData = list;
                    this.activityTotal = totalRecords;
                }
            })
        },

        //插播广告分页
        handleCurrentChange(page){
            this.adverListParams.pageNo = page;
            this.gameActivityList();
        },

        //选择活动
        handleSelected(){
            this.$emit('selected', this.activityId);
        },

        //动态添加活动
        addActivity(data){
            this.activityData.unshift(data);
            this.activityId = data.id;
            this.handleSelected();
        }

    },
    watch: {
        promotionId(){
            this.activityId = this.promotionId;
        }
    }
}
</script>