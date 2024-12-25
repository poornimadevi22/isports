
import axios from 'axios'
import { getSessionStorage } from './helper'
import { SESSION, HEADER } from './constants'
const API_BASE_URL = process.env.API_BASE_URL
const TOKEN_PAYLOAD_KEY = 'authorization'
const PUBLIC_REQUEST_KEY = 'public-request'
const AxiosInterceptor = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Cache-control": "no-cache",
    "Content-type": "multipart/form-data",
    "escriptMasterDataType": "merchants",
  },
  timeout: HEADER.TIMEOUT
})
AxiosInterceptor.interceptors.request.use(config => {
  const jwtToken = getSessionStorage(SESSION.AUTH_TOKEN)
  if (jwtToken) {
    config.headers[TOKEN_PAYLOAD_KEY] = 'Bearer ' + jwtToken
  }
  if (!jwtToken && !config.headers[PUBLIC_REQUEST_KEY]) {
  }
  return config
}, error => {
  return Promise.reject(error)
})
AxiosInterceptor.interceptors.response.use((response) => {
  return response.data
}, (error) => {
  if (error.response.status === 400) {
    const response = { status: 'error', msg: error.response.data.message }
    return Promise.reject(response)
  }
  if (error.response.status === 401) {
    error.response.data.message = 'Session closed ....you have been logged out!'
    const response = { status: 'error', msg: error.response.data.message }
    return Promise.reject(response)
  }
  if (error.response.status === 403) {
    error.response.data.message = 'Authentication Fail'
    const response = { status: 'error', msg: error.response.data.message }
    return Promise.reject(response)
  }
  if (error.response.status === 404) {
    error.response.data.message = 'Not Found'
    const response = { status: 'error', msg: error.response.data.message }
    return Promise.reject(response)
  }
  if (error.response.status === 500) {
    error.response.data.message = 'Internal Server Error'
    const response = { status: 'error', msg: error.response.data.message }
    return Promise.reject(response)
  }
  if (error.response.status === 508) {
    error.response.data.message = 'Time Out'
    const response = { status: 'error', msg: error.response.data.message }
    return Promise.reject(response)
  }
})
export default AxiosInterceptor