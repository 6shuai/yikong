import { uploadUrl, ajaxUrl } from '@/utils';
export const videoShot = {
    methods: {
        //截图视频第一帧图
        getBigectURL(video, width, height) {
            // 创建画布准备截图
            var canvas = document.createElement('canvas')
            // 设置画布的宽高
            canvas.width = width;
            canvas.height = height
            // 图片绘制
            video.onloadeddata = ((e) => {
                canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
                var dataURL = canvas.toDataURL('image/jpeg')
                this.uploadImg(dataURL);
            })
        },
        
        // 上传图片
        uploadImg(dataURI){
            console.log('上传图片')
            let that = this;
            var blob = this.dataURItoBlob(dataURI);

            var xhr = new XMLHttpRequest();
            var fd = new FormData();
            fd.append('fileType', 'picture');
            fd.append('file', blob, new Date().getTime() +'.jpg');
            xhr.addEventListener('load',  function(){ that.imageSuccess(event) }, false);
            xhr.addEventListener('error', function(){ that.uploadError() }, false);
            xhr.addEventListener('abort', function(){ that.uploadError() }, false);
            xhr.open('POST', ajaxUrl + uploadUrl);
            xhr.send(fd);
            xhr.getAllResponseHeaders()
        },

        //上传成功
        imageSuccess(res){
            let msg = JSON.parse(res.target.response);
            if(msg.code === 0){
                this.$emit('uploadVideoCover', msg.obj.path);
            }
        },

        //上传出错
        uploadError(error){
            console.log(error, '上传错误')
        },

        //base64 转 二进制
        dataURItoBlob(dataURI) {
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]; // mime类型
            var byteString = atob(dataURI.split(',')[1]); //base64 解码
            var arrayBuffer = new ArrayBuffer(byteString.length); //创建缓冲数组
            var intArray = new Uint8Array(arrayBuffer); //创建视图

            for (var i = 0; i < byteString.length; i++) {
                intArray[i] = byteString.charCodeAt(i);
            }
            return new Blob([intArray], {type: mimeString});
        },
        
    },
}