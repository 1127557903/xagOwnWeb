<template>
  <div class="pcLogin">
    <div class="login_out">
      <div class="login_box">
        <div class="login_top">
          <div v-if="curretData.loginType == 3" class="login_tabs">
            手机app扫码登录
          </div>
          <div v-else class="login_tabs">
            <div
              class="login_tab"
              @click="changeLoginType(1)"
              :class="{ login_tab_checked: curretData.loginType == 1 }"
            >
              账号登录
            </div>
            <div
              class="login_tab"
              @click="changeLoginType(2)"
              :class="{ login_tab_checked: curretData.loginType == 2 }"
            >
              邮箱登录
            </div>
          </div>
          <div class="login_code" @click="changeLoginType(3)"></div>
        </div>
        <div class="login_form">
          <!-- 账号登录 -->
          <div class="form_box" v-if="curretData.loginType == 1">
            <el-form label-width="0px">
              <el-form-item>
                <el-input
                  autofocus
                  v-model="loginFrom.username"
                  type="text"
                  placeholder="账号"
                  autocomplete="off"
                  size="large"
                />
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="loginFrom.password"
                  type="password"
                  placeholder="密码"
                  autocomplete="off"
                  size="large"
                />
              </el-form-item>
              <el-form-item>
                <div class="jc-sb w-f" >
                  <el-button
                    type="primary"
                    link
                    @click="linkto('/pc/register')"
                  >用户注册</el-button>
                  <el-button
                    type="primary"
                    link
                  >忘记密码</el-button>
                </div>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  style="width: 100%"
                  size="large"
                  :disabled="!loginFrom.password || !loginFrom.username"
                  @click="handleLogin"
                  >登录</el-button
                >
              </el-form-item>
            </el-form>
          </div>
          <!-- 邮箱登录 -->
          <div class="form_box" v-if="curretData.loginType == 2">
            <el-form label-width="0px">
              <el-form-item>
                <el-input
                  autofocus
                  v-model="loginFrom.email"
                  type="text"
                  placeholder="邮箱"
                  autocomplete="off"
                  size="large"
                />
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="loginFrom.code"
                  type="text"
                  placeholder="验证码"
                  autocomplete="off"
                  size="large"
                  class="input_code"
                >
                  <template #suffix>
                    <el-button @click="sendEmailCode" :disabled="isShowEmailCodeBtn || curretData.timeOut !== 0" type="primary"
                      >{{ curretData.timeOut == 0 ? '发送验证码' : curretData.timeOut}}</el-button
                    >
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  style="width: 100%"
                  size="large"
                  :disabled="!loginFrom.email || !loginFrom.code"
                  @click="handleEmailLogin"
                  >登录</el-button
                >
              </el-form-item>
            </el-form>
          </div>
          <!-- 二维码登录 -->
          <div class="form_box" v-if="curretData.loginType == 3">
            <p>使用手机app扫码登录</p>
            <qrcodeVue class="mycode"></qrcodeVue>
            <p>
              <span @click="changeLoginType(1)" >账号登录</span>
              <el-divider direction="vertical" />
              <span>注册账号</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import qrcodeVue from "@/components/common/qrcode.vue";
import { reactive, ref } from "@vue/reactivity";
import { computed, onMounted } from "@vue/runtime-core";
import { post } from "../../../service";
import { useRouter,useRoute } from "vue-router"; 
import store from "@/store";
import {UPDATE_TOKEN,UPDATE_USER_INFO} from "@/store/constants"

// 登录表单绑定
const loginFrom = reactive({
  username: "",
  password: "",
  email: "",
  code: "",
});
// 登录方式
const curretData = reactive({
  loginType: 1,
  timeOut: 0,
});

const router = useRouter()
const route = useRoute()

// 切换登录方式
const changeLoginType = (value) => {
  if (curretData.loginType == 3 && value == 3) {
    curretData.loginType = 1;
    return;
  }
  curretData.loginType = value;
};

// 是否展示发送验证码按钮
const isShowEmailCodeBtn = computed(() => {
  const emailTest =
    /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
  if (emailTest.test(loginFrom.email)) {
    return false;
  }
  return true;
});
// 发送邮箱验证码
const sendEmailCode = () => {
  post('/login/sendEmailCode',{email:loginFrom.email}).then(res => {
    if(res.code == '200') {
      curretData.timeOut = 60
      var timer = setInterval(() => {
        if(curretData.timeOut == 0) {
          clearTimeout(timer)
        }else {
          curretData.timeOut--
        }
      },1000)
    }
  })
}

const handleEmailLogin = () => {
  post('/login/emailLogin',{email:loginFrom.email,code:loginFrom.code}).then(res => {
    if(res.code == '200'){
      store.commit(UPDATE_TOKEN,res.data.token)
      store.commit(UPDATE_USER_INFO,res.data.user)
      router.push(route.params.fullPath)
    }
  })
}

const handleLogin = () => {
  post('/login',{username:loginFrom.username,password:loginFrom.password}).then(res => {
    if(res.code == '200'){
      store.commit(UPDATE_TOKEN,res.data.token)
      store.commit(UPDATE_USER_INFO,res.data.user)
      router.push(route.params.fullPath)
    }
  })
}
// 跳转页面
const linkto = (value) => {
  router.push(value)
}

onMounted(() => {});
</script>
<style lang="scss" scoped>
.pcLogin {
  background: url("@/assets/img/pcLogin/bg.png") no-repeat 50% 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .login_out {
    margin: 0 auto;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    .login_box {
      width: 400px;
      padding: 10px;
      border-radius: 5px;
      background: #fff;
      .login_top {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ccc;
        .login_tabs {
          width: 60%;
          display: flex;
          font-size: $font-size-texl;
          .login_tab {
            width: 50%;
            text-align: center;
            height: 80px;
            line-height: 80px;
            box-sizing: border-box;
            &:hover {
              border-bottom: 3px solid rgb(54, 112, 220);
            }
          }
          .login_tab_checked {
            border-bottom: 3px solid rgb(54, 112, 220);
          }
        }
        .login_code {
          width: 40%;
          height: 80px;
          background: url("@/assets/img/pcLogin/code.png") no-repeat top right;
          background-size: auto 80px;
        }
      }
      .login_form {
        .form_box {
          padding: 10px;
          .mycode {
            text-align: center;
          }
          p{
            text-align: center;
            margin: 10px 0;
            span{
              color: #909090;
              cursor: pointer;
              &:hover{
                color: #000;
              }
            }
          }
        }
      }
    }
  }
}
</style>