<!--
 * @Author: liushuai
 * @Date: 2022-03-14 11:25:09
 * @LastEditors: liushuai
 * @LastEditTime: 2022-03-22 11:49:15
 * @Description: file content
 * @FilePath: \pclient\src\layout\components\HomeTabs.vue
-->
<template>
    <div class="home-page-tabs-wrap">
        <div class="home-page-tabs">
            <div 
                v-for="(item, index) in currentRoleHomePageData"
                :key="index"
                class="item"
                :class="{ 'active': item.route == activeName }"
                @click="handleTabClick(item)"
            >
                <div>{{ item.displayName }}</div>
            </div>
        </div>

        <div class="ml20">
            <home-tabs v-if="currentTab.children && currentTab.children.length" :childTabs="currentTab.children"></home-tabs>
        </div>

    </div>
    
</template>

<script>
export default { 
    name: 'HomeTabs',
    props: {
        childTabs: Array
    },
    data() {
        return {
            activeName: undefined,
            currentTab: {}
        }
    },
    mounted() {
        this.activeName = this.$route.path
    },
    computed: {
        currentRoleHomePageData() {
            if(this.$store.state.settings.showMenu) return 

            let data = []

            let tabsData = this.childTabs ? this.childTabs : this.$store.state.user.currentRoleHomePageData

            if(tabsData.length == 1 && !tabsData[0].children.length) return data

            tabsData.forEach(element => {
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
        handleTabClick(item){
            this.currentTab = item
            this.activeName = item.route
            this.$router.push(item.children && item.children.length ? item.children[0].route : item.route)
        }
    }
}
</script>
<style lang="scss">
    .home-page-tabs-wrap{
        background: #fff;
        border-bottom: 1px solid #e5e5e5;

        .home-page-tabs{
            display: flex;
    
            .item{
                padding: 20px;
                cursor: pointer;

                &.active{
                    color: var(--color-primary);
                }
            }
        }
    }
</style>