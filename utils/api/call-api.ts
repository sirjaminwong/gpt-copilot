import axios from "axios"
import type { AxiosRequestConfig, Method } from "axios"

const httpClient = axios.create({
  baseURL: "https://api.openai.com/v1/chat/",
  timeout: 20000,
  withCredentials: true,
  headers: {
    Authorization:
      "Bearer " + "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"
  }
})

httpClient.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

httpClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export interface ResponseBody<T> {
  code: number
  message: string
  data: T
}

export const callInfoApi = async <T>(
  url: string,
  axiosConfig?: AxiosRequestConfig & {
    method?: Method
  }
) => {
  const response = await httpClient<ResponseBody<T>>({
    ...axiosConfig,
    url
  })
  return {
    ...response.data
  }
}
