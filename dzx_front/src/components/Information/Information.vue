<template>
  <div class="information">
    <van-nav-bar left-arrow @click-left="$router.go(-1)"> </van-nav-bar>
    <div class="box">
      <div class="head">
        <img :src="config.HTTP + user.head_img" @click="setHead" alt="" />
        <div class="change-head" @click="setHead">点击修改头像</div>
      </div>
      <van-form @submit="onSubmit">
        <van-field
          v-model="user.nick_name"
          name="nick_name"
          label="昵称"
          placeholder="请填写昵称"
          :rules="[{ required: true, message: '请填写用户名' }]"
          @blur="setInformation()"
        />
        <van-field
          readonly
          clickable
          name="sex"
          :value="user.sex"
          label="性别"
          placeholder="点击选择性别"
          @click="showPicker = true"
        />
        <van-popup v-model="showPicker" position="bottom">
          <van-picker
            show-toolbar
            :columns="columns"
            @cancel="showPicker = false"
            @confirm="onConfirm"
          />
        </van-popup>
        <van-field
          v-model="user.age"
          name="age"
          label="年龄"
          type="number"
          placeholder="请填写年龄"
          @blur="setInformation()"
        />
        <van-field
          v-model="user.sign"
          name="sign"
          label="个性签名"
          placeholder="请填写个性签名"
          @blur="setInformation()"
        />
      </van-form>
    </div>
  </div>
</template>
<script>
import { config } from "../../config/api";
import { Dialog, Toast } from "vant";

export default {
  name: "information",
  data() {
    return {
      user: {
        nick_name: "",
        sex: "",
        age: "",
        head_img: "",
      },
      config,
      columns: ["男", "女", "保密"],
      showPicker: false,
    };
  },
  methods: {
    async getData() {
      let res = await this.$http.get("/user");
      if (res.data) {
        this.user = res.data;
      }
    },
    onConfirm(value) {
      console.log(value);
      this.user.sex = value;
      this.showPicker = false;
      this.setInformation();
    },
    onSubmit(values) {},
    setHead() {
      let input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.click();
      let that = this;
      input.onchange = function (res) {
        var formData = new FormData();
        formData.append("file", input.files[0]);
        that.$http.post("/user/setHead", formData).then((res) => {
          Toast(res.msg);
          if (res.code == "200") {
            that.user = {
              ...that.user,
              head_img: res.data,
            };
          }
        });
      };
    },
    setInformation() {
      console.log(1111);
      if (!this.user.nick_name) {
        Toast("昵称不能为空");
        return;
      }
      this.$http.post("/user/setInformation", this.user).then((res) => {
        Toast(res.msg);
        if (code == "200") {
          this.getData();
        }
      });
    },
  },
  mounted() {
    this.getData();
  },
};
</script>
<style lang="less" scoped>
.information {
  height: 100vh;
  background: #eee;
  .box {
    background: #fff;
    padding: 20px 0;
    .head {
      margin: 0 auto;
      text-align: center;
      img {
        height: 80px;
        width: 80px;
        border-radius: 50%;
        margin: 0 auto;
        object-fit: cover;
      }
      .change-head {
        width: 80px;
        text-align: center;
        margin: 0 auto;
        font-size: 12px;
        color: #ccc;
        margin-top: 10px;
      }
    }
  }
}
</style>