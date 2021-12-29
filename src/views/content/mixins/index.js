import { contentFavorite, contentDetail, contentPlaceList } from '@/api/content'
import store from '@/store/index'

//收藏 或 取消收藏
export const contentIsFavorite = {
    methods: {
        handleFavorite(params, resolve){
            contentFavorite(params).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('操作成功~');
                    resolve('success');
                }
            })
        }
    },
}

//获取场所列表
export const contentPlaceData = {
    data(){
        return {
            placeData: []
        }
    },
    mounted() {
        let data = store.state.user.placeData
        if(data && data.length){
            this.placeData = data
            return
        }
        contentPlaceList().then(res => {
            this.placeData = res.obj
            store.state.user.placeData = res.obj
        })
    }
}

//获取内容详情
export const contentDetailData = {
    data(){
        return{
            resData: {}
        }
    },
    methods: {
        initDetail(resolve){
            this.loading = true;
            let data = `?id=${this.$route.params.id}&userId=${this.$store.state.user.loginData.id}`;
            contentDetail(data).then(res => {
                this.loading = false;
                if(res.code === this.$successCode){
                    this.resData = res.obj;
                    if(resolve) resolve('success');
                }
            })
        }
    }
}