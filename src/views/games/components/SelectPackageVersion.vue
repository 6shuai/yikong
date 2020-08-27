<template>
    <!-- 变更游戏包版本 -->
    <el-dialog
        class="update-package-version"
        title="选择游戏包版本"
        :visible.sync="updateVersionDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="600px">
        <div v-loading="dataLoading">
            <el-card 
                class="type-card"
                v-for="(item, index) in resData"
                :key="index"
                @click.native="selectedCurrentVersion(item.id)"
            >
                <ul class="version clearfix">
                    <li>总版本：{{item.overallVersion}}</li>
                    <li>大屏端版本：{{item.screenVersion}}</li>
                    <li>手机端版本：{{item.mobileVersion}}</li>
                </ul>
                <div class="desc">{{item.description}}</div>
            </el-card>
        </div>
    </el-dialog>
</template>

<script>
import { packageProductionList, packageProductionUpdate } from '@/api/game';
export default {
    data(){
        return{
            updateVersionDialog: false,
            dataLoading: false,
            resData: []
        }
    },
    methods: {
        showProductionList(){
            let data = {
                applicationId: this.$route.params.id,
                versionType: 2
            }
            this.updateVersionDialog = true;
            this.dataLoading = true;
            packageProductionList(data).then(res => {
                this.dataLoading = false;
                if(res.code === this.$successCode){
                    this.resData = res.obj;
                }
            })
        },

        //选中此版本  变更包版本
        selectedCurrentVersion(id){
            packageProductionUpdate(`?id=${id}`).then(res => {
                if(res.code === this.$successCode){
                    this.$message.success('变更版本成功~');
                    this.updateVersionDialog = false;
                    this.$emit('updateVersion');
                }
            })
        }

    },
}
</script>

<style lang="scss">
    .update-package-version{
        .type-card{
            margin-bottom: 10px;
            cursor: pointer;
            &:hover{
                background: #a8ccfa;
            }
            .el-card__body{
                padding: 10px;
            }
            ul{
                margin-bottom: 10px;
                li{
                    float: left;
                    margin-right: 20px;
                }
            }
            .desc{
                color: #888;
            }
        }
    }
</style>