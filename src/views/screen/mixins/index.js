import { screenDotPitchList, screenAspectRatioList, screenDetail, screenFavorite } from '@/api/screen';

//获取所有点距规格数据
export const getDotPitch = {
    data(){
        return {
            dotpitchData: []
        } 
    },
    created() {
        screenDotPitchList().then(res => {
            this.dotpitchData = res.obj;
        })
    },
}

//获取所有宽高比
export const getAspectRatio = {
    data(){
        return {
            aspectRatioData: []
        } 
    },
    created() {
        screenAspectRatioList().then(res => {
            this.aspectRatioData = res.obj;
        })
    },
}

//获取屏幕详情
export const getScreenDetail = {
    data(){
        return{
            resData: {}
        }
    },
    methods: {
        initDetail(resolve){
            this.loading = true;
            if(!this.$route.params.id) return
            let data = `?id=${this.$route.params.id}&userId=${this.$store.state.user.loginData.id}`;
            screenDetail(data).then(res => {
                this.loading = false;
                if(res.code === this.$successCode){
                    this.resData = res.obj;
                    if(resolve) resolve('success');
                }
            })
        }
    }
}

//收藏 或 取消收藏
export const screenIsFavorite = {
    methods: {
        handleFavorite(params, resolve){
            screenFavorite(params).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('操作成功~');
                    resolve('success');
                }
            })
        }
    },
}