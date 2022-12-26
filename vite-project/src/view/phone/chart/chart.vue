<template>
  <div class="chart">
    <div class="chart-out" v-if="!customData.isOpenChart">
      <div
        class="out-left"
        @click="customData.isOpenChart = !customData.isOpenChart"
      >
        我有话要说....
      </div>
      <div class="out-right">
        <div class="icon-box">
          <span class="icon iconfont icon-comment"></span>
          <p>1111</p>
        </div>
        <div class="icon-box">
          <van-icon name="good-job-o" v-if="!isGood" />
          <van-icon name="good-job" v-else />
          <p>1111</p>
        </div>
        <div class="icon-box">
          <span class="icon iconfont icon-favorite" v-if="!isFavorite"></span>
          <span class="icon iconfont icon-favorite-filling" v-else></span>
          <p>1111</p>
        </div>
        <div class="icon-box">
          <van-icon name="share-o" />
          <p>1111</p>
        </div>
      </div>
    </div>
    <div class="chart-inner web-phone fd-c" v-else>
      <div
        class="back-box"
        @click="customData.isOpenChart = !customData.isOpenChart"
      ></div>
      <div class="chart-box">
        <div class="out-box">
          <p class="title">发表评论</p>
          <div class="input-box">
            <componentEditor
              maxHeight="300px"
              @focus="handleFocus"
              @input="handleInput"
              ref="editorRef"
            ></componentEditor>
          </div>
          <div class="image-btn jc-sb ai-c">
            <div class="left">
              <span @click="setImage" class="icon iconfont">&#xe6c6;</span>
              <span @click="handleShowEmo" class="icon iconfont">&#xe6d2;</span>
              <span class="icon iconfont">&#xe60d;</span>
            </div>
            <button class="ph-btn btn" v-if="customData.isNull" >发布</button>
            <button class="ph-btn ph-btn-primary btn" v-else @click="handleSubmit" >发布</button>
          </div>
        </div>
        <div class="inner-box" v-show="customData.isOpenEx">
          <div
            class="out-swiper"
            @touchstart="handleTouchStart"
            @touchmove.prevent="handleTouchMove"
            @touchend="handleTouchEnd"
            ref="outSwiperRef"
          >
            <!-- 轮转表情包 -->
            <div class="swiper d-f">
              <div
                class="swiper-item"
                v-for="(item, index) in customData.emo"
                :key="index"
              >
                <div
                  class="emo-box"
                  @click="chooseEmoji(one.src)"
                  v-for="one in item"
                  :key="one.id"
                >
                  <img :src="customData.HTTP + one.src" alt="" />
                </div>
              </div>
            </div>
            <!-- 表情包下标点 -->
            <div class="scroll-point" v-if="customData.circleLength > 1">
              <div
                class="circle"
                :class="{ 'circle-check': customData.circleIndex == index }"
                v-for="(item, index) in customData.circleLength"
                :key="index"
              ></div>
            </div>
          </div>
          <!-- 切换表情包分类标点 -->
          <div class="bottom-btn">
            <div class="bottom-scroll">
              <div
                v-for="(item, index) in customData.code"
                class="img-btn"
                :class="{
                  isChecked:
                    (!customData.isCheck && index == 0) ||
                    customData.isCheck == item.value,
                }"
                @click="moveEmo(item.value)"
                :key="item.id"
              >
                <img :src="customData.HTTP + item.img" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import componentEditor from "@/components/common/editor.vue";
import { reactive, ref } from "@vue/reactivity";
import { nextTick, onMounted } from "@vue/runtime-core";
import { get } from "@/service";
import config from "@/config/config";

