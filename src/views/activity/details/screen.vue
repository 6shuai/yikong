<template>
    <card-list 
        emptyMsg="还没有屏幕"
        :paramsName="{image: 'screenshotUri', name: 'displayName' }"
        :resData="resData"
    ></card-list>
</template>

<script>
import CardList from '@/components/CardList';
import { activityDetailScreenList } from '@/api/activity';
export default {
    components: {
        CardList
    },
     data(){
        return {
            resData: []
        }
    },
    created(){
        this.init();
    },
    methods: {
        init(){
            activityDetailScreenList(this.$route.params.activityId).then(res => {
                if(res.code === this.$successCode){
                    this.resData = res.obj;
                }
            })
        }
    }
}
</script>
