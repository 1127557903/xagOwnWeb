<template>
  <div class="allstop">
    <div class="content">
      <div
        class="one_card"
        @click="showdetail(item.id)"
        v-for="(item, index) in allTrop"
        :key="index"
      >
        <div class="left">
          <img :src="config.HTTP + item.img" alt="" />
        </div>
        <div class="right">
          <div class="name">{{ item.name }}</div>
          <div class="label">
            <div class="tip" v-for="(one, index) in item.label" :key="index">
              {{ one }}
            </div>
          </div>
          <div class="address">
            <van-icon name="location" color="#1989fa" size="12" />{{
              item.address
            }}
          </div>
          <div class="text">{{ item.symbol }}</div>
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
import { config } from "@/config/api";
import { Dialog, Toast } from "vant";

export default {
  name: "allstop",
  data() {
    return {
      page: 1,
      limit: 5,
      allTrop: [],
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
      this.$http.post("/place/selectAll", data).then((res) => {
        if (!res || res.code !== "200") {
          Dialog.alert({
            title: "错误",
            message: res.msg,
          }).then(() => {
            // on close
          });
          return;
        }
        let list = res.data.map((item) => {
          return { ...item, label: item.label.split(",") };
        });
        if (this.page == 1) {
          this.allTrop = [...list];
        } else {
          this.allTrop = [...this.allTrop, ...list];
        }
        if (this.allTrop.length < res.count) {
          this.isNeedMore = true;
        } else {
          this.isNeedMore = false;
        }
      });
    },
    // 展示景点详细
    showdetail(id) {
      this.$router.push({ name: "spotDetail", params: { id } });
    },
  },
  mounted() {
    this.getData();
  },
};
</script>
<style lang="less" scope>
.allstop {
  .content {
    .one_card {
      display: flex;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid #faf9f9;
      .left {
        width: 100px;
        height: 100px;
        img {
          width: 100px;
          height: 100px;
          object-fit: cover;
        }
      }
      .right {
        flex: 1;
        padding-left: 10px;
        height: 100px;
        .name {
          font-weight: 600;
        }
        .text {
          font-size: 12px;
          -webkit-line-clamp: 2;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .label {
          display: flex;
          div {
            font-size: 12px;
            color: #fff;
            border: 1px solid #54cbf8;
            border-radius: 3px;
            padding: 2px;
            margin-right: 5px;
            background: #a0e2fc;
          }
        }
        .address {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
