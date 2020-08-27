import { gameDetail } from '@/api/game';


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
            let data = `?id=${this.$route.params.id}`;
            gameDetail(data).then(res => {
                this.loading = false;
                if(res.code === this.$successCode){
                    this.resData = res.obj;
                    if(resolve) resolve('success');
                }
            })
        }
    }
}

