<template>
  <div class="my">
    <div class="head_back">
      <div class="head" v-if="user.id" @click="$router.push('/information')" >
        <div class="left">
          <h2>{{ user.nick_name }}</h2>
          <p>{{ user.sign || "小主还没留下签名哦~" }}</p>
        </div>
        <div class="image">
          <img :src="config.HTTP + user.head_img" alt="" />
        </div>
      </div>
      <div class="head" @click="$router.push('/login')" v-else>
        <div class="left">
          <h2>点击登录</h2>
          <p>用户未登录</p>
        </div>
        <div class="image">
          <img src="../assets/head.png" alt="" />
        </div>
      </div>
      <div class="num">
        <div class="noline">
          <p class="number">{{ num.collection }}</p>
          <p class="text">收藏</p>
        </div>
        <div class="line"></div>
        <div class="noline">
          <p class="number">{{ num.likes }}</p>
          <p class="text">点赞</p>
        </div>
        <div class="line"></div>
        <div class="noline">
          <p class="number">{{ num.comment }}</p>
          <p class="text">评论</p>
        </div>
      </div>
    </div>
    <div class="mine">
      <van-grid :column-num="2" :border="false">
        <van-grid-item
          icon="logistics"
          text="我的行程"
          @click="$router.push('/mytrip')"
        />
        <van-grid-item
          icon="search"
          text="我的游记"
          @click="$router.push('/mytravels')"
        />
      </van-grid>
    </div>
    <div class="myto">
      <div class="one">
        <div class="left">
          <van-icon name="shop-o" size="24" /><span>关于软件</span>
        </div>
        <van-icon name="arrow" size="16" />
      </div>
      <div class="one">
        <div class="left">
          <van-icon name="bulb-o" size="24" /><span>用户反馈</span>
        </div>
        <van-icon name="arrow" size="16" />
      </div>
      <div class="one">
        <div class="left">
          <van-icon name="warning-o" size="24" /><span>投诉</span>
        </div>
        <van-icon name="arrow" size="16" />
      </div>
      <div class="one">
        <div class="left">
          <van-icon name="setting-o" size="24" /><span>设置</span>
        </div>
        <van-icon name="arrow" size="16" />
      </div>
    </div>
    <div class="out">
      <van-button type="danger" @click="outLogin" block>退出登录</van-button>
    </div>
  </div>
</template>
<script>
import {config} from '../config/api'
import { Dialog, Toast } from 'vant';
export default {
  name: "my",
  data() {
    return {
      user: {},
      // 点赞评论数
      num: {
        comment: 0,
        likes: 0,
        collection: 0,
      },
      config
    };
  },
  created() {
    console.log(this.user);
    this.getData();
    this.getAllNum();
  },
  methods: {
    async getData() {
      let res = await this.$http.get("/user");
      if (res.data) {
        this.user = res.data;
      }
    },
    async getAllNum() {
      console.log(111);
      this.$http.get("/user/countLikes").then((res) => {
        if (res && res.code == "200") {
          this.num = { ...res.data };
          console.log(this.num, "num");
        }
      });
    },
    outLogin() {
      sessionStorage.removeItem("dzx");
      Dialog.alert({
        message: '登出成功',
      }).then(() => {
        this.$router.push("/login");
      });
    },
  },
};
</script>
<style lang="less" scoped>
.my {
  .out {
    position: absolute;
    bottom: 70px;
    left: 0;
    width: 100%;
  }
  .head_back {
    background-color: #aaaaaa;
    padding: 20px;
    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #fff;
      .left {
        p {
          margin-top: 5px;
        }
      }
      .image {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;
        // background: url("../assets/logo.png") no-repeat center center;
        // background-size: 100%;
        img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
      }
    }
    .num {
      display: flex;
      justify-content: space-around;
      margin-top: 20px;
      align-items: center;
      color: #fff;
      margin-bottom: 40px;
      .line {
        width: 1px;
        background: #fff;
        height: 25px;
      }
      .noline {
        text-align: center;
        .number {
          font-size: 20px;
        }
        .text {
          font-size: 12px;
        }
      }
    }
  }
  .mine {
    margin: -43px 20px 0 20px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 1px -1px 16px 0px rgba(6, 0, 1, 0.1);
  }
  .myto {
    padding: 20px;
    .one {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 30px;
      color: #777777;
      .left {
        display: flex;
        align-items: center;
        span {
          margin-left: 10px;
        }
      }
    }
  }
}
</style>