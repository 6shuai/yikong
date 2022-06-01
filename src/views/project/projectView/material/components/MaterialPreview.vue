<template>
    <el-dialog
        width="600px"
        :title="data.name"
        :visible.sync="showContentPreview"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
    >  
        <div class="content-preview">
            <video
                v-if="data.type == 2" 
                :src="data.sourceFile" 
                controls="controls"
                :loop="true"
                :autoplay="true" 
            >
            </video>
    
            <img v-else :src="data.sourceFile">
        </div>

    </el-dialog>
</template>

<script>

export default {
    data() {
        return {
            data: {},
            showContentPreview: false
        }
    },
    methods: {
        showPreview(content = {}){
            this.showContentPreview = true
            this.data = content
        }
    }
}
</script>

<style lang="scss">
    .content-preview{
        width: 100%;
        height: 100%;
        text-align: center;
        position: relative;
        img, video{
            max-width: 100%;
        }

        .miniview-game{
            height: 400px;
        }
    }
</style>