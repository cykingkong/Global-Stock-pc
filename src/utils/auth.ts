
import { useLocalStorage } from '@vueuse/core'

const token = useLocalStorage('access_token', '')



function isLogin() {
  return !!token.value
}

function getToken() {
  return token.value
}

function setToken(newToken: string) {
  console.log(newToken, 'new')
  token.value = newToken
}

function clearToken() {
  token.value = null
}

export { isLogin, getToken, setToken, clearToken }
