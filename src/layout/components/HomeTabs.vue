<template>
    <el-tabs 
        class="home-page-tabs-wrap"
        v-if="currentRoleHomePageData && currentRoleHomePageData.length > 1"
        v-model="activeName" 
        type="card" 
        @tab-click="handleTabClick"
    >
        <el-tab-pane 
            v-for="(item, index) in currentRoleHomePageData"
            :key="index"
            :label="item.displayName" 
            :name="item.route"
        >
        </el-tab-pane>
        
    </el-tabs>
</template>

<script>
export default { 
    data() {
        return {
            activeName: undefined
        }
    },
    mounted() {
        this.activeName = this.$route.path
    },
    computed: {
        currentRoleHomePageData() {
            if(this.$store.state.settings.showMenu) return 

            let data = []

            this.$store.state.user.currentRoleHomePageData.forEach(element => {
                if(element.children && element.children.length){
                    for(let i = 0; i < element.children.length; i++){
                        if(element.children[i].moduleName != 'User') data.push(element.children[i])
                    }
                }else{
                    data.push(element)
                }
            })  
            
            if(data.length) this.activeName = data[0].route

            return data

        }
    },

    methods: {
        handleTabClick(){
            this.$router.push(this.activeName)
        }
    }
}
</script>
<style lang="scss">
    .home-page-tabs-wrap{
        &.el-tabs--card>.el-tabs__header{
            background: #fff;
        }
    }
</style>