defineProps({
  isGood: {
    type: Boolean,
    default: false,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['submit'])

const editorRef = ref(null);
const outSwiperRef = ref(null);
const setImage = () => {
  editorRef.value.setImage();
};

const chooseEmoji = (src) => {
  editorRef.value.chooseEmoji(config.HTTP + src, "emo");
  console.log(src);
};

const customData = reactive({
  isOpenChart: false,
  isOpenEx: false,
  startX: 0,
  startScrollLeft: 0,
  dis: 0,
  code: [],
  emo: [],
  HTTP: config.HTTP,
  isCheck: "",
  circleLength: 0,
  circleIndex: 0,
  isNull: true
});

const handleFocus = () => {
  customData.isOpenEx = false;
};

const handleShowEmo = () => {
  customData.isOpenEx = !customData.isOpenEx;
  nextTick(() => {
    if (!customData.isOpenEx) {
      editorRef.value.handleFocus();
    }
  });
};

const setCircleData = (i) => {
  customData.isCheck = customData.emo[i][0].type;
  let newArr = customData.emo.filter(
    (item) => item[0].type == customData.isCheck
  );
  customData.circleLength = newArr.length;
  customData.circleIndex = newArr.findIndex(
    (item) => item[0].id == customData.emo[i][0].id
  );
};

const moveEmo = (val) => {
  customData.isCheck = val;
  let index = customData.emo.findIndex((item) => item[0].type == val);
  let left = document.getElementsByClassName("swiper-item")[index].offsetLeft;
  outSwiperRef.value.scrollLeft = left;
  // 小圆点定位
  setCircleData(index);
};

// touch三事件为下方滑动事件
const handleTouchStart = (e) => {
  customData.dis = 0;
  customData.startX = e.targetTouches[0].pageX;
  customData.startScrollLeft = outSwiperRef.value.scrollLeft;
  // alert(customData.startScrollLeft)
};

const handleTouchMove = (e) => {
  let { startX, startScrollLeft } = customData;
  let pageX = e.targetTouches[0].pageX;
  customData.dis = startX - pageX;
  outSwiperRef.value.scrollLeft = customData.dis + startScrollLeft;
};

const handleTouchEnd = () => {
  let { startScrollLeft, dis } = customData;
  let itemWidth = document.getElementsByClassName("swiper-item")[0].clientWidth;
  let newScrollLeft = outSwiperRef.value.scrollLeft;
  let reDis = 0;
  let newDis = 0;
  if (dis > 0) {
    reDis = itemWidth - dis;
    newDis = itemWidth;
  }
  if (dis < 0) {
    reDis = -itemWidth - dis;
    newDis = -itemWidth;
  }
  let maxTime = 40;
  let num = reDis / maxTime;
  let index = 0;
  let i = Math.round((startScrollLeft + newDis) / itemWidth);
  let left = document.getElementsByClassName("swiper-item")[i].offsetLeft;
  var timer = setInterval(() => {
    index++;
    if (index == maxTime) {
      outSwiperRef.value.scrollLeft = left;
      clearInterval(timer);
    } else {
      outSwiperRef.value.scrollLeft = newScrollLeft + index * num;
    }
  }, 5);
  setCircleData(i);
};

const handleInput = (val) => {
  customData.isNull = val
}

const getData = () => {
  get("/emo/selectAll")
    .then((res) => {
      console.log(res);
      customData.code = res.data.code;
      let emo = res.data.emo;
      let num = 15;
      let arr = [];
      let newIndex = 0;
      emo.reduce((pre, cur, index) => {
        let i = arr.length;
        if (newIndex % num == 0 || pre !== cur.type) {
          arr.push([cur]);
          newIndex = 1;
        } else {
          arr[i - 1].push(cur);
          newIndex++;
        }
        return cur.type;
      });
      customData.emo = [...arr];
      setCircleData(0);
      console.log(arr);
    })
    .catch((err) => {
      console.log("err", err);
    });
};

const handleSubmit = ()=>{
  const data = editorRef.value.handleSubmit();
  emit('submit',data)
}

onMounted(() => {
  getData();
});

// 收起键盘
//  document.activeElement.blur();
</script>
<style lang="scss" >
.chart {
  .chart-out {
    height: 50px;
    background: #f5f4f4;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .out-left {
      height: 40px;
      width: 100px;
      background: #fff;
      border-radius: 5px;
      line-height: 40px;
      padding: 0 10px;
      color: #ccc;
    }
    .out-right {
      width: 150px;
      display: flex;
      justify-content: space-around;
      align-items: center;

      p{
        font-size: 12px;
      }

      .icon,
      .van-icon {
        font-size: 24px;
        color: #a2a2a2;
      }
    }
  }
  .chart-inner {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    .back-box {
      background-color: #6868684f;
      flex: 1;
    }

    .chart-box {
      background: #fff;
      border-radius: 10px;

      .title {
        font-size: 12px;
      }

      .out-box {
        padding: 10px;

        .input-box {
          margin: 10px 0;
        }

        .left {
          .icon {
            font-size: 24px;
            margin-right: 20px;
          }
        }
      }

      .inner-box {
        width: 100%;

        .scroll-point {
          position: absolute;
          bottom: 70px;
          left: 0;
          // transform: translate(-50%,0);
          width: 100%;
          display: flex;
          justify-content: center;

          .circle {
            width: 5px;
            height: 5px;
            border-radius: 30px;
            background: #ccc;
            margin: 0 5px;
          }

          .circle-check {
            background: #909090;
          }
        }

        .out-swiper {
          width: 100%;
          overflow-x: hidden;
          background: #f7f7f7;
          padding: 10px 0;

          .swiper {
            width: max-content;

            .swiper-item {
              width: 100vw;
              height: 210px;
              max-width: 400px;
              overflow: hidden;
              display: flex;
              flex-wrap: wrap;

              .emo-box {
                width: 14%;
                height: 70px;
                margin-left: 5%;
                display: flex;
                align-items: center;

                img {
                  width: 100%;
                  object-fit: cover;
                }
                &:nth-of-type(5n) {
                  margin-right: 5%;
                }
              }
            }
          }
        }

        .bottom-btn {
          height: 60px;
          background: #fff;
          width: 100%;
          overflow-y: hidden;
          overflow-x: scroll;

          .bottom-scroll {
            width: max-content;
            display: flex;

            .img-btn {
              width: 60px;
              height: 60px;
              display: flex;
              align-items: center;
              justify-content: center;

              img {
                width: 30px;
                height: 30px;
                object-fit: cover;
              }
            }

            .isChecked {
              background: #f7f7f7;
            }
          }
        }
      }
    }
  }
}
</style>