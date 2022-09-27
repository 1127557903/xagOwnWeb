<template>
  <div class="register web-phone">
    <van-nav-bar left-arrow @click-left="onClickLeft" />
    <h2 style="margin: 40px 20px">注册</h2>
    <van-form @submit="onSubmit">
      <van-field
        v-model="customData.username"
        name="username"
        label="用户名"
        placeholder="用户名"
        :rules="[{ validator, message: '用户名需6位以上' }]"
      />
      <van-field
        v-model="customData.password"
        type="password"
        name="password"
        label="设置密码"
        placeholder="设置密码"
        :rules="[{ validator, message: '密码需6位以上' }]"
      />
      <van-field
        v-model="customData.repassword"
        type="password"
        name="repassword"
        label="重复密码"
        placeholder="重复密码"
        :rules="[{ validator, message: '密码需6位以上' }]"
      />
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit"
          >提交</van-button
        >
      </div>
    </van-form>
  </div>
</template>
<script setup>
import { reactive } from "@vue/reactivity";
import { Toast } from "vant";
import { post } from "@/service";
import { useRouter } from "vue-router";
const customData = reactive({ username: "", password: "", repassword: "" });
const router = useRouter()
const onSubmit = (values) => {
  console.log("submit", values, this);
  let _this = this;
  post("/login/register", values).then((res) => {
    if (res.code === "200") {
      Toast.success(res.msg);
      router.push('/login');
    }
  });
};
const onClickLeft = () => {
  this.$router.go(-1);
};
// 校验函数返回 true 表示校验通过，false 表示不通过
const validator = (val) => {
  return val.length > 6;
};
</script>