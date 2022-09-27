import axios from 'axios'
import {
  Toast
} from 'vant';
import store from '../store';
import { TOKEN } from '../store/constants';

var instance = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

const get = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    console.log(data, '查询数据')
    instance.get(url, {
        params: data
      })
      .then(function (res) {
        if (res.data.code !== '200') {
          Toast.fail(res.data.msg);
        }
        resolve(res.data);
      })
      .catch(function (err) {
        reject(err)
      });
  })
}

const post = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    console.log(data, '查询数据')
    instance.post(url, data)
      .then(function (res) {
        if (res.data.code !== '200') {
          Toast.fail(res.data.msg);
        }
        resolve(res.data);
      })
      .catch(function (err) {
        reject(err)
      });
  })
}

const file = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    console.log(data, '查询数据')
    instance.post(url, data, {
        headers: {
          "Content-Type": "multipart/from-data"
        }
      })
      .then(function (res) {
        if (res.data.code !== '200') {
          Toast.fail(res.data.msg);
        }
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
  Toast.loading({
    message: '加载中...',
    forbidClick: true,
    duration: 0
  });
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