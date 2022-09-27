<template>
  <div class="more-delicous">
    <van-nav-bar left-arrow @click-left="$router.go(-1)">
    </van-nav-bar>
    <div class="delicous">
      <div class="card" @click="$router.push('/delicous?id='+item.id)" v-for="item in delicous" :key="item.index">
        <div class="left">
          <img :src="config.HTTP + item.titleImg" alt="" />
        </div>
        <div class="right">
          <div class="name-box">
            <div class="name">{{ item.name }}</div>
            <div class="price">¥{{ item.price }}/人</div>
          </div>
          <div class="middle">
            <div class="type">{{ item.type }}</div>
            <div class="address">{{ item.address }}</div>
          </div>
          <span class="label">{{ item.label }}</span>
        </div>
      </div>
    </div>
    <div style="padding: 10px" v-if="isNeedMore">
      <van-button type="primary" @click="getMore" size="large"
        >加载更多</van-button
      >
    </div>
  </div>
</template>
<script>
import { config } from "../../config/api";

export default {
  name: "delicous",
  data() {
    return {
      delicous: [],
      page: 1,
      limit: 3,
      isNeedMore: false,
      config,
    };
  },
  methods: {
    getMore() {
      this.page++;
      this.getData();
    },
    getData() {
      const page = this.page;
      const limit = this.limit;
      let data = {
        page,
        limit,
      };
      this.$http.get("/delicous/select", data).then((res) => {
        if (!res || res.code !== "200") {
          Dialog.alert({
            title: "错误",
            message: res.msg,
          }).then(() => {
            // on close
          });
          return;
        }
        let list = res.data;
        if (this.page == 1) {
          this.delicous = [...list];
        } else {
          this.delicous = [...this.delicous, ...list];
        }
        if (this.delicous.length < res.count) {
          this.isNeedMore = true;
        } else {
          this.isNeedMore = false;
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
.more-delicous {
  height: 100vh;
  background: #eee;
  overflow-y: scroll;
  .delicous {
    padding: 10px;
    .card {
      border-radius: 5px;
      background: #fff;
      display: flex;
      align-items: center;
      padding: 10px;
      margin-bottom: 10px;
      .left {
        img {
          width: 70px;
          height: 70px;
          object-fit: cover;
          border-radius: 5px;
        }
      }
      .right {
        //   height: 80px;
        font-size: 12px;
        color: #999;
        padding-left: 10px;
        flex: 1;
        > div {
          margin-bottom: 5px;
        }
        .name-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
          .name {
            font-size: 16px;
            font-weight: 600;
            color: #000;
          }
          .price {
            font-size: 14px;
            color: red;
          }
        }
        .middle {
          display: flex;
          align-items: center;
          > div {
            margin-right: 10px;
          }
        }
        .label {
          background: #ffe4b0;
          color: #dfa907;
          padding: 2px;
          border-radius: 50px;
          border-bottom-left-radius: 0px;
          border-top-left-radius: 40px;
        }
      }
    }
  }
}
</style>