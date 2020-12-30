import { activityDetail } from '@/api/activity';


//获取屏幕详情
export const getActivityDetail = {
    data(){
        return {
            loading: false,
            resData: {}
        }
    },
    methods: {
        initDetail(){
            return new Promise((resolve) => {
                this.loading = true;
                let data = { id: this.$route.params.id };
                activityDetail(data).then(res => {
                    this.loading = false;
                    if(res.code === this.$successCode){
                        this.resData = res.obj;
                        resolve('success');
                    }
                })
            })
        }
    }
}

