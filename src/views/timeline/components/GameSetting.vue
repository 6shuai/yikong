<template>
    <!-- 变更游戏包版本 -->
    <el-dialog
        class="game-setting"
        title="游戏设置"
        :modal-append-to-body="false"
        :visible.sync="gameSettingDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="600px">
        <div class="tab-wrap">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="游戏包版本" name="packageVersion"></el-tab-pane>
                <el-tab-pane label="游戏配置" name="config"></el-tab-pane>
            </el-tabs>
        </div>
        <div v-loading="dataLoading" v-if="activeName=='packageVersion'" class="game-setting-content">
            <el-card 
                class="type-card"
                v-for="(item, index) in packageVersionData"
                :key="index"
                :class="{'active':params.packageId==item.id}"
                @click.native="selectedCurrentVersion(item.id)"
            >
                <h3>{{item.versionType==0 ? '开发版本' : item.versionType==1 ? '测试版本' : '线上版本'}}</h3>
                <ul class="version clearfix">
                    <li>总版本：{{item.overallVersion}}</li>
                    <li>大屏端版本：{{item.screenVersion}}</li>
                    <li>手机端版本：{{item.mobileVersion}}</li>
                </ul>
                <div class="desc">{{item.description}}</div>
            </el-card>
        </div>
        <div v-if="activeName=='config'" class="game-setting-content">
            <el-card 
                class="type-card"
                v-for="(item, index) in gameConfigData"
                :key="index"
                :class="{'active':params.configId==item.id}"
                @click.native="selectedCurrentConfig(item.id)"
            >
                <h3>{{item.displayName}}</h3>
            </el-card>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="gameSettingDialog=false">取 消</el-button>
            <el-button type="primary" :loading="saveLoading" @click="handleSaveConfig">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { packageList } from '@/api/game';
import { timelineSaveGameConfig } from '@/api/timeline';
import axios from 'axios';
export default {
    data(){
        return{
            activeName: 'packageVersion',
            gameSettingDialog: false,
            dataLoading: false,
            params: {},
            packageVersionData: [],             //游戏包版本 列表
            gameConfigData: [],                 //游戏配置 列表
            saveLoading: false,                 //保存按钮loading
        }
    },
    methods: {
        showGameSetting(data){
            this.gameSettingDialog = true;
            this.params.timelineId = data.timelineId;
            this.gameConfigData = data.configList;
            this.gamePackageVersionList();
        },

        //游戏包版本列表
        gamePackageVersionList(){
            let data = {
                applicationId: 2,
                versionType: 2
            }
            this.dataLoading = true;
            packageList(data).then(res => {
                this.dataLoading = false;
                if(res.code === this.$successCode){
                    this.packageVersionData = res.obj;
                }
            })
        },

        //选中此版本 
        selectedCurrentVersion(id){
            this.$set(this.params, 'packageId', id);
        },

        //选中此配置
        selectedCurrentConfig(id){
            this.$set(this.params, 'configId', id);
        },

        handleClick(){
            console.log(this.activeName);
        },

        //保存游戏配置
        handleSaveConfig(){
            this.saveLoading = true;
            timelineSaveGameConfig(this.params).then(res => {
                this.saveLoading = false;
                if(res.code === this.$successCode){
                    this.$message.success('操作成功~');
                    this.gameSettingDialog = false;
                }
            })
        }

    },
}
</script>

<style lang="scss">
    .game-setting{
        .el-dialog__body{
            padding: 0 20px 30px 20px;
        }
        .type-card{
            margin-bottom: 10px;
            cursor: pointer;
            &:hover{
                background: #a8ccfa;
            }
            &.active{
                background: #a8ccfa;
            }
            .el-card__body{
                padding: 10px;
            }
            ul{
                margin: 10px 0;
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