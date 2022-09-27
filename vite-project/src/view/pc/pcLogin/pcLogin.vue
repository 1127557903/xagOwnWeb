<template>
  <div class="pcLogin">
    <div class="login_out">
      <div class="login_box">
        <div class="login_top">
          <div class="login_tabs">
            <div class="login_tab">账号登录</div>
            <div class="login_tab">邮箱登录</div>
          </div>
          <div class="login_code"></div>
        </div>
        <div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";

onMounted(() => {});
</script>
<style lang="scss" scoped>
.pcLogin {
  background: url('@/assets/img/pcLogin/bg.png') no-repeat 50% 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .login_out {
    margin: 0 auto;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    .login_box{
      width: 400px;
      padding: 10px;
      border-radius: 5px;
      background: #fff;
      .login_top{
        display: flex;
        align-items: center;
        .login_tabs{
          width: 60%;
          display: flex;
          .login_tab{
            width: 50%;
            text-align: center;
            height: 80px;
            line-height: 80px;
          }
        }
        .login_code{
          width: 40%;
          height: 80px;
        }
      }
    }
  }
}
</style>