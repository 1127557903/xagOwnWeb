<template>
  <div class="login web-phone" >
    <div class="nav">
      <!-- <van-icon name="cross" size="20" style="margin: 10px 0 10px 20px;" @click="$router.go(-1)" /> -->
      <span style="margin: 10px 20px 10px 0" @click="router.push('/phRegister')"
        >注册</span
      >
    </div>
    <div class="img"></div>
    <h3 style="margin: 20px 0 10px 20px">登录</h3>
    <van-form @submit="onSubmit">
      <van-field
        v-model="customData.username"
        name="username"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="customData.password"
        type="password"
        name="password"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit"
          >提交</van-button
        >
      </div>
    </van-form>
  </div>
</template>
<script setup >
import { post } from "@/service";
import { reactive } from "@vue/reactivity";
import { Toast } from "vant";
import store from "@/store";
import { computed } from "@vue/runtime-core";
import { UPDATE_USER_INFO,USER_INFO,UPDATE_TOKEN } from "@/store/constants"
import { useRouter } from "vue-router";


const customData = reactive({
  username: "",
  password: "",
});

const router = useRouter()

const userInfo = computed(() => {
  return store.getters[USER_INFO]
})

console.log(userInfo)

const onSubmit = (values) => {
  post("/login", values).then((res) => {
    if (res.code === "200") {
      Toast.success(res.msg);
      store.commit(UPDATE_USER_INFO,res.data.user)
      store.commit(UPDATE_TOKEN,res.data.token)
      router.push('/phone')
    }
  });
};
</script>
<style lang="scss" scoped>
.img {
  height: 200px;
  width: 100%;
  background: url("../../assets/dz.png") no-repeat center;
  background-size: auto;
}
.nav {
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  color: #fff;
  font-size: 20px;
  align-items: center;
}
</style>