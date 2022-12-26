import axios from 'axios'
import {
  Toast
} from 'vant';
import store from '../store';
import { TOKEN,EQUIPMENT } from '../store/constants';
import { ElMessage } from 'element-plus'
import configData from '@/config/config';
import { ElLoading } from 'element-plus'
var instance = axios.create({
  baseURL: '/api',
  timeout: configData.timeout,
});
var isLoadingHttpNum = 0; //正在执行的loading的请求

// 提示根据当前设备判断使用提示类型
const hints = (res) =>{
  const equipment = store.getters[EQUIPMENT]
  if(equipment == '手机'){
    if (res.code == '200') {
      Toast.success(res.msg);
    } else {
      Toast.fail(res.msg);
    }
  } else if(equipment == '电脑'){
    if (res.code == '200') {
      ElMessage({
        message: res.msg,
        type: 'success',
      })
    } else {
      ElMessage.error(res.msg)
    }
  }
}

const hints2 = (msg,type) => {
  const equipment = store.getters[EQUIPMENT]
  if(equipment == '手机'){
    if(type == 'success'){
      Toast.success(msg);
    } else if(type == 'error') {
      Toast.fail(msg)
    } else if(type == 'loading') {
      Toast.loading({
        message: msg?msg:'加载中...',
        forbidClick: true,
        duration: 0
      });
    } else if(type == 'clear') {
      Toast.clear();
    }
  } else if(equipment == '电脑'){
    if(type == 'success'){
      ElMessage({
        message: msg,
        type: 'success',
      })
    } else if(type == 'error') {
      ElMessage.error(msg)
    } else if(type == 'loading') {
      ElLoading.service({text:msg?msg:'加载中...'})
    } else if(type == 'clear'){
      ElLoading.service({text:msg?msg:'加载中...'}).close()
    }
  }
}

const get = (url, data = {},config={}) => {
  return new Promise((resolve, reject) => {
    console.log(data, '查询数据')
    instance.get(url, {
        params: data
      },config)
      .then(function (res) {
        resolve(res.data);
      })
      .catch(function (err) {
        reject(err)
      });
  })
}

const post = (url, data = {},config={}) => {
  return new Promise((resolve, reject) => {
    console.log(data, '查询数据')
    instance.post(url, data,config)
      .then(function (res) {
        resolve(res.data);
      })
      .catch(function (err) {
        reject(err)
      });
  })
}

const file = (url, data = {},config={}) => {
  return new Promise((resolve, reject) => {
    console.log(data, '查询数据')
    instance.post(url, data, {
        ...config,
        headers: {
          "Content-Type": "multipart/from-data"
        },
      })
      .then(function (res) {
        resolve(res.data);
      })
      .catch(function (err) {
        reject(err)
      });
  })
}

instance.interceptors.request.use(function (config) {
  let token = store.getters[TOKEN]
  config = {
    ...config,
    headers: token ? {
      'Authorization': 'Bearer ' + token
    } : {}
  }
  if(!config.notLoading){
    // url做唯一标识
    isLoadingHttpNum++
    hints2(null,'loading')
  }
  // 在发送请求之前做些什么，例如加入token
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
instance.interceptors.response.use(function (response) {
  isLoadingHttpNum--
  // 在发送请求完成后
  hints(response.data)
  if(!isLoadingHttpNum){
    hints2(null,'clear')
  }  return response;
}, function (error) {
  console.log(error.toString())
  isLoadingHttpNum--
  if(!isLoadingHttpNum){
    hints2(null,'clear')
  }
  if (error.toString() == `AxiosError: timeout of ${configData.timeout}ms exceeded`) {
    hints2('请求超时，请重试！','error')
  } else {
    hints2(error.toString(),'error')
  }
  return Promise.reject(error);
});

export {get,post,file}