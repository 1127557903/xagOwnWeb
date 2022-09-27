<template>
  <div class="spotdetail">
    <van-nav-bar left-arrow fixed @click-left="$router.go(-1)">
      <template #right>
        <van-icon name="like-o" size="18" />
        <van-icon name="share-o" style="margin-left: 20px" size="18" />
      </template>
    </van-nav-bar>
    <div class="image">
      <img src="../../assets/aaa.png" alt="" />
      <div class="box"></div>
    </div>
    <div class="detail">
      <h2>{{ place.name }}</h2>
      <!-- <h3>Fruit Ditch Bridge</h3> -->
      <!-- <p class="ranking">在所属大区内综合排名第 1丨评分 8 . 5</p> -->
      <p class="type">
        {{ place.address }}丨{{ place.play }}丨推荐游玩 {{ place.days }} 天
      </p>
      <div class="label">
        <span v-for="(item, index) in place.label" :key="index">{{
          item
        }}</span>
      </div>
      <div class="myinner">
        <div class="title">速写</div>
        <div class="text">
          <span class="main">印象:</span>
          {{ place.impression }}
        </div>
        <div class="text">
          <span class="main">简介 : {{ place.symbol }}</span>
        </div>
        <div class="card">
          <div class="title" v-if="son.length > 0" >子景点</div>
          <div class="children">
            <div class="children_flex">
              <div class="child" v-for="item in son" :key="item.id">
                <img :src="config.HTTP + item.img" alt="" />
                <h3>{{ item.name }}</h3>
                <p>{{ item.type }}</p>
                <div>{{ item.text }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="title">评论</div>
          <div
            class="one_comment"
            v-for="(item, index) in allComment"
            :key="item.id"
          >
            <div class="head">
              <img :src="config.HTTP + item.head_img" alt="" />
              <div class="right">
                <p class="name">{{ item.nick_name }}</p>
                <p class="num">{{ index + 1 }}F</p>
              </div>
            </div>
            <div class="inner_text" v-html="item.text"></div>
            <div
              class="recomment"
              v-if="item.reply && item.reply.length !== 0"
              @click="showAllReply(index)"
            >
              <p v-if="i < 2" v-for="(one, i) in item.reply" :key="one.r_id">
                <span>{{ one.from_nick_name }}</span
                >回复<span>{{ one.to_nick_name }}</span
                >:{{ one.reply_text }}
              </p>
              <div class="commentNum" v-if="item.reply.length > 2">
                全部{{ item.reply.length }}条评论>
              </div>
            </div>
            <div class="comment_bottom">
              <div class="time">{{ item.create_time | timeChange }}</div>
              <div class="zan">
                <span>
                  <van-icon
                    @click="showtell(item.u_id, item.id, item.nick_name)"
                    name="comment-o"
                    size="20"
                  />回复
                </span>
                <span>
                  <van-icon
                    @click="good(item.id)"
                    v-if="had(item.id)"
                    name="good-job-o"
                    size="20"
                  />
                  <van-icon
                    @click="notgood(item.id)"
                    v-else
                    name="good-job"
                    size="20"
                  />
                  {{ item.likes }}
                </span>
              </div>
            </div>
            <van-divider style="margin: 0" />
          </div>
          <img v-if="!allComment || allComment.length == 0" style="width:100%" src="@/assets/nocomment.png" alt="">
        </div>
      </div>
    </div>
    <div style="height: 50px"></div>
    <div class="comment">
      <div class="totell" @click="showtell">我有话要说...</div>
    </div>

    <!-- 输入评论展示 -->
    <van-popup v-model="show" position="bottom" round>
      <div class="comment_inner">
        <div class="comment_head">
          <span>{{ toUser.name ? "回复 " + toUser.name : "发布评论" }}</span>
          <van-icon name="expand-o" />
        </div>
        <div>
          <v-edit-div ref="comm" v-model="comment"></v-edit-div>
          <!-- <span>{{comment}}</span> -->
        </div>
        <!-- <van-field
            ref="tocomment"
            v-model="comment"
            rows="1"
            type="textarea"
            placeholder="我有话要说..."
          /> -->
        <div class="bottom">
          <div class="icon">
            <van-icon name="smile-o" size="24" />
            <van-uploader
              v-if="!replayId"
              v-model="fileList"
              multiple
              :preview-image="false"
              :after-read="afterRead"
            >
              <van-icon name="photo-o" size="24" />
            </van-uploader>
          </div>
          <van-button type="info" @click="submit" size="mini">发布</van-button>
        </div>
      </div>
    </van-popup>

    <!-- 弹出展示回复 -->
    <van-popup
      v-model="showReply"
      position="bottom"
      round
      :style="{ height: '90%' }"
    >
      <div class="replyInner">
        <div class="replyHead">
          <van-icon name="cross" size="24" @click="showReply = false" />
          <div>{{ Findex }}楼评论</div>
          <van-icon name="ellipsis" size="24" />
        </div>
        <div class="content">
          <!-- 楼层人 -->
          <div>
            <div class="contentHead">
              <img :src="config.HTTP + oneReply.head_img" alt="" />
              <div class="right">
                <p class="name">{{ oneReply.nick_name }}</p>
                <div class="num">{{ oneReply.create_time | timeChange }}</div>
              </div>
            </div>
            <div class="inner_text" v-html="oneReply.text"></div>
            <div class="comment_bottom">
              <div class="look" @click="showReply = false" >查看原贴</div>
              <div class="zan">
                <span>
                  <van-icon
                    @click="good(oneReply.id)"
                    v-if="had(oneReply.id)"
                    name="good-job-o"
                    size="20"
                  />
                  <van-icon
                    @click="notgood(oneReply.id)"
                    v-else
                    name="good-job"
                    size="20"
                  />
                  {{ oneReply.likes }}
                </span>
              </div>
            </div>
            <van-divider style="margin: 0" />
          </div>

          <!-- 回复楼层 -->
          <div v-for="item in oneReply.reply" :key="item.r_id">
            <div class="contentHead">
              <img :src="config.HTTP + item.from_head_img" alt="" />
              <div class="right">
                <p class="name">{{ item.from_nick_name }}</p>
              </div>
            </div>
            <div class="inner_text">
              <span v-if="item.to_id !== oneReply.u_id"
                >回复{{ item.to_nick_name }}</span
              ><span v-html="item.reply_text"></span>
            </div>
            <div class="comment_bottom">
              <div class="time">{{ item.reply_create_time | timeChange }}</div>
              <div class="zan">
                <span>
                  <van-icon
                    @click="
                      showtell(item.from_id, oneReply.id, item.from_nick_name)
                    "
                    name="comment-o"
                    size="20"
                  />回复
                </span>
                <span>
                  <van-icon
                    @click="good(oneReply.id, item.r_id)"
                    v-if="replyHad(item.r_id)"
                    name="good-job-o"
                    size="20"
                  /><van-icon
                    @click="notgood(oneReply.id, item.r_id)"
                    v-else
                    name="good-job"
                    size="20"
                  />
                  {{ item.r_likes }}
                </span>
              </div>
            </div>
            <van-divider style="margin: 0" />
          </div>

        </div>
        <div class="replyWrite">
          <div
            class="replyInput"
            @click="showtell(oneReply.u_id, oneReply.id, oneReply.nick_name)"
          >
            <span> 回复 {{ oneReply.nick_name }}</span>
          </div>
        </div>
      </div>
    </van-popup>


  </div>
</template>
<script>
import { Toast } from "vant";
import { config } from "../../config/api";

import vEditDiv from "../../config/components/v-edit-div.vue";
import moment from "moment";
import { timeChange } from "@/config/timefilter";

export default {
  name: "spotdetail",
  components: {
    vEditDiv,
  },
  data() {
    return {
      params: {},
      place: {},
      son: {},
      config,
      comment: "",
      show: false,
      replayId: "",
      allComment: [],
      // 回复图片文件
      fileList: [],
      // 展示reply条件
      showReply: false,
      // 当前楼层回复
      oneReply: {},
      // 楼层
      Findex: 0,
      // 点赞数组
      likes: [],
      // 回复用户id
      toUser: {
        id: "",
        name: "",
      },
      // 回复点赞数组
      replayLikes: [],
    };
  },
  methods: {
    // 判断回复是否点赞
    replyHad(val) {
      let res = this.replayLikes.find((item) => item == val);
      if (res) {
        return false;
      }
      return true;
    },
    // 判断评论点赞
    had(val) {
      let res = this.likes.find((item) => item == val);
      if (res) {
        return false;
      }
      return true;
    },
    // 点赞
    good(c_id, r_id) {
      let p_id = this.params.id;
      if (!p_id) {
        return;
      }
      let data = { c_id, p_id, r_id };
      this.$http.post("/place/good", data).then((res) => {
        if (res && res.code == "200") {
          this.getComment().then((result) => {
            if (r_id) {
              this.oneReply = { ...this.allComment[this.Findex - 1] };
              this.getAllReply();
            }
          });
          this.getCommentId();
        }
      });
    },
    notgood(c_id, r_id) {
      let data = {
        c_id,
        r_id,
      };
      this.$http.post("/place/notgood", data).then((res) => {
        if (res && res.code == "200") {
          this.getComment().then((result) => {
            if (r_id) {
              this.oneReply = { ...this.allComment[this.Findex - 1] };
              this.getAllReply();
            }
          });
          this.getCommentId();
        }
      });
    },
    // 展示二级评论
    showAllReply(index) {
      this.showReply = true;
      this.oneReply = { ...this.allComment[index] };
      this.Findex = index + 1;
      this.getAllReply();
    },
    // 获取二级评论点赞
    getAllReply() {
      let data = {
        c_id: this.oneReply.id,
      };
      this.$http.get("/place/getAllReply", data).then((res) => {
        if (res && res.code == "200") {
          this.replayLikes = res.data;
        }
      });
    },
    // 选择图片后函数
    afterRead(file, detail) {
      console.log(file, detail, "detail");
      this.comment = this.comment + `<img src="${file.content}" /></br>`;
      this.$nextTick(() => {
        this.$refs.comm.lastfocus();
      });
    },
    // 展示回复框
    showtell(id, c_id, name) {
      if (id && id > 0 && c_id && c_id > 0) {
        this.replayId = c_id;
        this.toUser.id = id;
        this.toUser.name = name;
      } else {
        this.replayId = "";
        this.toUser.id = "";
        this.toUser.name = "";
      }
      this.show = true;
      let that = this;
      this.$nextTick(() => {
        that.$refs.comm.lastfocus();
      });
    },
    // 提交
    submit() {
      if (!this.params.id) {
        Toast("无法回复");
        return;
      }
      if (!this.comment) {
        Toast("没有回复内容");
        return;
      }
      let data = {
        text: this.comment,
        p_id: this.params.id,
        c_id: this.replayId,
        to_id: this.toUser.id,
      };
      this.$http.post("/place/comment", data).then((res) => {
        if (res && res.code == "200") {
          Toast("回复成功");
          this.show = false
          this.getComment()
        }
      });
    },
    getData() {
      if (this.params) {
        this.$http.get("/place/select", { ...this.params }).then((res) => {
          if (res && res.code == "200") {
            console.log(res.data, "数据");
            this.place = res.data.place;
            this.son = res.data.son;
            Toast(res.msg);
            return;
          }
        });
      }
      // this.$http.post('/select')
    },
    // 获取已点赞的数据
    getCommentId() {
      let p_id = this.params.id;
      if (!p_id) {
        Toast("景点不存在");
      }
      let data = {
        p_id,
      };
      this.$http.get("/place/selectGood", data).then((res) => {
        if (res && res.code == "200") {
          this.likes = res.data;
          console.log(this.likes, "likes");
        }
      });
    },
    getComment() {
      return new Promise((resolve, reject) => {
        this.$http
          .get("/place/getComment", { p_id: this.params.id })
          .then((res) => {
            if (res && res.code == "200") {
              this.allComment = res.data;
              resolve(res.data);
            } else {
              reject(res.data);
            }
          });
      });
    },
  },
  filters: {
    timeChange(value) {
      return timeChange(value);
    },
  },
  mounted() {
    let { params } = this.$route;
    this.params = params;
    this.getData();
    this.getComment();
    this.getCommentId();
  },
};
</script>
<style lang="less" scoped>
.spotdetail {
  .comment {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background: #ebebeb;
    display: flex;
    align-items: center;
    .totell {
      width: 300px;
      height: 40px;
      background: #ffffff;
      margin-left: 10px;
      border-radius: 5px;
      line-height: 40px;
      text-indent: 20px;
      color: #bfbbbb;
    }
  }
  /deep/ .van-nav-bar {
    background: unset;
  }
  /deep/ .van-hairline--bottom::after {
    border: unset;
  }
  .image {
    position: relative;
    height: 200px;
    margin-bottom: -10px;
    overflow: hidden;
    img {
      width: 100%;
    }
    .box {
      position: absolute;
      width: 100%;
      height: 30px;
      border-radius: 8px;
      bottom: -20px;
      left: 0;
      background: #fff;
    }
  }
  .detail {
    border-radius: 8px;
    padding: 20px;
    z-index: 1;
    background-color: #fff;
    h2 {
      margin-bottom: 5px;
    }
    h3 {
      margin-bottom: 5px;
    }
    .ranking {
      color: #aaa;
      margin-bottom: 5px;
    }
    .type {
      color: #7a7a7a;
      margin-bottom: 5px;
    }
    .label {
      margin-bottom: 5px;

      span {
        background: #eeeeee;
        border-radius: 5px;
        padding: 5px;
        margin-right: 5px;
        color: #aaaaaa;
        font-size: 12px;
      }
    }
    .myinner {
      .text {
        padding: 10px 0;
        .main {
          color: #aaaaaa;
        }
        color: #606060;
      }
    }
    .card {
      .children {
        overflow-x: scroll;
        .children_flex {
          justify-content: space-between;
          width: fit-content;
          display: flex;
          flex-wrap: nowrap;
          .child {
            width: 200px;
            img {
              width: 100%;
              height: 200px;
            }
            p {
              color: #777777;
              font-size: 14px;
            }
            div {
              color: #777777;
              font-size: 13px;
            }
          }
        }
      }
    }
    .one_comment {
      .head {
        display: flex;
        align-items: center;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        .right {
          margin-left: 10px;
          .name {
            font-size: 14px;
            color: rgb(133, 132, 132);
          }
          .num {
            font-size: 12px;
            color: #c4c4c4;
          }
        }
      }
      .inner_text {
        margin-left: 50px;
        font-size: 16px;
      }
      .recomment {
        margin-left: 50px;
        background: #dfd8d8;
        border-radius: 5px;
        padding: 5px;
        p {
          color: #000;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          span {
            color: rgb(34, 137, 221);
          }
        }
        .commentNum {
          font-size: 14px;
          color: #888;
          padding: 2px 0;
        }
      }
      .comment_bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        color: #aaaaaa;
        padding: 10px 0;
        .zan {
          display: flex;
          align-items: center;
          span {
            display: flex;
            align-items: center;
            margin-left: 15px;
          }
        }
      }
    }
  }
}
.title {
  font-size: 16px;
  font-weight: 600;
  color: #464646;
  padding: 10px 10px;
  position: relative;
}
.title::after {
  position: absolute;
  content: "";
  top: 50%;
  left: 0;
  transform: translate(0, -50%);
  width: 3px;
  height: 15px;
  background-color: #aaaaaa;
}
.comment_inner {
  .comment_head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    span {
      font-size: 12px;
      color: #979696;
    }
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 0 16px;
    .icon {
      width: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
.replyInner {
  height: 100%;
  display: flex;
  flex-direction: column;
  .replyHead {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
  }
  .content {
    flex: 1;
    padding: 0 15px;
    overflow-y: scroll;
    .contentHead {
      display: flex;
      align-items: center;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      .right {
        margin-left: 10px;
        .name {
          font-size: 14px;
          color: rgb(133, 132, 132);
        }
        .num {
          font-size: 12px;
          color: #c4c4c4;
        }
      }
    }
    .inner_text {
      margin-left: 50px;
      font-size: 16px;
    }
    .recomment {
      margin-left: 50px;
      background: #dfd8d8;
      border-radius: 5px;
      padding: 5px;
      p {
        color: #000;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        span {
          color: rgb(34, 137, 221);
        }
      }
      .commentNum {
        font-size: 14px;
        color: #888;
        padding: 2px 0;
      }
    }
    .comment_bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      color: #aaaaaa;
      padding: 10px 0;
      .look {
        color: rgb(58, 144, 202);
      }
      .zan {
        display: flex;
        align-items: center;
        span {
          display: flex;
          align-items: center;
          margin-left: 15px;
        }
      }
    }
  }
  .replyWrite {
    background: #000;
    height: 50px;
    background: #f7f6f6;
    .replyInput {
      background: #fff;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      color: #ccc;
      margin: 10px 15px;
      border-radius: 3px;
      span {
        padding-left: 20px;
      }
    }
  }
}
</style>