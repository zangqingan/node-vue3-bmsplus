import axios from 'axios'
import { ElMessage, ElNotification } from 'element-plus'
import { mainStore } from '@/store'
// 是否显示重新登录
export const isRelogin = { show: false }

// 创建axios实例
const service = axios.create({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  baseURL: import.meta.env.VITE_APP_BASE_API as string | undefined,
  // 超时
  timeout: 10000
})

// request拦截器
service.interceptors.request.use(
  (config) => {
    // 是否需要设置 token
    // const token = mainStore.getters['UserStore/token']
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    token && (config.headers['Authorization'] = `Bearer ${token}`)
    return config
  },
  (error) => {
    console.log(error)
    Promise.reject(error).then()
  }
)

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200
    // 获取错误信息
    const msg = res.data.msg
    if (
      res.request.responseType === 'blob' ||
      res.request.responseType === 'arraybuffer'
    ) {
      return res.data
    }
    if (code === 401) {
      return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
    } else if (code === 500) {
      ElNotification.error(msg)
      return { result: false }
    } else if (code !== 200) {
      ElNotification({
        message: msg
      })
      return { result: false }
    } else {
      res.data.result = true
      return res.data
    }
  },
  (error) => {
    console.log(`err${error}`)
    let { message } = error
    if (message === 'Network Error') {
      message = '后端接口连接异常'
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      message = `系统接口${message.slice(-3)}异常`
    }
    ElMessage({
      message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
export default service
