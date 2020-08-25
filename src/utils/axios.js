import axios from 'axios'

import { BASE_URL } from './url'
import{getToken,removeToken} from './auth'

const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 80000,
    headers: { 'X-Custom-Header': 'foobar' },
});
instance.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.message.includes('timeout')) {   // 判断请求异常信息中是否含有超时timeout字符串
            return Promise.reject(error);          // reject这个错误信息
        }
        return Promise.reject(error); 
    });

/* 
  1 在 api.js 中，添加请求拦截器。
  2 获取到当前请求的接口路径（url）。
  3 判断接口路径，是否是以 /user 开头，并且不是登录或注册接口（只给需要的接口添加请求头）。
  4 如果是，就添加请求头 Authorization。
  5 添加响应拦截器。
  6 判断返回值中的状态码。
  7 如果是 400，表示 token 超时或异常，直接移除 token。
*/

// 添加请求拦截器
instance.interceptors.request.use(config => {
    // console.log(config, config.url)
    const { url } = config
    if (
      url.startsWith('/user') &&
      !url.startsWith('/user/login') &&
      !url.startsWith('/user/registered')
    ) {
      // 添加请求头
      config.headers.Authorization = getToken()
    }
    return config
  })
  
  // 添加响应拦截器
  instance.interceptors.response.use(response => {
    // console.log(response)
    const { status } = response.data
    if (status === 400) {
      // 此时，说明 token 失效，直接移除 token 即可
      removeToken()
    }
    return response
  })
export default instance