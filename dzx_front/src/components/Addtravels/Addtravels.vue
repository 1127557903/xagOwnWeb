<template>
  <div class="addtravels">
    <van-nav-bar left-arrow @click-left="$router.go(-1)">
      <template #right>
          <van-button type="info" plain @click="sub"  size="mini" >发布</van-button>
      </template>
    </van-nav-bar>
    <div class="inputbox">
        <van-field v-model="value" @focus="showIcon = true" @blur="showIcon = false" placeholder="标题（必填）" />
        <div class="titleImg">
            <span>标题图片</span>
            <van-uploader v-model="img" max-count="1" />
        </div>
        <van-divider style="margin: 0" />
        <v-edit-div ref="comm" label="请尽情发挥吧..." :hei="1" v-model="comment"></v-edit-div>
        <div class="icon-box">
            <div class="disabel" v-if="showIcon">

            </div>
            <img src="@/assets/bq.png" alt="">
            <van-uploader
              v-model="fileList"
              :preview-image="false"
              :after-read="afterRead"
            >
              <img src="@/assets/tp.png" alt="">
            </van-uploader>
            <img src="@/assets/ztys.png" alt="">
            <img src="@/assets/clj.png" alt="">
            <!-- <van-uploader
              v-model="movies"
              accept="video/*"
              :preview-image="false"
              :after-read="afterReadSP"
            >
                <img src="@/assets/sp.png" alt="">
            </van-uploader> -->
        </div>
    </div>
  </div>
</template>
<script>
import { Toast,Dialog } from 'vant';
import vEditDiv from "../../config/components/v-edit-div.vue";
export default {
  name: "addtravel",
  components:{
      vEditDiv
  },
  data() {
    return {
        comment: '',
        fileList:[],
        value:'',
        movies:[],
        img:[],
        showIcon: false
    };
  },
  methods:{
    // 选择图片后函数
    afterRead(file, detail) {
      this.comment = this.comment + `<img style="max-width: 100%" src="${file.content}" />`;
      this.$nextTick(() => {
        this.$refs.comm.lastfocus();
      });
    },
    // // 选择视频后函数
    // afterReadSP(file, detail){
    //   this.comment = this.comment + `&nbsp;<video style="width: 100%;max-height: 200px;" src="${file.content}" controls="controls"></video>&nbsp;`;
    //   this.$nextTick(() => {
    //     this.$refs.comm.lastfocus();
    //   });
    // },
    checkInput(){
        if (!this.value) {
            Toast('请输入标题')
            return false
        }
        if(!this.img || this.img.length == 0) {
            Toast('请选择标题图片')
            return false
        }
        if(!this.comment) {
            Toast('请输入内容')
            return false
        }
        return true
    },
    sub(){
        if(!this.checkInput()){
            return
        }
        let param = new FormData(); // 创建form对象
        let that = this
        console.log(that.comment,'aaa')
        param.append("file[]", that.img[0].file); // 通过append向form对象添加数据
        param.append("text", that.comment)
        param.append("title", that.value)
        console.log(param,'param')
        this.$http.file('/travels/writeTravels',param).then(res => {
            if (res && res.code == '200') {
                Dialog.alert({
                    title: '提示',
                    message: res.msg,
                    }).then(() => {
                    this.$router.go(-1)
                });
            }
        })
    }
  }
};
</script>
<style lang="less" scoped>
.addtravels{
    height: 100vh;
    display: flex;
    flex-direction: column;
    .inputbox{
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .titleImg{
        display: flex;
        align-items: center;
        padding: 0 16px;
        color: #ababab;
        font-size: 14px;
        span{
            margin-right: 20px;
        }
    }
    .icon-box{
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 10px 0;
        position: relative;
        img{
            width: 24px;
        }
        .disabel{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            opacity: 0.8;
            background: #fff;
        }
    }
}
.icon-box /deep/ .van-uploader__input-wrapper {
    display: flex;
    align-items: center;
}
</style>