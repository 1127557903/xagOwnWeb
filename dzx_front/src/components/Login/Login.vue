<template>
  <div>
    <div class="nav">
      <!-- <van-icon name="cross" size="20" style="margin: 10px 0 10px 20px;" @click="$router.go(-1)" /> -->
        <span  style="margin: 10px 20px 10px 0;" @click="$router.push('/register')">注册</span>
    </div>
    <div class="img"></div>
    <h3 style="margin: 20px 0 10px 20px;">登录</h3>
    <van-form @submit="onSubmit">
      <van-field
        v-model="username"
        name="username"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="password"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
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
export default {
  name: "login",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    onSubmit(values) {
      let _this = this
      this.$http.post('/login',values).then(res =>{
          if(res.code === '200') {
            _this.$Toast.success(res.msg)
            sessionStorage.setItem('dzx',res.data.token)
            sessionStorage.setItem('dzx_user',res.data.userId)
            _this.$router.go(-1)
          }
      })
    },
  },
};
</script>
<style lang="less" scoped>
.img{
    height: 200px;
    width: 100%;
    background: url('../../assets/dz.png') no-repeat center;
    background-size: auto;
}
.nav{
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