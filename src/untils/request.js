import theAxios from 'axios'
import { getToken, delToken } from '@/untils/token'

const axios = theAxios.create({
  baseURL: 'http://127.0.0.1:3007',
  timeout: 20000
})

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前判断请求头有没有携带token
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  if (response.data.message === '身份认证失败') {
    alert('身份已过期')
    delToken()
    location.href = '/reg_login'
  }
  return response
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error)
})

export default ({ url, method = 'GET', data = {}, params = {}, headers = {} }) => {
  return axios({
    url,
    method,
    data,
    params,
    headers
  })
}
