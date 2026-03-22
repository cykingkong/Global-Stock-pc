import { defineStore } from 'pinia'
import type { LoginData, UserState } from '@/api/user'
import { clearToken, setToken } from '@/utils/auth'
import { ref } from 'vue'
import {
  getEmailCode,
  getUserInfo,
  getBalancePair,
  getBalance, dataAssets,
  // resetPassword,
  login as userLogin,

  logout as userLogout,
  register as userRegister,
  totalAsset,
} from '@/api/user'

const InitUserInfo = {
  liveList: [],
}
export const useUserStore = defineStore('user', () => {
  const userInfo = ref<any>({ ...InitUserInfo })

  // Set user's information
  const setInfo = (partial: Partial<any>) => {
    userInfo.value = { ...userInfo.value, ...partial }
  }
  const setLiveList = (partial: any) => {
    userInfo.value.liveList = [...partial]
  }
  const login = async (loginForm: LoginData) => {
    try {
      const res = await userLogin(loginForm)
      console.log(res.data.token.access_token, 'datalogin')
      setToken(res.data.token.access_token)
      const userInfo = await getUserInfo()
      setInfo(userInfo)

    }
    catch (error) {
      clearToken()
      throw error
    }
  }
  // const loginByToken = async (params: any) => {
  //   try {
  //     const { data } = await seologin(params)
  //     setToken(data.access_token)
  //     const { data: userInfo } = await getUserInfo()
  //     setInfo(userInfo)
  //   }
  //   catch (error) {
  //     clearToken()
  //     throw error
  //   }
  // }
  const register = async (form: any) => {
    try {
      const { data } = await userRegister(form)
      setToken(data.access_token)
    }
    catch (error) {
      clearToken()
      throw error
    }
  }

  // const getWalletInfo = async () => {
  //   try {
  //     const { data } = await walletInfo({})
  //     setInfo(data)
  //   } catch (error) {
  //     throw error
  //   }
  // }

  const info = async () => {
    try {
      const { data } = await getUserInfo()
      const { data: ff2 } = await getBalance()
      // const { data: ff3 } = await totalAsset()
      setInfo(data)
      setInfo(ff2)
      // setInfo(ff3)
    }
    catch (error) {
      // clearToken()
      throw error
    }
  }
  const getInfo = async () => {
    try {
      const { data } = await getUserInfo()
      setInfo(data)
    }
    catch (error) {
      // clearToken()
      throw error
    }
  }
  const getAssetsData = async () => {
    try {
      const { data } = await dataAssets()
      setInfo(data)
    } catch (error) {
      // clearToken()
      throw error
    }
  }
  const logout = async () => {
    try {
      // await userLogout()
      clearToken()
      setInfo({ userId: "" })
    }
    finally {
      clearToken()
      setInfo({ ...InitUserInfo })
    }
  }

  const getCode = async () => {
    try {
      const data = await getEmailCode()
      return data
    }
    catch { }
  }




  return {
    userInfo,
    info,
    getInfo,
    login,
    logout,
    getCode,
    register,
    getAssetsData,

  }
}, {
  persist: true,
})

export default useUserStore
