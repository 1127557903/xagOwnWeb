<!-- 显示登录二维码 -->
<template>
  <div class="qrcode">
    <qrcode-vue
      v-show="curretData.scanType == '1'"
      :value="codeData.value"
      :foreground="codeData.BYTE_POS"
      :size="220"
      level="H"
    />
    <div v-show="curretData.scanType == '2'" style="text-align:center;" >
      扫描成功，请确认登录！
    </div>
    <div v-show="curretData.scanType == '3'"  @click="reCode"
 >
      二维码已失效，请刷新
    </div>
  </div>
</template>

<script setup>
import { reactive } from "@vue/reactivity";
import QrcodeVue from "qrcode.vue";
import config from "@/config/config";
import { post } from "@/service";
import { onMounted } from "@vue/runtime-core";
import { UPDATE_TOKEN } from "../../store/constants";
import { useRouter } from "vue-router";
import store from "@/store";
import { Toast } from "vant";

const router = useRouter()

const codeData = reactive({
  value: '/login/getcode', //显示的值、跳转的地址
  // imagePath: 'https://pics7.baidu.com/feed/728da9773912b31b1661f375215d877cdab4e12d.jpeg?token=e1f6c171809d77fd2e13c225df0f1072', //中间logo的地址
  BYTE_POS: "green",
});

const curretData = reactive({
  scanType:'1'
})

const newCode = () => {
  let data = Math.ceil(Math.random()*1000); 
  // alert(data)
  codeData.value = '/login/getcode?code=' + data
  post('/login/setcode',{code:data},{notLoading: true}).then(res => {
    if(res.code == '200'){
      curretData.scanType = '2'
      // 接收到code后变更状态，变为待确认登录状态
      post('/login/codeLogin',{code:data}).then(result => {
        if(result.code == '200') {
          store.commit(UPDATE_TOKEN,result.token)
          router.push('/pc')
        } else {
          curretData.scanType = '3'
          Toast(result.msg)
        }
      })
    } else {
      curretData.scanType = '3'
      Toast(result.msg)
    }
  })
}

const reCode = () => {
  curretData.scanType='2';
  newCode()
}
onMounted(() => {
  newCode()
})
</script>