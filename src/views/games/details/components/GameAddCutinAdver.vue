<!--
 * @Author: liushuai
 * @Date: 2021-11-09 18:37:45
 * @LastEditors: liushuai
 * @LastEditTime: 2021-11-10 11:10:13
 * @Description: file content
 * @FilePath: \pclient\src\views\games\details\components\GameAddCutinAdver.vue
-->
<template>
    <el-dialog
        width="800px"
        title="添加插播广告"
        class="add-round"
        :visible.sync="showAddCutinAdv"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
    >

        <add-cutin-adver 
            from="game"
            @createdCancel="showAddCutinAdv=false"
            @createdSuccess="createdSuccess"
        ></add-cutin-adver>

    </el-dialog>
</template>

<script>
import AddCutinAdver from '@/views/cutInAdver/components/AddCutinAdver'
export default {
    components: {
        AddCutinAdver
    },
    data(){
        return{
            showAddCutinAdv: false
        }
    },
    methods: {
        showDialog(){
            this.showAddCutinAdv = true;
        },
        
        //添加成功
        createdSuccess(data){
            this.showAddCutinAdv = false;
            this.$emit('handleCreatedCutinAdvCall', data);
        }
    },
}
</script>