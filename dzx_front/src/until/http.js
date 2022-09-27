import axios from 'axios'
import { Toast } from 'vant';
import vm from '../main'



var instance = axios.create({
  baseURL: '/api',
  timeout: 1000,
});

var http = {
    get: function(url,data={}){
      return  new Promise ((resolve,reject) => {
        instance.get(url,{params:data})
        .then(function (res) {
          if(res.data.code !== '200') {
            Toast.fail(res.data.msg);
          }
          resolve(res.data);
        })
        .catch(function (err) {
          reject(err)
        });
      })
    },
    post: function(url,data={}){
        return  new Promise ((resolve,reject) => {
          console.log(data,'data')
          instance.post(url,data)
          .then(function (res) {
            if(res.data.code !== '200') {
              Toast.fail(res.data.msg);
            }
            resolve(res.data);
          })
          .catch(function (err) {
            reject(err)
          });
        })
    },
    file: function(url,data={}){
      return  new Promise ((resolve,reject) => {
        console.log(data,'data')
        instance.post(url,data,{
          headers: {"Content-Type": "multipart/from-data"}
        })
        .then(function (res) {
          if(res.data.code !== '200') {
            Toast.fail(res.data.msg);
          }
          resolve(res.data);
        })
        .catch(function (err) {
          reject(err)
        });
      })
  },
}

instance.interceptors.request.use(function (config) {
  config = {
    ...config,
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('dzx')
    }
  }
  Toast.loading({
    message: '加载中...',
    forbidClick: true,
    duration:0
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
  let route = vm.$route.path
  let arr = ['/my']
  let res = arr.find(item => item == route)
  if(response.data.code == '304' && !res) {
    vm.$router.push('/login')
  }
  return response;
}, function (error) {
  Toast.clear();
  if(error.toString() == 'Error: timeout of 1000ms exceeded'){
    Toast.fail('请求超时，请重试！')
  } else {
    Toast.fail('请求错误，请重试！')
  }
  return Promise.reject(error);
});

export default http