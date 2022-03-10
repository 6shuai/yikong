//时间戳 转成 时间格式
export const timeDisposeTool = {
    methods: {
        formatTime(timestamp, type){
            var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + '-';
            var M = this.addZero(date.getMonth()+1) + '-';
            var D = this.addZero(date.getDate()) + ' ';
            var h = this.addZero(date.getHours()) + ':';
            var m = this.addZero(date.getMinutes()) + ':';
            var s = this.addZero(date.getSeconds());
            if(type == 'time'){
                return h + m + s;
            }else{  
                return Y + M + D + h + m + s
            }
        },

        //低于10 前面加0
        addZero(data){
            return data < 10 ? '0' + data : data
        }
    },
}

// 监控元素宽高
export const screenSizeWatch = {
    data(){
        return {
            placeW: '25%',                      //卡片宽度
            cardWidth: null,
            imageH: 170,                        //卡片 图片高度
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
            
            //获取浏览器滚动条宽度  浏览器可用宽度 -  body的宽度
            let scrollWidth = window.innerWidth - document.body.clientWidth;
            width = width + scrollWidth;

            if(width >= 1600){
                _this.placeW = '20%';
                _this.imageH = parseInt((width / 5) / 1.7);
            }else if(width >= 1200){
                _this.placeW = '25%';
                _this.imageH = parseInt((width / 4) / 1.7);
            }else if(width >= 840){
                _this.placeW = '33.3%';
                _this.imageH = parseInt((width / 3) / 1.7);
            }else if(width >= 580){
                _this.placeW = '50%';
                _this.imageH = parseInt((width / 2) / 1.7);
            }else {
                _this.placeW = '100%';
                _this.imageH = parseInt((width / 1) / 1.7);
            }
            _this.cardWidth = Number(_this.placeW.split('%')[0]) / 100 * width - 20
        });
    },
}

/**
 * 用于递归判断两个对象是否一致，以区分是否修改
 * @param {*} oldObj 
 * @param {*} newObj 
 * 返回false：不相等
 */
export const objsDifferMethod = {
    data(){
        return {
            oldParams: {}, 
            diffStatus: true        
        }
    },
    methods: {
        objsDiffer(oldObj, newObj){
            var aProps = Object.getOwnPropertyNames(oldObj);
            var bProps = Object.getOwnPropertyNames(newObj);
            //判断属性名的length是否一致
            if (aProps.length != bProps.length) {
                this.diffStatus = false;
            }
            //循环取出属性名，再判断属性值是否一致
            for (var i = 0; i < aProps.length; i++) {
                var propName = aProps[i];
                
                if ( oldObj[propName] instanceof Array && newObj[propName] instanceof Array ) {
                    if( oldObj[propName].length != newObj[propName].length ){
                        this.diffStatus = false
                    }else{
                        for(var j = 0; j < oldObj[propName].length; j++){
                            this.objsDiffer(oldObj[propName][j], newObj[propName][j]);
                        }
                    }
                }else if (propName !== '__ob__' && oldObj[propName] !== newObj[propName]) {
                    this.diffStatus = false;
                }
            }
            return this.diffStatus;
        }
        
    }
}


// 获取所有品牌(组织)列表 
import { organizationList, organizationType } from '@/api/user';
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



//上传图片获取图片信息 宽高 大小
export const getUploadImgInfo = {
    methods: {
        imageInfo(file, data, resolve){
            // 创建对象
            var img = new Image();
            img.src = data.path;
            img.onload = () => {
                let imgInfo = {
                    width: img.width,
                    height: img.height,
                    size: file.size,
                    contentPath: data.path,
                    ciphertext: data.ciphertext
                }
                resolve(imgInfo);
            };
        },
    },
}


//组织类型 列表
//获取组织类型   新建组织 commonType： 0
export const getOrganizationTypeList = {
    data(){
        return{
            groupTypeList: []
        }
    },
    methods: {
        getGroupType(type=0){
            organizationType(type).then(res => {
                if(res.code === this.$successCode){
                    // 新建组织的时候，前端列出的可选组织类型，不包含组织外类型，就是说组织类型数据的commonType: true的数据不列出。
                    if(type == null){
                        this.groupTypeList = res.obj;
                        return
                    }
                    this.groupTypeList = res.obj.filter(item => {
                        return !item.commonType
                    })
                }
            })
        }
    }
}