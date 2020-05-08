import { placeTypeList, placeFavorite, placeDetail } from '@/api/place';

//查询所有场所类型
export const getPlaceTypeList = {
    data(){
        return {
            placeTypeData: []
        } 
    },
    created() {
        placeTypeList().then(res => {
            this.placeTypeData = res.obj;
        })
    },
}


//收藏 或 取消收藏
export const placeIsFavorite = {
    methods: {
        handleFavorite(params, resolve){
            placeFavorite(params).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('操作成功~');
                    resolve('success');
                }
            })
        }
    },
}

//获取场所详情
export const placeDetailData = {
    data(){
        return{
            resData: {}
        }
    },
    methods: {
        initDetail(resolve){
            this.loading = true;
            let data = `?id=${this.$route.params.id}&userId=${this.$store.state.user.loginData.id}`;
            placeDetail(data).then(res => {
                this.loading = false;
                if(res.code === this.$successCode){
                    this.resData = res.obj;
                    if(resolve) resolve('success');
                }
            })
        }
    }
}