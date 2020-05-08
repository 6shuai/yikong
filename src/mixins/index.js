// 监控元素宽高
export const screenSizeWatch = {
    data(){
        return {
            placeW: '25%',                      //卡片宽度
        }
    },
    mounted() {
        let _this = this;
        let elementResizeDetectorMaker = require("element-resize-detector");
        // 创建实例
        let erd = elementResizeDetectorMaker();
        // 创建实例带参
        let erdUltraFast = elementResizeDetectorMaker({
            strategy: "scroll", //<- For ultra performance.
            callOnAdd: true,
            debug: true
        });
        //监听id为test的元素 大小变化
        erd.listenTo(document.getElementById("app-main-wrap"), function(element) {
            let width = element.offsetWidth;
            if(width > 1400){
                _this.placeW = '20%';
            }else if(width > 1150){
                _this.placeW = '25%';
            }else if(width > 840){
                _this.placeW = '33.3%';
            }else if(width > 560){
                _this.placeW = '50%';
            }else {
                _this.placeW = '100%';
            }
        });
    },
}

// 获取所有品牌(组织)列表 
import { organizationList } from '@/api/user';
export const getOrganizationList = {
    data(){
        return {
            groupData: []
        }
    },
    created() {
        organizationList().then(res =>{
            this.groupData = res.obj;
        })
    },
}


// 查询品牌组织下 的用户列表
import { placeGroupUserList } from '@/api/place';
export const getOrganizationUserList = {
    data(){
        return {
            userData: []  
        }
    },
    methods: {
        groupUserList(id){
            placeGroupUserList(id).then(res =>{
                this.userData = res.obj;
            })
        }
    },
}
