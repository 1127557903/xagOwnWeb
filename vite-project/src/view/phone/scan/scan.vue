<!-- 扫码 -->
<template>
  <div class="scan" ref="scanRef">
    <!-- <input type="file" accept="image/png, image/jpeg" @change="changeFile" /> -->
    <components-back
      rightIcon="icon-picture"
      @rightClick="changeFile()"
      class="back"
    ></components-back>
    <video ref="videoRef"></video>
    <div class="video-box" ref="videoboxRef">
      <div class="line"></div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import jsQR from "jsqr";
import { get } from "@/service";
import { Dialog } from 'vant';
import componentsBack from "@/components/common/back.vue";

const customData = reactive({
  width: "",
  height: "",
  boxWidth: "",
  boxHeight: "",
});

const videoRef = ref(null);
const scanRef = ref(null);
const videoboxRef = ref(null);

// 启动调用摄像头
const onDecode = (val) => {
  // alert(customData.height)
  let constraints = {
    video: {
      width: customData.height,
      height: customData.width,
      sourceId: "default",
      //   facingMode: { exact: "user" },
      facingMode: { exact: "environment" },
      // 后置摄像头
    },
    audio: false,
  };
  let promise = navigator.mediaDevices.getUserMedia(constraints);
  // 成功调用
  promise.then(function (MediaStream) {
    /* 使用这个MediaStream */
    videoRef.value.srcObject = MediaStream;
    videoRef.value.play();

    var getCode = setInterval(async () => {
      let data = await drawImage();
      if (data) {
        handleRequest(data);
        clearInterval(getCode);
      }
    }, 500);
  });
  // 失败调用
  promise.catch(function (err) {
    /* 处理error */
    console.log(err); // 拒签
  });
};

const urlToData = (url) => {
  return new Promise((resolve, reject) => {
    var img = document.createElement("img");
    img.src = url;
    img.onload = function () {
      var mycanvas = document.createElement("canvas");
      mycanvas.width = img.width;
      mycanvas.height = img.height;
      var ctx = mycanvas.getContext("2d");

      ctx.drawImage(img, 0, 0);
      var imageData = ctx.getImageData(0, 0, img.width, img.height);
      console.log(imageData);

      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });
      if (code) {
        resolve(code.data);
      } else {
        reject("识别错误");
      }
    };
  });
};

// 选择文件扫描
const changeFile = () => {
  let input = document.createElement("input");
  input.type = "file";
  input.accept = "image/png, image/jpeg";
  input.click();
  input.onchange = (e) => {
    console.log(1111);
    var fileReader = new FileReader();

    fileReader.onload = async function (event) {
      var data = event.target.result;
      let result = await urlToData(data);
      if (result) {
        handleRequest(result);
      }
    };
    fileReader.readAsDataURL(e.target.files[0]);
  };
};

const drawImage = async () => {
  let { width, height, boxWidth, boxHeight } = customData;
  // let res = await html2canvas(videoRef.value, { width: 100, height: 100 });
  var mycanvas = document.createElement("canvas");
  mycanvas.width = boxWidth;
  mycanvas.height = boxHeight;
  var ctx = mycanvas.getContext("2d");

  ctx.drawImage(
    videoRef.value,
    (width - boxWidth) / 2,
    (height - boxHeight) / 2,
    boxWidth,
    boxHeight,
    0,
    0,
    boxWidth,
    boxHeight
  );
  let img = mycanvas.toDataURL("image/jpeg");

  //   var img = res
  //     .toDataURL("image/png")
  //     .replace("image/png", "image/octet-stream");
  //     console.log(res)
  let result = await urlToData(img);
  return result;
};

// 处理扫描结果
const handleRequest = (result) => {
  get(result).then((res) => {
    if(res.code == 200) {
      Dialog.confirm({
        title: '登录成功',
        message:
          '请确认是否需要登录',
      })
        .then(() => {
          // on confirm
          get('/login/sureCodeLogin?code='+res.data.code).then(result => {
            alert(result.msg)
          })
        })
        .catch(() => {
          // on cancel
        });
    }
  });
};

const detectDeviceType = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
    ? "手机"
    : "电脑"; //检测登陆设备

onMounted(() => {
  let type = detectDeviceType();
  customData.width = scanRef.value.clientWidth;
  customData.height = scanRef.value.clientHeight;
  //   alert(customData.height)
  customData.boxWidth = videoboxRef.value.clientWidth;
  customData.boxHeight = videoboxRef.value.clientHeight;
  if (type == "手机") {
    onDecode();
  }
});
</script>
<style lang="scss" scoped>
@keyframes example {
  0% {
    bottom: 10%;
    border-bottom: 1px solid #0074e1;
    border-top: unset;
    background: linear-gradient(#bddcfc80, #0074e180);
  }
  49% {
    top: 80%;
    border-bottom: 1px solid #0074e1;
    border-top: unset;
    background: linear-gradient(#bddcfc80, #0074e180);
  }
  50% {
    top: 80%;
    border-top: 1px solid #0074e1;
    border-bottom: unset;
    background: linear-gradient(#0074e180, #bddcfc80);
  }
  100% {
    top: 10%;
    border-top: 1px solid #0074e1;
    border-bottom: unset;
    background: linear-gradient(#0074e180, #bddcfc80);
  }
}
.scan {
  width: 100%;
  height: 100%;
  position: relative;
  .back {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
  }
  video {
    width: 100%;
    height: 100%;
  }
  .video-box {
    width: 100%;
    padding-top: 100%;
    // border: 1px solid red;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: url("@/assets/img/scan/scan.png") no-repeat 0 0;
    background-size: cover;
    .line {
      position: absolute;
      top: 10%;
      left: 10%;
      height: 10%;
      width: 80%;
      animation-name: example;
      animation-duration: 4s;
      animation-iteration-count: infinite;
      animation-timing-function: ease;
      // animation-direction: alternate;
    }
  }
}
</style>
