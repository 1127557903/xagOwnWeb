<!-- 显示二维码 -->
<template>
  <div class="qrcode">
    <qrcode-vue
      :value="codeData.value"
      :size="220"
      level="H"
      @click="newCode"
    />
  </div>
</template>

<script setup>
import { reactive } from "@vue/reactivity";
import QrcodeVue from "qrcode.vue";
import config from "@/config/config";
import { post } from "@/service";
const codeData = reactive({
  value: config.HTTP + '/login/qrCodeLogin', //显示的值、跳转的地址
  imagePath: 'https://pics7.baidu.com/feed/728da9773912b31b1661f375215d877cdab4e12d.jpeg?token=e1f6c171809d77fd2e13c225df0f1072', //中间logo的地址
  BYTE_POS: "green",
});
const newCode = () => {
  let data = Math.ceil(Math.random()*1000); 
  // alert(data)
  codeData.value = '/login/getcode?code=' + data
  post('/login/setcode',{code:data}).then(res => {
    if(res == '200'){
      // 接收到code后变更状态，变为待确认登录状态
      post('/login/codeLogin',{code:data}).then(result => {
        if(result == '200') {
          alert('登录成功')
        }
      })
    }
    })
}
</script>