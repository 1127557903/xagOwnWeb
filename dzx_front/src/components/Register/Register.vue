<template>
  <div>
    <van-nav-bar
      left-arrow
      @click-left="onClickLeft"
    />
    <h2 style="margin: 40px 20px;">注册</h2>
        <van-form @submit="onSubmit">
      <van-field
        v-model="username"
        name="username"
        label="用户名"
        placeholder="用户名"
        :rules="[{ validator, message: '用户名需6位以上' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="password"
        label="设置密码"
        placeholder="设置密码"
        :rules="[{ validator, message: '密码需6位以上' }]"
      />
    <van-field
        v-model="repassword"
        type="password"
        name="repassword"
        label="重复密码"
        placeholder="重复密码"
        :rules="[{ validator, message: '密码需6位以上' }]"
      />
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit"
          >提交</van-button
        >
      </div>
    </van-form>
  </div>
</template>
<script>
import { Toast } from 'vant';
export default {
    name: 'register',
  data() {
    return {
      username: "",
      password: "",
      repassword: "",
    };
  },
  methods: {
    onSubmit(values) {
      console.log("submit", values,this);
      let _this = this
      this.$http.post('/login/register',values).then(res=>{
          if(res.code === '200') {
            _this.$Toast.success(res.msg)
            _this.$router.go(-1)
          }
      })
    },
    onClickLeft(){
        this.$router.go(-1)
    },
        // 校验函数返回 true 表示校验通过，false 表示不通过
    validator(val) {
      return val.length>6;
    },
  },
};
</script>