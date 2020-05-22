import { contentFavorite, contentDetail } from '@/api/content';

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

//获取场所详情
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