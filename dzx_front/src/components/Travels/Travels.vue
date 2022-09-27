<template>
  <div class="travels">
    <van-nav-bar left-arrow @click-left="$router.go(-1)">
      <!-- <template #right>
        <van-button type="info" plain @click="sub" size="mini">发布</van-button>
      </template> -->
    </van-nav-bar>

    <!-- 帖子 -->
    <div class="content">
      <div class="innercontent">
        <div class="title-head">
          <img :src="config.HTTP + travels.head_img" alt="" />
          <div class="right">
            <div class="name" >{{travels.nick_name}}</div>
            <div class="num">{{travels.sign}}</div>
          </div>
        </div>
        <h3>{{ travels.title }}</h3>
        <van-divider style="margin: 0" >文章发表: {{travels.create_time | timeChange}}|最后编辑: {{travels.create_time | timeChange}}</van-divider>
        <div v-html="travels.text"></div>
      </div>
      <div class="division"></div>

      <!-- 评论 -->
      <div class="comment">
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

    <!-- 底部用于回帖按钮 -->

    <div class="tell">
      <div class="innerInput" @click="showtell()" >我有话说...</div>
      <span>
        <van-icon name="comment-o" />
        <div>{{sum.comment}}</div>
      </span>
      <span>
        <van-icon v-if="!isGood" name="good-job-o" @click="goodTie()" />
        <van-icon v-else @click="notgoodTie()" name="good-job" />
        <div>{{sum.likes}}</div>
      </span>
      <span>
        <van-icon v-if="!isCollection" @click="collectionTie()" name="star-o" />
        <van-icon v-else name="star" @click="notcollectionTie()" />
        <div>{{sum.collection}}</div>
      </span>
    </div>

    <!-- 输入评论展示 -->
    <van-popup v-model="show" position="bottom" round>
      <div class="comment_inner">
        <div class="comment_head">
          <span>{{ toUser.name ? "回复 " + toUser.name : "发布评论" }}</span>
          <van-icon name="expand-o" />
        </div>
        <div>
          <v-edit-div ref="comm" v-model="comment"  hei="50px" ></v-edit-div>
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
              <div class="look" @click="showReply = false">查看原贴</div>
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
  name: "travels",
  components: {
    vEditDiv
  },
  data() {
    return {
      travels: {},
      params: {
        id:1,
      },
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
      // 改游记的收藏和评论数
      sum:{
        comment: 0,
        collection: 0,
        likes: 0
      },
      // 用于判断是否点赞
      isGood: false,
      // 判断是否收藏
      isCollection: false
    };
  },
  methods: {
    // 收藏游记
    collectionTie(){
      let data = {
        t_id: this.params.id
      }
      this.$http.post("/travels/collectionTie",data).then(res => {
        if(res && res.code == '200') {
          this.isCollection = true
          this.getsum()
        }
      })
    },
    // 取消收藏游记
    notcollectionTie(){
      let data = {
        t_id: this.params.id
      }
      this.$http.post("/travels/notcollectionTie",data).then(res => {
        if(res && res.code == '200') {
          this.isCollection = false
          this.getsum()
        }
      })
    },
    // 查询点赞收藏状态
    getstate(){
      let data = {
        t_id: this.params.id
      }
      this.$http.get("/travels/getstate",data).then(res => {
        if(res && res.code == '200') {
          this.isGood = res.data.likes
          this.isCollection = res.data.collection
        }
      })
    },
    // 给游记点赞
    goodTie(){
      let data = {
        t_id: this.params.id
      }
      this.$http.post("/travels/goodTie",data).then(res => {
        if(res && res.code == '200') {
          this.isGood = true
          this.getsum()
        }
      })
    },
    notgoodTie(){
      let data = {
        t_id: this.params.id
      }
      this.$http.post("/travels/notgoodTie",data).then(res => {
        if(res && res.code == '200') {
          this.isGood = false
          this.getsum()
        }
      })
    },
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
      let t_id = this.params.id;
      if (!t_id) {
        return;
      }
      let data = { c_id, t_id, r_id };
      this.$http.post("/travels/good", data).then((res) => {
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
        t_id: this.params.id,
        c_id: this.replayId,
        to_id: this.toUser.id,
      };
      this.$http.post("/travels/comment", data).then((res) => {
        if (res && res.code == "200") {
          Toast("回复成功");
          this.show = false
          this.getComment()
        }
      });
    },
    getData() {
      if (this.params) {
        this.$http.get("/travels/Travelsdata", { ...this.params }).then((res) => {
          if (res && res.code == "200") {
            this.travels = res.data
            Toast(res.msg);
            return;
          }
        });
      }
      // this.$http.post('/select')
    },
    // 获取已点赞的数据
    getCommentId() {
      let t_id = this.params.id;
      if (!t_id) {
        Toast("游记不存在");
      }
      let data = {
        t_id,
      };
      this.$http.get("/travels/selectGood", data).then((res) => {
        if (res && res.code == "200") {
          this.likes = res.data;        }
      });
    },
    getComment() {
      return new Promise((resolve, reject) => {
        this.$http
          .get("/travels/getTravels", { t_id: this.params.id })
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
    getsum() {
      let data = {
        id:this.params.id
      }
      this.$http.get("/travels/sum",data).then(res => {
        if(res && res.code == '200') {
          this.sum = res.data
        }
      })
    }
  },
  created() {
    let { params } = this.$route;
    this.params = params;
    this.getData();
    this.getComment();
    this.getCommentId();
    this.getsum();
    this.getstate();
  },
  filters: {
    timeChange(value) {
      return timeChange(value);
    },
  },
};
</script>
<style lang="less" scoped>
.travels {
  display: flex;
  flex-direction: column;
  height: 100vh;
  .content {
    flex: 1;
    overflow: scroll;
    h3{
      color: #86c5ff;
      text-align: center;
    }
    .innercontent {
      padding: 10px;
      .title-head{
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
      h3{
        margin-top: 10px;
      }
    }
    .division {
      height: 5px;
      background: #f8f5f5;
    }
    .comment {
      padding: 10px;
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
  .tell { 
    display: flex;
    align-items: center;
    padding: 0 10px;
    background: #f7f7f7;
    .innerInput {
      flex: 1;
      height: 25px;
      background: #fff;
      border-radius: 3px;
      font-size: 14px;
      color: #ccc;
      line-height: 25px;
    }
    span {
      text-align: center;
      padding: 5px 15px;
      color: #adadad;
      div {
        font-size: 12px;
        margin-top: -5px;
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