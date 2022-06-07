<template>
    <div class="home-mode-sidebar" v-if="currentRoleHomePageData.length">
        <el-scrollbar class="home-mode-scrollbar-wrapper hidden-scroll-x">
            <ul>
                <!-- <li>
                    <span class="icon"><svg-icon icon-class="PlayManage" /></span>
                    <span class="menu-name">播放管理</span> 
                </li>
                <li>
                    <span class="icon"><svg-icon icon-class="PlayHistory" /></span>
                    <span class="menu-name">播放历史</span> 
                </li> -->
                <li 
                    v-for="(item, index) in currentRoleHomePageData"
                    :key="index"
                    :class="{ 'active': activeName == item.moduleName }"
                    @click="handleTabClick(item)"
                >
                    <span class="icon"><svg-icon :icon-class="item.moduleName" /></span>
                    <span class="menu-name">{{ item.displayName }}</span> 
                </li>
            </ul>
        </el-scrollbar>

        <div class="sildebar-open" @click="toggleSideBar">
            <i :class="sidebar.opened ? 'el-icon-download' : 'el-icon-upload2'"></i>
        </div>
    </div>
</template>

<script>
export default { 
    props: {
        childTabs: Array
    },
    data() {
        return {
            activeName: 0,
            currentTab: {},

            // 财务主页 tab栏路由
            financeTabs: ['/finance/projectView', '/finance/returnMoney', '/finance/commissionSystem', '/contract/approval', '/finance/projectAuthority', '/invoiceCenter']
        }
    },
    mounted() {
        if(this.$route.name) this.activeName = this.$route.name.split('--')[0]
    },
    computed: {
        currentRoleHomePageData() {
            if(this.$store.state.settings.classicMode) return 

            let data = []

            let tabsData = this.childTabs ? this.childTabs : this.$store.state.user.currentRoleHomePageData

            tabsData.forEach(element => {
                if(element.children && element.children.length){
                    for(let i = 0; i < element.children.length; i++){
                        if(element.children[i].moduleName != 'User' && element.children[i].moduleName != 'InvoiceCenter') data.push(element.children[i])
                    }
                }else{
                    data.push(element)
                }
            })  
            
            if(data.length) this.activeName = data[0].route
            return data
        },
        sidebar(){
            return this.$store.state.app.sidebar
        }
    },

    methods: {
        toggleSideBar() {
			this.$store.dispatch("app/toggleSideBar")
		},

        handleTabClick(item){
            this.activeName = item.moduleName
            this.$router.push(item.children && item.children.length ? item.children[0].route : item.route)
        }
    },
    watch: {
        '$route.name'(n, o){
            this.activeName = this.$route.name.split('--')[0]
        }
    }
}
</script>

<style lang="scss">
    .home-mode-sidebar{
        width: 136px;
        height: 100%;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        z-index: 1001;
        background: #1F2937;
        color: #fff;
        transition: width 0.28s;

        .home-mode-scrollbar-wrapper{
            width: 100%;
            height: calc(100% - 100px);

            ul>li{
                height: 45px;
                font-size: 16px;
                padding-left: 16px;
                display: flex;
                align-items: center;
                cursor: pointer;
                overflow: hidden;

                .icon{
                    margin-right: 5px;
                    svg{
                        vertical-align: middle;
                    }
                }

                .menu-name{
                    white-space:nowrap;
                }

                &.active{
                    color: #111827;
                    background: #0EA5E9;
                }

                &:hover{
                    color: #111827;
                    background: #0EA5E9;
                }
            }
        }

        .sildebar-open{
            padding: 40px 0;
            text-align: center;
            color: #fff;
            font-size: 20px;
            cursor: pointer;
            transform: rotate(90deg);
        }
    }
</style>