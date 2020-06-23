<template>
    <div class="content-preview">
        <img v-if="data.contentTypeId==1" :src="data.contentPath">
        <video v-if="data.contentTypeId == 2" :src="data.contentPath" controls="controls"></video>
    </div>
</template>
<script>
export default {
    props: ['data'],
    data(){
        return{
            index: 0,
            timer: undefined
        }
    },
    created() {
        // this.init();
    },
    methods: {
        init(){
            // this.currentContent = this.data[index];
        }
    },
}
</script>
<style lang="scss" scope>
    .content-preview{
        width: 100%;
        height: 100%;
        text-align: center;
        img, video{
            max-width: 100%;
        }
    }
</style>