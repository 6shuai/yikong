<template>
    <div 
        class="app-main-wrap price-system-wrap"
        v-loading="loading"
    >
        <el-card
            v-for="(item, index) in resData"
            :key="index"
            @click.native="$router.push(`/priceSystem/${item.id}`)"
        >
            <p>{{ item.displayName }}</p>
            <p class="desc">{{ item.description }}</p>
        </el-card>

    </div>
</template>

<script>
import { getPriceTypeList } from '@/api/common'

export default {
    data(){
        return {
            loading: false,
            resData: []
        }
    },
    mounted() {
        let p = this.$store.state.user.priceTypeData
        if(p.length){
            this.resData = p
            return
        }
        this.loading = true
        getPriceTypeList().then(res => {
            this.loading = false
            if(res.code === this.$successCode){
                this.resData = res.obj
                this.$store.state.user.priceTypeData = res.obj
            }
        })   
    }
}

</script>

<style lang="scss" scoped>
    .price-system-wrap{
        
        .el-card{
            width: 250px;
            cursor: pointer;
            display: inline-block;
            margin-right: 20px;
        }
        .desc{
            font-size: 13px;
            color: #999;
            padding-top: 10px;
        }
    }
</style>