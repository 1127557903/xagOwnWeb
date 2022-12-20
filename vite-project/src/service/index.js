import axios from 'axios'
import {
  Toast
} from 'vant';
import store from '../store';
import { TOKEN,EQUIPMENT } from '../store/constants';
import { ElMessage } from 'element-plus'

var instance = axios.create({
  baseURL: '/api',
  timeout: 80000,
});

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

const get = (url, data = {},config={}) => {
  return new Promise((resolve, reject) => {
    console.log(data, '查询数据')
    instance.get(url, {
        params: data
      },config)
      .then(function (res) {
        hints(res.data)
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
        hints(res.data)
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
        hints(res.data)
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
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
      duration: 0
    });
  }
  // 在发送请求之前做些什么，例如加入token
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
instance.interceptors.response.use(function (response) {
  // 在发送请求之前做些什么，例如加入token
  Toast.clear();
  return response;
}, function (error) {
  alert(error.toString())
  Toast.clear();
  if (error.toString() == 'Error: timeout of 10000ms exceeded') {
    Toast.fail('请求超时，请重试！')
  } else {
    Toast.fail('请求错误，请重试！')
  }
  return Promise.reject(error);
});

export {get,post,file}