<template>
  <div class="home">
    <van-search v-model="value" placeholder="请输入搜索关键词" />
    <van-grid :column-num="5" :border="false">
      <van-grid-item
        v-for="item in title"
        :icon="item.src"
        @click="navto(item.value)"
        :key="item.id"
        :text="item.name"
      />
    </van-grid>
    <!-- 切页 -->
    <div class="card">
      <HomeTitle title="发现精彩" />
      <!-- <Introduction></Introduction> -->
      <div class="swipe">
        <van-swipe :autoplay="3000">
          <van-swipe-item v-for="item in wonderful" :key="item.id">
            <div class="marvellous">
              <img :src="config.HTTP + item.img" alt="" @click="moveto" />
            </div>
            <p>{{ item.type }}</p>
            <h3>{{ item.title }}</h3>
            <div class="inner">
              {{ item.text }}
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>
    </div>
    <div class="card">
      <HomeTitle title="目的地" />
      <div class="destination">
        <div class="destination_flex">
          <div
            class="destination_box"
            @click="showdetail(item.id)"
            v-for="item in spot"
            :key="item.id"
          >
            <img :src="config.HTTP + item.img" alt="" />
            <p>{{ item.name }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <HomeTitle title="热门推荐" />
      <div class="popular">
        <div class="imgs">
          <van-swipe :loop="false">
            <van-swipe-item
              v-for="item in road"
              :key="item.id"
              @click="toRoad(item)"
            >
              <div class="head">
                <div class="head_left">
                  <img :src="config.HTTP + item.head_img" alt="" />
                  <div>
                    <p>{{ item.nick_name }}</p>
                    <!-- <span>{{ quote?quote:0 }}人引用该行程</span> -->
                    <span>{{ item.creat_time | timeChange }}</span>
                  </div>
                </div>
                <div class="head_right" @click="likeornot(item.id)">
                  <span>{{ item.nums }}</span>
                  <van-icon name="like-o" size="12" v-if="!item.isLike" />
                  <van-icon name="like" size="12" v-else />
                </div>
              </div>
              <div class="marvellous">
                <img :src="config.HTTP + item.imgs[0]" alt="" />
              </div>
              <h3>{{ item.name }}</h3>
              <!-- <p>09.08-09.20</p> -->
              <div class="detail">
                {{ item.days }}·天数丨{{ item.num }}·景点丨{{
                  item.distance
                }}·公里
              </div>
            </van-swipe-item>
          </van-swipe>
        </div>
      </div>
    </div>
    <div style="height: 30px"></div>
  </div>
</template>

<script>
import Introduction from "../components/Introduction.vue";
import HomeTitle from "../components/HomeTitle.vue";
import { timeChange } from "@/config/timefilter";

import { config } from "../config/api";
import { Toast } from "vant";

export default {
  name: "Home",
  components: {
    Introduction,
    HomeTitle,
  },
  data() {
    return {
      active: 0,
      title: [
        {
          id: 1,
          name: "旅行路线",
          value: "addtrip",
          src: require("@/assets/road.png"),
        },
        {
          id: 2,
          name: "推荐行程",
          value: "alltrip",
          src: require("@/assets/destination.png"),
        },
        {
          id: 3,
          name: "景点",
          value: "allstop",
          src: require("@/assets/spot.png"),
        },
        {
          id: 4,
          name: "酒店",
          value: "hotel",
          src: require("@/assets/hotel.png"),
        },
        {
          id: 5,
          name: "公告",
          value: "allnotice",
          src: require("@/assets/notice.png"),
        },
      ],
      value: "",
      wonderful: [],
      spot: [],
      // 推荐路线数组
      road: [],
      config: config,
    };
  },
  methods: {
    // 去旅行路线
    toRoad(value) {
      let trip = JSON.parse(value.trip);
      this.$router.push({
        name: "trip",
        params: { trip, distance: value.distance },
      });
    },
    // 展示景点详细
    showdetail(id) {
      this.$router.push({ name: "spotDetail", params: { id } });
    },
    // 点赞或取消
    likeornot(r_id) {
      this.$http.post("/trip/likeornot", { r_id }).then((res) => {
        if (res && res.code == "200") {
          Toast(res.msg);
          this.getData();
        }
      });
    },
    navto(val) {
      this.$router.push("/" + val);
    },
    moveto() {
      console.log(111);
      this.$router.push("/spotDetail");
    },
    getData() {
      this.$http.get("/home/wonderful").then((res) => {
        console.log(res);
        this.wonderful = res.data;
      });
      this.$http.get("/trip").then((res) => {
        console.log(res);
        this.spot = res.data;
      });
      this.$http.get("/trip/selectRecommend").then((res) => {
        if (res && res.code == "200") {
          this.road = res.data.map((item) => {
            let Obj = item;
            Obj.imgs = JSON.parse(item.imgs);
            return Obj;
          });
          console.log(this.road);
        }
      });
    },
  },
  mounted() {
    this.getData();
  },
  filters: {
    timeChange(value) {
      console.log(value, "value");
      return timeChange(value);
    },
  },
};
</script>
<style lang="less" scoped>
.home {
  margin-bottom: 20px;
  background: #fff;
  /deep/ .van-swipe__indicators {
    display: none;
  }
  .swipe {
    .marvellous {
      height: 200px;
      overflow: hidden;
      img {
        width: 100%;
        height: 160px;
        display: block;
        background: #ccc;
        object-fit: cover;
        background-clip: padding-box;
        box-sizing: border-box;
      }
    }
    p {
      color: #aaaaaa;
    }
    h3 {
      color: #393939;
    }
    .inner {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
  .destination {
    overflow-x: scroll;
    .destination_flex {
      display: flex;
      flex-wrap: nowrap;
      width: max-content;
      .destination_box {
        height: 220px;
        width: 106px;
        margin-right: 5px;
        img {
          width: 100%;
          height: 159px;
          display: block;
          background: #ccc;
          object-fit: cover;
          background-clip: padding-box;
          box-sizing: border-box;
        }
      }
    }
  }
  .popular {
    .head {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      .head_left {
        display: flex;
        align-items: center;
        img {
          height: 30px;
          width: 30px;
          border-radius: 50%;
        }
        p {
          font-size: 16px;
          font-weight: 600;
        }
        span {
          font-size: 14px;
          color: #a0a0a0;
        }
      }
      .head_right {
        font-size: 14px;
        color: #a0a0a0;
      }
    }
    .marvellous img {
      width: 100%;
      display: block;
      background: #ccc;
      object-fit: cover;
      background-clip: padding-box;
      box-sizing: border-box;
    }
    .imgs {
      h3 {
        color: #424242;
      }
      p {
        color: #616161;
      }
      .detail {
        color: #aaaaaa;
      }
    }
  }
}
.card {
  // background-color: #ffffff;
  box-shadow: 4px 4px 7px 1px rgba(6, 0, 1, 0.06);
  // margin: 3px 0;
  padding: 0 20px;
}
</style>
