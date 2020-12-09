<template>
    <div class="content-preview">
        <div 
            class="play-index" 
            v-if="data && isArray"
        >
            {{currentDataIndex+1}} / {{data.length}}
        </div>
        <video
            v-if="currentData.contentTypeId == 2" 
            :src="currentData.contentPath || currentData.image" 
            controls="controls"
            :loop="true"
            :autoplay="true" 
        >
        </video>
        <iframe 
            class="miniview-game"
            v-if="currentData.contentTypeId== 3"
            :src="currentData.contentPath"
            style="width: 100%; height: 500px;"
            frameborder="no" border="0" scrolling="no"></iframe>

        <img v-else :src="currentData.contentPath || currentData.image">
    </div>
</template>
<script>
import { contentGamePreview } from '@/api/content';
export default {
    data(){
        return{
            index: 0,
            timer: undefined,
            data: undefined,
            currentData: {},              //当前播放的内容
            currentDataIndex: 0,          //当前播放的内容 的下标
            isArray: false,               //是否为数组
        }
    },
    methods: {
        init(){
            this.currentData = this.data[this.currentDataIndex];
            this.currentData.contentTypeId = this.currentData.contentType;
            if(this.timer) clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                if(this.currentDataIndex == this.data.length-1){
                    this.currentDataIndex = 0;
                }else{
                    this.currentDataIndex += 1;
                }
                this.init();
            }, this.currentData.duration * 1000);
        },

        contentPreviewData(data, type){
            this.data = data;
            if(data.contentTypeId == 3){
                if(type != 'detail'){
                    contentGamePreview({contentId: data.id}).then(res => {
                        if(res.code === this.$successCode){
                            let { applicationPackage, screenId, assembly } = res.obj;
                            let { mobilePackage, screenPackage } = applicationPackage;
                            let { configId } = assembly;
                            this.currentData = {
                                ...this.data,
                                contentPath: screenPackage + '?screenId=' + screenId + '&mobilePackage=' + mobilePackage + '&gameRuleId=' + configId
                            }
                        }
                    })
                }else{
                    this.currentData = {
                        ...this.data,
                        contentTypeId: 1,
                        contentPath: this.data.image
                    }
                }
            }else{
                //图集资源
                if(Array.isArray(this.data)){
                    this.init();
                    this.isArray = true;
                }else{
                    this.currentData = this.data;
                }
            }
        }
    },
    beforeDestroy(){
        if(this.timer) clearTimeout(this.timer);
    },
}
</script>
<style lang="scss" scope>
    .content-preview{
        width: 100%;
        height: 100%;
        text-align: center;
        position: relative;
        background: #000;
        img, video{
            max-width: 100%;
        }
        .play-index{
            margin-top: 0px;
            overflow: hidden;
            background: rgba(0, 0, 0, 0.5);
            color: rgb(242, 242, 242);
            position: absolute;
            padding: 8px;
            z-index: 2;
            font-size: 1.2em;
            border-bottom-right-radius: 0.4em;
            top: 0px;
            left: 0px;
        }

        .miniview-game{
            height: 400px;
        }
    }
</style>