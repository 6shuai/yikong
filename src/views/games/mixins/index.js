import { gameDetail } from '@/api/game';


//获取屏幕详情
export const getScreenDetail = {
    data(){
        return{
            resData: {}
        }
    },
    methods: {
        initDetail(){
            return new Promise((resolve) => {
                this.loading = true;
                let data = `?id=${this.$route.params.id}`;
                gameDetail(data).then(res => {
                    this.loading = false;
                    if(res.code === this.$successCode){
                        this.resData = res.obj;
                        this.$store.dispatch('game/setGameDetail', this.resData);
                        resolve('success');
                    }
                })
            })
        }
    }
}

