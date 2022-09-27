<template>
  <div class="hotel">
    <van-nav-bar left-arrow @click-left="$router.go(-1)"> </van-nav-bar>
    <div class="out-box" id="out-box">
      <div class="box" id="box">
        <div
          class="item"
          @click="$router.push('/hotelDetail?id='+item.id)"
          v-for="(item, index) in hotelData"
          :key="index"
        >
          <div class="img">
            <img :src="config.HTTP + item.titleImg" alt="" />
          </div>
          <div class="text">
            <div class="name text-over">{{ item.name }}</div>
            <span class="slogan text-over">“{{ item.slogan }}”</span>
            <div class="price">
              ¥<span>{{ item.price }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="isOver" v-if="isOver && hotelData.length > 7">
        已经到底了~
      </div>
    </div>
  </div>
</template>
<script>
import { config } from "../../config/api";
export default {
  name: "hotel",
  data() {
    return {
      isReady: false,
      arr: ["1", "1", "1", "1", "1", "1", "1", "1"],
      page: 1,
      limit: 8,
      hotelData: [],
      // 是否已是所有数据
      isOver: false,
      config,
    };
  },
  methods: {
    getMore() {
      const isReady = this.isReady;
      if (isReady || this.isOver) {
        return;
      }
      this.page++;
      this.getData();
      this.isReady = true;
      this.$nextTick(() => {
        this.isReady = false;
      });
    },
    getData() {
      const page = this.page;
      const limit = this.limit;
      const params = {
        page,
        limit,
      };
      this.$http.get("/hotel/select", params).then((res) => {
        if (res.code == "200") {
          if (page == 1) {
            this.hotelData = res.data;
          } else {
            this.hotelData = [...this.hotelData, ...res.data];
          }
          if (page * limit > res.count) {
            this.isOver = true;
          } else {
            this.isOver = false;
          }
        }
      });
    },
    handleScroll() {
      console.log(111);
      let offsetHeight = document.querySelector("#box").offsetHeight;
      let offsetScoll = document.querySelector("#out-box").scrollTop;
      let height = document.querySelector("#out-box").offsetHeight;
      if (offsetHeight - height < offsetScoll + 10) {
        this.getMore();
      }
    },
  },
  mounted() {
    this.getData();
    this.$nextTick(() => {
      const el = document.getElementById("out-box");
      el.addEventListener("scroll", this.handleScroll);
    });
  },
  destroyed() {
    console.log(222);
    const el = document.getElementById("out-box");
    el && el.removeEventListener("scroll", this.handleScroll);
  },
};
</script>
<style lang="less" scoped>
.hotel {
  height: 100vh;
  background: #eee;
  overflow: hidden;
  .out-box {
    height: 100%;
    overflow-y: scroll;
    .box {
      display: flex;
      flex-wrap: wrap;
      padding: 20px;

      .item {
        width: 48%;
        height: 200px;
        background: #fff;
        border-radius: 5%;
        margin-bottom: 20px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .img {
          width: 100%;
          flex: 1;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        .text {
          padding: 3px 10px;
          .name {
            font-size: 14px;
            font-weight: 600;
          }
          .slogan {
            display: inline-block;
            font-size: 12px;
            color: #ccc;
            padding: 2px;
            border-radius: 5px;
            background: #eee;
            max-width: 100%;
          }
          .text-over {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .price {
            color: red;
            font-size: 12px;
            span {
              font-size: 18px;
            }
          }
        }
        &:nth-of-type(2n-1) {
          margin-right: 4%;
          margin-top: -50px;
        }
        &:nth-of-type(1) {
          height: 150px;
          margin-top: 0;
          // margin-bottom: 0;
        }
      }
    }
  }
  .isOver {
    text-align: center;
    font-size: 12px;
    margin-bottom: 10px;
  }
}
</style>