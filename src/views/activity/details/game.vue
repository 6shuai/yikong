<template>
    <card-list 
        emptyMsg="还没有游戏"
        :paramsName="{image: 'image', name: 'displayName' }"
        detailPath="/content/details/"
        :resData="resData"
    ></card-list>
</template>

<script>
import CardList from '@/components/CardList';
import { activityDetailGameList } from '@/api/activity';
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
            activityDetailGameList(this.$route.params.activityId).then(res => {
                if(res.code === this.$successCode){
                    this.resData = res.obj;
                }
            })
        }
    }
}
</script>
