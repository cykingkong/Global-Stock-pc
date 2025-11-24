// api/index.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://www.goldmanvotes.top',
  // baseURL: 'http://192.168.31.235:8299',
  timeout: 10000,
})

export default api
