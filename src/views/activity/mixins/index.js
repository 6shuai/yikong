import { activityDetail, activityCouponDetail } from '@/api/activity';


//获取活动详情
export const getActivityDetail = {
    data(){
        return {
            loading: false,
            resData: {}
        }
    },
    methods: {
        initDetail(id){
            return new Promise((resolve) => {
                this.loading = true;
                let data = { id };
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

//获取优惠券详情
export const getCouponDetail = {
    data(){
        return {
            loading: false,
            resData: {}
        }
    },
    methods: {
        initDetail(id){
            return new Promise((resolve) => {
                this.loading = true;
                let data = { id };
                activityCouponDetail(data).then(res => {
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