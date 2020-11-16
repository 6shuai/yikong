<template>
    <div class="content">
        <h2 class="info-title mt20 mb20">基本信息</h2>
        <el-form 
            label-width="120px"
        >
            <el-form-item label="游戏名称:">
                <span>{{resData.displayName}}</span>
            </el-form-item>
            <el-form-item label="描述:">
                <span>{{resData.description}}</span>
            </el-form-item>
            <el-form-item label="图标:">
                <el-image 
                    v-if="resData.image"
                    class="icon"
                    fit="cover"
                    :src="resData.image" 
                    :preview-src-list="previewIcon"
                >
                </el-image>
            </el-form-item>
            <el-form-item label="游戏截图:">
                <el-image 
                    class="screenshot"
                    v-for="item in resData.applicationShowData"
                    :key="item.id"
                    fit="cover"
                    :src="item.url" 
                    :preview-src-list="previewList"
                >
                </el-image>
            </el-form-item>
        </el-form>

        <h2 class="info-title mt20 mb20">开发信息</h2>
        <el-form 
            label-width="120px"
        >
            <el-form-item label="AppID:">
                <span>{{resData.appId}}</span>
            </el-form-item>
            <el-form-item label="AppSecret:">
                <div v-loading="upldateSecretLoading">
                    <span>{{resData.secret}}</span>
                    <el-link class="ml20" type="primary" @click="updateSecret">更新</el-link>
                </div>
            </el-form-item>
        </el-form>

    </div>
</template>