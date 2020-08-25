"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _url = require("./url");

var _auth = require("./auth");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var instance = _axios["default"].create({
  baseURL: _url.BASE_URL,
  timeout: 80000,
  headers: {
    'X-Custom-Header': 'foobar'
  }
});

instance.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (error.message.includes('timeout')) {
    // 判断请求异常信息中是否含有超时timeout字符串
    return Promise.reject(error); // reject这个错误信息
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

instance.interceptors.request.use(function (config) {
  // console.log(config, config.url)
  var url = config.url;

  if (url.startsWith('/user') && !url.startsWith('/user/login') && !url.startsWith('/user/registered')) {
    // 添加请求头
    config.headers.Authorization = (0, _auth.getToken)();
  }

  return config;
}); // 添加响应拦截器

instance.interceptors.response.use(function (response) {
  // console.log(response)
  var status = response.data.status;

  if (status === 400) {
    // 此时，说明 token 失效，直接移除 token 即可
    (0, _auth.removeToken)();
  }

  return response;
});
var _default = instance;
exports["default"] = _default;