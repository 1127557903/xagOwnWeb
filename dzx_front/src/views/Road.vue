<template>
  <div class="roat">
    <div class="top">
      <div class="bottom">
        <div class="information">
          <div>
            <van-icon name="location-o" />
            {{ city }}
            <van-icon name="fire-o" />
            7℃
          </div>
          <div>
            23225人正在旅行
            <van-icon name="arrow" />
          </div>
        </div>
        <div class="tabs">
          <van-grid :column-num="4" :border="false">
            <van-grid-item
              v-for="item in title"
              :icon="item.src"
              :key="item.id"
              :text="item.name"
            />
          </van-grid>
        </div>
      </div>
    </div>
    <div class="inner">
      <div class="cards">
        <div class="piaobox">
          <van-tabs v-model="activeName">
            <van-tab title="机票" name="a">
              <div class="mybox">
                <div class="swipt">
                  <div class="one" @click="onetwochange(1)">单程</div>
                  <div class="one" @click="onetwochange(2)">往返</div>
                  <div class="slide" :style="ones"></div>
                </div>
                <div class="address">
                  <div class="text">{{ city }}</div>
                  <img src="@/assets/fj.jpg" alt="" />
                  <div class="text">拉萨</div>
                </div>
                <div class="time">{{ time }} 今天</div>
                <van-divider />
                <div class="more">
                  <div class="left">
                    <img style="width: 24px" src="@/assets/jjc.png" alt="" />
                    <div>经济舱</div>
                  </div>
                  <van-radio-group v-model="radio" direction="horizontal">
                    <van-radio name="1" shape="square">婴儿</van-radio>
                    <van-radio name="2" shape="square">儿童</van-radio>
                  </van-radio-group>
                </div>
                <div class="btn">
                  <van-button
                    type="primary"
                    round
                    color="yellow"
                    style="color: #000"
                    size="large"
                    >搜索</van-button
                  >
                </div>
              </div>
            </van-tab>
            <van-tab title="火车票" name="b">
              <div class="mybox">
                <div class="swipt">
                  <div class="one" @click="onetwochange(1)">单程</div>
                  <div class="one" @click="onetwochange(2)">往返</div>
                  <div class="slide" :style="ones"></div>
                </div>
                <div class="address">
                  <div class="text">{{ city }}</div>
                  <img src="@/assets/hc.png" alt="" />
                  <div class="text">拉萨</div>
                </div>
                <div class="time">{{ time }} 今天</div>
                <van-divider />
                <div class="more">
                  <div
                    style="
                      display: flex;
                      justify-content: space-between;
                      width: 100%;
                    "
                  >
                    <van-radio name="1" shape="square">高铁动车</van-radio>
                    <van-radio name="2" shape="square">学生票</van-radio>
                  </div>
                </div>
                <div class="btn">
                  <van-button
                    type="primary"
                    round
                    color="yellow"
                    style="color: #000"
                    size="large"
                    >搜索</van-button
                  >
                </div>
              </div></van-tab
            >
            <van-tab title="汽车票" name="c">
              <div class="mybox">
                <div class="swipt">
                  <div class="one" @click="onetwochange(1)">单程</div>
                  <div class="one" @click="onetwochange(2)">往返</div>
                  <div class="slide" :style="ones"></div>
                </div>
                <div class="address">
                  <div class="text">{{ city }}</div>
                  <img src="@/assets/qc.png" alt="" />
                  <div class="text">拉萨</div>
                </div>
                <div class="time">{{ time }} 今天</div>
                <van-divider />
                <div class="more"></div>
                <div class="btn">
                  <van-button
                    type="primary"
                    round
                    color="yellow"
                    style="color: #000"
                    size="large"
                    >搜索</van-button
                  >
                </div>
              </div></van-tab
            >
          </van-tabs>
        </div>
      </div>
      <div class="card">
        <div class="innercard myinner">
          <div class="oneimgbox">
            <img src="@/assets/tj1.png" alt="" />
            <div>
              <h3>低价售票</h3>
              <p>低至百元</p>
            </div>
          </div>
          <div class="oneimgbox">
            <img src="@/assets/tj2.png" alt="" />
            <div>
              <h3>低价售票</h3>
              <p>低至百元</p>
            </div>
          </div>
          <div class="oneimgbox">
            <img src="@/assets/tj3.png" alt="" />
            <div>
              <h3>低价售票</h3>
              <p>低至百元</p>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="innercard">
          <HomeTitle
            title="地道美食"
            rightText="查看更多>"
            @handleRightClick="$router.push('/moredelicous')"
          />
          <div class="food">
            <div
              class="food_card"
              v-for="item in delicous"
              @click="$router.push('/delicous?id=' + item.id)"
              :key="item.id"
            >
              <img :src="config.HTTP + item.titleImg" alt="item" />
              <div class="text">{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="height: 60px"></div>
  </div>
</template>
<script>
import HomeTitle from "../components/HomeTitle.vue";
import { MP } from "../config/location";
import { config } from "../config/api";
import moment from "moment";

export default {
  name: "Home",
  components: {
    HomeTitle,
  },
  data() {
    return {
      city: "",
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
      ],
      activeName: "a",
      ones: { left: 0 },
      radio: "",
      value1: 0,
      option1: [
        { text: "全部商品", value: 0 },
        { text: "新款商品", value: 1 },
        { text: "活动商品", value: 2 },
      ],
      // 美食数组
      delicous: [],
      config,
    };
  },
  methods: {
    getCity() {
      let that = this;
      this.$nextTick(() => {
        MP(config.ak).then((BMap) => {
          var geoLocation = new BMap.Geolocation();
          geoLocation.getCurrentPosition((a) => {
            that.city = a.address.city;
            console.log(a, "a");
          });
        });
      });
    },
    onetwochange(value) {
      if (value == 1) {
        this.ones = { left: 0 };
      } else {
        this.ones = { left: "98px" };
      }
    },
    async getData() {
      let res = await this.$http.get("/delicous/select", { page: 1, limit: 3 });
      if (res.code == "200") {
        this.delicous = res.data;
      }
    },
  },
  created() {
    this.getCity();
    this.getData();
  },
  computed: {
    time() {
      return moment().format("MM月DD日");
    },
  },
};
</script>
<style lang="less" scoped>
.roat {
  background: #eee;
  .top {
    height: 300px;
    background: url("../assets/fj.png") no-repeat center top;
    position: relative;
    .bottom {
      position: absolute;
      width: 100%;
      bottom: 0;
      .information {
        display: flex;
        color: #fff;
        justify-content: space-between;
        margin: 0 20px;
      }
      .tabs {
        margin: 0 20px;
        background: #000;
        border-top-right-radius: 8px;
        border-top-left-radius: 8px;
        overflow: hidden;
        /deep/ .van-grid-item__content {
          background: #000;
          .van-grid-item__icon {
            border-radius: 50%;
            overflow: hidden;
            background: #fff;
          }
        }
        /deep/ .van-grid-item__text {
          color: #fff;
        }
      }
    }
  }
  .inner {
    .destination {
      overflow-x: scroll;
      padding-bottom: 10px;
      .destination_flex {
        display: flex;
        flex-wrap: nowrap;
        width: max-content;
        .destination_box {
          // height: 146px;
          width: 126px;
          margin-right: 10px;
          box-shadow: 1px 0px 15px 0px rgba(6, 0, 1, 0.08);
          border-radius: 5px;
          overflow: hidden;
          img {
            width: 100%;
            height: 126px;
          }
          .msg {
            font-size: 12px;
            padding: 5px;
            position: relative;
            .score {
              position: absolute;
              top: -5px;
              right: 5px;
              width: 26px;
              height: 26px;
              background: url("../assets/score.png") no-repeat;
              background-size: 26px 26px;
              text-align: center;
              color: #fff;
              font-size: 12px;
              line-height: 20px;
            }
          }
        }
      }
    }
    .food {
      display: flex;
      justify-content: space-between;
      .food_card {
        width: 100px;
        img {
          width: 100%;
          height: 100px;
          object-fit: cover;
        }
        .text {
          text-align: center;
          font-size: 12px;
        }
      }
    }
  }
}
.card {
  // background-color: #ffffff;
  // box-shadow: 4px 4px 7px 1px rgba(6, 0, 1, 0.06);
  // // margin: 3px 0;
  padding: 0 20px;
  .innercard {
    background: #fff;
    border-radius: 5px;
    margin: 10px 0;
    padding: 10px;
  }
}
.cards {
  padding: 0 20px;
}
.piaobox {
  background: #fff;
  border-radius: 5px;
  margin: 10px 0;
  // box-shadow: 4px 4px 7px 1px rgba(6, 0, 1, 0.6);
  overflow: hidden;
  .mybox {
    height: 230px;
    .swipt {
      width: 200px;
      height: 30px;
      border-radius: 5px;
      display: flex;
      background-color: #ccc;
      margin: 10px auto;
      position: relative;
      z-index: 1;
      .one {
        width: 50%;
        text-align: center;
        line-height: 30px;
        z-index: 3;
      }
      .slide {
        position: absolute;
        z-index: 2;
        background: #fff;
        width: 98px;
        margin: 2px;
        height: 26px;
        border-radius: 3px;
        top: 0;
        transition: 0.5s all;
      }
    }
    .address {
      display: flex;
      justify-content: space-between;
      margin: 0 20px;
      align-items: center;
      img {
        width: 36px;
        height: 36px;
      }
      .text {
        font-size: 20px;
        font-weight: 600;
      }
    }
    .more {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 10px 20px;
      height: 20px;
      .left {
        display: flex;
      }
    }
    .time {
      margin: 0 20px;
    }
    .btn {
      margin: 0 20px;
      .van-button__text {
        color: #000;
      }
    }
  }

  // .mytabs{
  //   display: flex;
  //   align-items: center;
  //   background: #98d0fa;
  //   .mytab{
  //     flex: 1;
  //     text-align: center;
  //     font-size: 18px;
  //     height: 36px;
  //     line-height: 36px;
  //     color:#5a7895;
  //   }
  // }
}
.myinner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  .oneimgbox {
    width: 33%;
    display: flex;
    align-items: center;
    img {
      width: 24px;
    }
    h3 {
      font-size: 16px;
    }
    p {
      font-size: 12px;
      color: #ccc;
    }
  }
}
</style>
