import axios from 'axios'
// import env from '../helpers/env_config'
import { getSessionStorage } from './helper'
import { SESSION, HEADER } from './constants'
const API_BASE_URL = process.env.API_BASE_URL
const TOKEN_PAYLOAD_KEY = 'authorization'
const PUBLIC_REQUEST_KEY = 'public-request'
const AxiosInterceptor = axios.create({
  baseURL: API_BASE_URL,
  // mode: 'cors',
  headers: {
    'Content-Type': HEADER.CONTENT_TYPE,
    'Access-Control-Allow-Origin': '*',
    // 'Content-Type': 'application/json; charset=utf-8',
    // 'Content-Type': 'multipart/form-data',
  },
  timeout: HEADER.TIMEOUT
})
export const axiosCallBlob = axios.create({
  responseType: 'blob',
  withCredentials: false,
  timeout: HEADER.TIMEOUT
})
export const axiosCall = axios.create({
  baseURL: API_BASE_URL,
  // mode: 'cors',
  responseType: 'blob',
  withCredentials: false,
  headers: {
    'Content-Type': HEADER.MULTIPART_CONTENT_TYPE,
    'Access-Control-Allow-Origin': '*'
  },
  timeout: HEADER.TIMEOUT
})
axiosCall.interceptors.request.use(config => {
  const jwtToken = getSessionStorage(SESSION.AUTH_TOKEN)
  if (jwtToken) {
    config.headers[TOKEN_PAYLOAD_KEY] = 'Bearer ' + jwtToken
  }
  if (!jwtToken && !config.headers[PUBLIC_REQUEST_KEY]) {
    // history(ENTRY_ROUTE)
  }
  return config
}, error => {
  return Promise.reject(error)
})
AxiosInterceptor.interceptors.request.use(config => {
  const jwtToken = getSessionStorage(SESSION.AUTH_TOKEN)
  if (jwtToken) {
    config.headers[TOKEN_PAYLOAD_KEY] = 'Bearer ' + jwtToken
  }
  if (!jwtToken && !config.headers[PUBLIC_REQUEST_KEY]) {
    // history(ENTRY_ROUTE)
  }
  return config
}, error => {
  // error goes here
  return Promise.reject(error)
})
AxiosInterceptor.interceptors.response.use((response) => {
  return response.data
}, (error) => {
  if (error.response.status === 400) {
    // unsetSessionStorage()
    const response = { status: 'error', msg: error.response.data.message }
    return Promise.reject(response)
  }
  if (error.response.status === 401) {
    // unsetLocalStorage()
    // localStorage.removeItem(AUTH_TOKEN);
    // history(ENTRY_ROUTE)
    error.response.data.message = 'Session closed ....you have been logged out!'
    const response = { status: 'error', msg: error.response.data.message }
    return Promise.reject(response)
    // return error.response.data.message = 'Session closed ....you have been logged out!'
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
  // return Promise.reject(error)
})
export default AxiosInterceptor