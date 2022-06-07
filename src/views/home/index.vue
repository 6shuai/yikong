<template>
    <div class="home-wrap">
        <div class="role">
            <!-- 多个角色情况  要先选择角色进入 -->

            <h3 class="role-tip">请选择一个角色进入首页</h3>
            <div class="role-list">
                <el-card 
                    v-for="(item, index) in homePageData"
                    :key="index"
                    @click.native="handleSelectRole(item)"
                >
                    {{ item.displayName }}
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
import { filterAsyncRouter } from '@/store/modules/permission'
import router from '@/router'
import { roleHome } from '@/utils/config'


export default {
    computed: {
        homePageData(){
            return this.$store.state.user.homePageData
        }
    },
    data(){
        return {
            currentRoleHomePageData: []
        }
    },
    mounted() {
        let currentRoleHomePageData = localStorage.currentRoleHomePageData ? JSON.parse(localStorage.currentRoleHomePageData) : []
        this.currentRoleHomePageData = currentRoleHomePageData
    },
    methods: {
        // 选择角色 注册对应的路由
        handleSelectRole(data){

            let authorities = data.authorities ? data.authorities : []
            let roleHomeRoutes = data.id === 1 ? [] : roleHome[data.frontRoute]

            // 财务主页
            // 运营主页 左侧菜单栏不显示发票中心
            if(data.frontRoute === '/finance' || data.frontRoute === '/operation'){
                for(let i = 0; i < authorities.length; i++){
                    if(authorities[i].moduleName == 'Project'){
                        localStorage.financeTabs = JSON.stringify(authorities[i].children)
                        if(data.frontRoute === '/finance') authorities.splice(i, 1)   
                    }
                }
            }



            let routes = [
                ...roleHomeRoutes,
                ...authorities
            ]

            const asyncRouter = filterAsyncRouter(routes)
            asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
            
            // 存储路由
            this.$store.dispatch('permission/GenerateRoutes', asyncRouter).then(() => { 
                router.addRoutes(asyncRouter) // 动态添加可访问路由表
            })
            
            
            // id =1  老用户 显示左侧菜单栏
            setTimeout(() => {
                if(data.id === 1){
                    this.$store.commit('settings/SET_SHOW_MENU', true)
                    this.$router.push('/home')
                }else{
                    this.$router.push(data.frontRoute)
                }
                
                this.$store.state.user.currentRoleHomePageData = routes
                this.currentRoleHomePageData = routes
                localStorage.currentRoleHomePageData = JSON.stringify(routes)
                localStorage.homeRoute = data.frontRoute.replace(/(^[\s\n\t]+|[\s\n\t]+$)/g, "" )
            }, 100);
        },

    }
}
</script>

<style lang="scss" scoped>
    .home-wrap{
        width: 100%;

        .role{
            padding-top: 100px;
            
            &-tip{
                text-align: center;
                padding: 40px 0;
            }
            
            &-list{
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                
                .el-card{
                    width: 300px;
                    height: 100px;
                    line-height: 60px;
                    font-size: 24px;
                    text-align: center;
                    background: rgb(194, 192, 192);
                    margin: 20px;
                    cursor: pointer;

                    &:hover{
                        box-shadow: 0 2px 12px 0 rgba(83, 59, 59, 0.5);
                    }
                }
            }
        }

        .entrance{
            max-width: 80%;
            margin: 0 auto;

            &-list{
                margin-top: 20px;
            }

            &-page{
                width: 150px;
                height: 80px;
                line-height: 80px;
                display: inline-block;
                text-align: center;
                border: 1px solid #f0f0f0;
                margin: 20px;
                border-radius: 6px;
                cursor: pointer;
                background: var(--color-primary);

                &:hover{
                    background: #8484ff36;
                    box-shadow: 0 2px 12px 0 rgba(83, 59, 59, 0.5);
                }
            }
        }
    }
</style>